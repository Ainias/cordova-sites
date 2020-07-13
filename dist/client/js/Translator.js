"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translator = void 0;
const NativeStoragePromise_1 = require("./NativeStoragePromise");
const Helper_1 = require("./Legacy/Helper");
const Translator_1 = require("../../shared/Translator");
/**
 * Singleton-Klasse zum Übersetzen von Text-Inhalten
 */
class Translator extends Translator_1.Translator {
    /**
     * Erstellt einen neuen Translator
     * @param config
     */
    constructor(config) {
        super(config);
        config = Helper_1.Helper.nonNull(config, {});
        this._currentLanguage = config.currentLanguage || this._fallbackLanguage;
        this._nativeStorageKey = config.nativeStorageKey || "language";
        this._translationClass = config.translationClass || "translation";
        this._initPromise = this.loadUserLanguage().then(userLanguage => this.setLanguage(userLanguage.toLowerCase()));
    }
    /**
     * Setzt die neue Sprache, updated alle Übersetzungen. Speichert danach die aktuelle Sprache in NativeStorage
     * @param language
     */
    setLanguage(language) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._currentLanguage === language) {
                yield this.updateTranslations();
                return;
            }
            if (!this._translations[language]) {
                return;
            }
            if (typeof document !== 'undefined') {
                document.getElementsByTagName("html")[0].setAttribute("lang", language);
            }
            this._currentLanguage = language;
            yield this.updateTranslations();
            //zum schluss => Falls setzen des Keys fehlschlägt, wird trotzdem noch übersetzt
            yield NativeStoragePromise_1.NativeStoragePromise.setItem(this._nativeStorageKey, this._currentLanguage);
        });
    }
    /**
     * Übersetzt sofort einen Key in die aktuelle Sprache
     * @param key
     * @param args
     * @returns {*}
     */
    translate(key, args, language) {
        return super.translate(key, args, Helper_1.Helper.nonNull(language, this._currentLanguage));
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
        callImmediately = Helper_1.Helper.nonNull(callImmediately, true);
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
    updateTranslations(baseElement) {
        return __awaiter(this, void 0, void 0, function* () {
            baseElement = Helper_1.Helper.nonNull(baseElement, document);
            if (typeof baseElement !== 'undefined') {
                let elements = baseElement.getElementsByClassName(this._translationClass);
                for (let i = 0, max = elements.length; i < max; i++) {
                    let key = (Translator._isValid(elements[i].dataset["translation"]) ? elements[i].dataset["translation"] : (elements[i].innerText || ""));
                    if (key !== "") {
                        try {
                            let translation = this.translate(key, (elements[i].dataset["translationArgs"] !== undefined) ? JSON.parse(elements[i].dataset["translationArgs"]) : undefined);
                            if (elements[i].dataset["translationUseText"] === "1") {
                                elements[i].innerText = translation;
                            }
                            else {
                                elements[i].innerHTML = translation;
                            }
                            elements[i].dataset["translation"] = key;
                        }
                        catch (err) {
                            console.error("wrong configured translation: " + err);
                        }
                    }
                    //Übersetzung von Attributen
                    for (let k in elements[i].dataset) {
                        if (k.startsWith("translation") && !k.endsWith("Args")) {
                            try {
                                elements[i][k.substr(11).toLowerCase()] = this.translate(elements[i].dataset[k], (elements[i].dataset[k + "Args"] !== undefined) ? JSON.parse(elements[i].dataset[k + "Args"]) : undefined);
                            }
                            catch (err) {
                                console.error("wrong configured translation: " + err);
                            }
                        }
                    }
                }
            }
            //Call translation callbacks
            yield Helper_1.Helper.asyncForEach(this._translationCallbacks, (callback) => __awaiter(this, void 0, void 0, function* () { return callback(baseElement); }));
            // this._translationCallbacks.forEach(callback => callback(baseElement));
        });
    }
    /**
     * Lädt die im NativeStorage gespeicherte Sprache oder - falls diese nicht vorhanden ist - die vom User untersütze Sprache im Browser
     * @returns {Promise<*>}
     */
    loadUserLanguage() {
        return __awaiter(this, void 0, void 0, function* () {
            // debugger;
            let userLanguage = yield NativeStoragePromise_1.NativeStoragePromise.getItem(this._nativeStorageKey);
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
        });
    }
    /**
     * Erstellt eine neue Übersetzung, welche auch übersetzt wird, wenn die Sprache geändert wird
     * @param key
     * @param args
     * @param tag
     * @param useText
     * @returns {any}
     */
    makePersistentTranslation(key, args, tag, useText) {
        useText = Helper_1.Helper.nonNull(useText, tag, args, false);
        tag = tag || "span";
        // if (key === "church-description-1"){
        //     debugger;
        // }
        // console.log("trans", key, useText);
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
            }
            else {
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
    static setLanguage(language) {
        return __awaiter(this, void 0, void 0, function* () {
            let instance = Translator.getInstance();
            if (instance) {
                return instance.setLanguage(language);
            }
        });
    }
    static makePersistentTranslation(key, args, tag, useText) {
        let instance = Translator.getInstance();
        if (instance) {
            return instance.makePersistentTranslation(key, args, tag, useText);
        }
    }
    static addTranslationCallback(callback, callImmediately) {
        let instance = Translator.getInstance();
        if (instance) {
            return instance.addTranslationCallback(callback, callImmediately);
        }
    }
    static removeTranslationCallback(callbackId) {
        let instance = Translator.getInstance();
        if (instance) {
            return instance.removeTranslationCallback(callbackId);
        }
    }
    static updateTranslations(baseElement) {
        return __awaiter(this, void 0, void 0, function* () {
            let instance = Translator.getInstance();
            if (instance) {
                return instance.updateTranslations(baseElement);
            }
        });
    }
    static init(config) {
        Translator_1.Translator.instance = new Translator(config);
    }
}
exports.Translator = Translator;
Translator._translations = {};
Translator.logMissingTranslations = true;
Translator.instance = null;
//# sourceMappingURL=Translator.js.map