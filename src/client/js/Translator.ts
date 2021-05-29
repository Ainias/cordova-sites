import {NativeStoragePromise} from "./NativeStoragePromise";
import {Helper} from "./Legacy/Helper";
import {Translator as SharedTranslator} from "../../shared/Translator"

/**
 * Singleton-Klasse zum Übersetzen von Text-Inhalten
 */
export class Translator extends SharedTranslator{
    private _currentLanguage: string;
    private _nativeStorageKey: string;
    private _translationClass: string;
    private _initPromise: any;

    static logMissingTranslations: boolean;

    /**
     * Erstellt einen neuen Translator
     * @param config
     */
    constructor(config) {
        super(config);
        config = Helper.nonNull(config, {});

        this._currentLanguage = config.currentLanguage || this._fallbackLanguage;
        this._nativeStorageKey = config.nativeStorageKey || "language";
        this._translationClass = config.translationClass || "translation";

        this._initPromise = this.loadUserLanguage().then(userLanguage => this.setLanguage((<string>userLanguage).toLowerCase()));
    }

    /**
     * Setzt die neue Sprache, updated alle Übersetzungen. Speichert danach die aktuelle Sprache in NativeStorage
     * @param language
     */
    async setLanguage(language) {
        if (this._currentLanguage === language) {
            await this.updateTranslations();
            return;
        }

        if (!this._translations[language]) {
            return;
        }

        if (typeof document !== 'undefined') {
            document.getElementsByTagName("html")[0].setAttribute("lang", language);
        }

        this._currentLanguage = language;
        await this.updateTranslations();

        //zum schluss => Falls setzen des Keys fehlschlägt, wird trotzdem noch übersetzt
        await NativeStoragePromise.setItem(this._nativeStorageKey, this._currentLanguage);
    }

    /**
     * Übersetzt sofort einen Key in die aktuelle Sprache
     * @param key
     * @param args
     * @returns {*}
     */
    translate(key, args?, language?) {
        return super.translate(key, args, Helper.nonNull(language, this._currentLanguage));
    }


    /**
     * Fügt eine Callback hinzu, die aufgerufen wird, sobald die Seite übersetzt wird. Sollte genutzt werden, um Teile
     * zu übersetzen, die nicht per HTML übersetzt werden können, die der Document Title
     *
     * wenn callImmediately true ist (default), wird die Callback sofort einmal ausgeführt
     *
     * Gibt die CallbackId zurück
     *
     * @param callback
     * @param callImmediately
     * @returns {number}
     */
    addTranslationCallback(callback, callImmediately) {
        callImmediately = Helper.nonNull(callImmediately, true);

        this._lastTranslationCallbackId++;
        this._translationCallbacks.set(this._lastTranslationCallbackId, callback);
        if (callImmediately) {
            callback();
        }
        return this._lastTranslationCallbackId;
    }

    /**
     * Entfernt die Callback anhand der gegebenen ID
     *
     * @param callbackId
     */
    removeTranslationCallback(callbackId) {
        this._translationCallbacks.delete(callbackId);
    }

    /**
     * Updated die aktuellen übersetzungen
     */
    async updateTranslations(baseElement?) {
        baseElement = Helper.nonNull(baseElement, document);
        if (typeof baseElement !== 'undefined') {
            let elements = baseElement.getElementsByClassName(this._translationClass);
            for (let i = 0, max = elements.length; i < max; i++) {
                let key = (Translator._isValid(elements[i].dataset["translation"]) ? elements[i].dataset["translation"] : (elements[i].innerText || ""));
                if (key !== "" && !elements[i].dataset["onlyTranslateAttributes"]) {
                    try {
                        let translation = this.translate(key, (elements[i].dataset["translationArgs"] !== undefined) ? JSON.parse(elements[i].dataset["translationArgs"]) : undefined);
                        if (elements[i].dataset["translationUseText"] === "1") {
                            elements[i].innerText = translation;
                        } else {
                            elements[i].innerHTML = translation;
                        }
                        elements[i].dataset["translation"] = key;
                    } catch (err) {
                        console.error("wrong configured translation: " + err);
                    }
                }

                //Übersetzung von Attributen
                for (let k in elements[i].dataset) {
                    if (k.startsWith("translation") && !k.endsWith("Args")) {
                        try {
                            elements[i][k.substr(11).toLowerCase()] = this.translate(elements[i].dataset[k], (elements[i].dataset[k + "Args"] !== undefined) ? JSON.parse(elements[i].dataset[k + "Args"]) : undefined);
                        } catch (err) {
                            console.error("wrong configured translation: " + err);
                        }
                    }
                }
            }
        }

        //Call translation callbacks
        await Helper.asyncForEach(this._translationCallbacks, async callback => callback(baseElement));
        // this._translationCallbacks.forEach(callback => callback(baseElement));
    }

    /**
     * Lädt die im NativeStorage gespeicherte Sprache oder - falls diese nicht vorhanden ist - die vom User untersütze Sprache im Browser
     * @returns {Promise<*>}
     */
    async loadUserLanguage() {
        let userLanguage = await NativeStoragePromise.getItem(this._nativeStorageKey);
        if (!Translator._isValid(userLanguage) || !(userLanguage in this._translations)) {
            let userLanguages = [];

            if (navigator.language !== undefined) {
                userLanguages.push(navigator.language);
            }

            if ("languages" in navigator) {
                //.slice(0) klont das Array. Behebt einen Bug in Firefox
                userLanguages = navigator.languages.slice(0);
            }

            //sicherstellen, dass überhaupt eine Sprache gefunden wird
            userLanguages.push(this._fallbackLanguage);

            // if (userLanguages !== undefined) {
            for (let i = 0, numLanguages = userLanguages.length; i < numLanguages; i++) {
                if (userLanguages[i] in this._translations) {
                    userLanguage = userLanguages[i];
                    break;
                }
            }
            // }
        }
        return userLanguage;
    }

    /**
     * Erstellt eine neue Übersetzung, welche auch übersetzt wird, wenn die Sprache geändert wird
     * @param key
     * @param args
     * @param tag
     * @param useText
     * @returns {any}
     */
    makePersistentTranslation(key, args?, tag?, useText?): HTMLElement {
        useText = Helper.nonNull(useText, tag, args, false);
        tag = tag || "span";

        if (typeof document !== 'undefined') {
            let htmlElem = document.createElement(tag);
            htmlElem.dataset["translation"] = key;
            htmlElem.classList.add(this._translationClass);
            if (args !== undefined) {
                htmlElem.dataset["translationArgs"] = JSON.stringify(args);
            }
            if (useText === true) {
                htmlElem.innerText = this.translate(key, args);
                htmlElem.dataset["translationUseText"] = "1";
            } else {
                htmlElem.innerHTML = this.translate(key, args);
            }
            return htmlElem;
        }
    }

    getTranslationClass() {
        return this._translationClass;
    }

    getCurrentLanguage() {
        return this._currentLanguage;
    }

    static getInstance(): Translator{
        return <Translator>SharedTranslator.getInstance();
    }

    static async setLanguage(language) {
        let instance = Translator.getInstance();
        if (instance) {
            return (<Translator>instance).setLanguage(language);
        }
    }

    static makePersistentTranslation(key, args?, tag?, useText?) {
        let instance = Translator.getInstance();
        if (instance) {
            return (<Translator>instance).makePersistentTranslation(key, args, tag, useText);
        }
    }

    static addTranslationCallback(callback, callImmediately?) {
        let instance = Translator.getInstance();
        if (instance) {
            return (<Translator>instance).addTranslationCallback(callback, callImmediately);
        }
    }

    static removeTranslationCallback(callbackId) {
        let instance = Translator.getInstance();
        if (instance) {
            return (<Translator>instance).removeTranslationCallback(callbackId);
        }
    }

    static async updateTranslations(baseElement) {
        let instance = Translator.getInstance();
        if (instance) {
            return (<Translator>instance).updateTranslations(baseElement);
        }
    }

    static init(config) {
        SharedTranslator.instance = new Translator(config);
    }

}

Translator._translations = {};

Translator.logMissingTranslations = true;

Translator.instance = null;
