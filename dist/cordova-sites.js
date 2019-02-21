import { nSQL } from 'nano-sql';
import { SQLiteStore } from 'cordova-plugin-nano-sqlite/lib/sqlite-adapter';

/**
 * Promise-Wrapper-Klasse für Native-Storage
 */

class NativeStoragePromise {

    /**
     * Setzt ein Item für NativeStorage
     *
     * @param key
     * @param value
     * @returns {Promise<*>}
     */
    static async setItem(key, value) {
        return new Promise((res, rej) => NativeStorage.setItem(key, value, res, rej));
    }

    /**
     * Bekomme ein Item von NativeStorage
     * sofern nothrow auf true oder weggelassen wird, wird null zurückgegeben, sollte der Index nicht existieren
     *
     * @param key
     * @param nothrow
     * @returns {Promise<*>}
     */
    static async getItem(key, nothrow) {
        nothrow = Helper.nonNull(nothrow, true);
        return new Promise((res, rej) => {
            NativeStorage.getItem(key, res, (e => {
                if (nothrow){
                    res(null);
                }
                else{
                    rej(e);
                }
            }));
        });
    }

    /**
     * Bekomme die Keys vom NativeStorage
     *
     * @returns {Promise<*>}
     */
    static async keys() {
        return new Promise((res, rej) => NativeStorage.keys(res, rej));
    }

    /**
     * Entfernt ein Object aus dem NativeStorage
     *
     * @param key
     * @returns {Promise<*>}
     */
    static async remove(key) {
        return new Promise((res, rej) => NativeStorage.remove(key, res, rej));
    }

    /**
     * Entfernt alle Objects aus dem NativeStorage
     *
     * @returns {Promise<*>}
     */
    static async clear() {
        return new Promise((res, rej) => NativeStorage.clear(res, rej));
    }
}

/**
 * Singleton-Klasse zum Übersetzen von Text-Inhalten
 */
class Translator {

    /**
     * Erstellt einen neuen Translator
     * @param config
     */
    constructor(config) {

        config = Helper.nonNull(config, {});
        this._translations = {};
        this.addDynamicTranslations(config.translations || {});
        // this._translations = config.translations || {};
        this._fallbackLanguage = config.fallbackLanguage || "en";
        this._currentLanguage = config.currentLanguage || this._fallbackLanguage;
        this._nativeStorageKey = config.nativeStorageKey || "language";
        this._translationClass = config.translationClass || "translation";

        this._markUntranslatedTranslations = config.markUntranslatedTranslations;
        this._markTranslations = config.markTranslations;
        this._logMissingTranslations = config.logMissingTranslations;

        this._translationCallbacks = new Map();
        this._lastTranslationCallbackId = 0;

        this.loadUserLanguage().then(userLanguage => this.setLanguage(userLanguage.toLowerCase()));
    }

    /**
     * Setzt die neue Sprache, updated alle Übersetzungen. Speichert danach die aktuelle Sprache in NativeStorage
     * @param language
     */
    async setLanguage(language) {
        if (this._currentLanguage === language) {
            this.updateTranslations();
            return;
        }

        if (!this._translations[language]) {
            return;
        }

        if (typeof document !== 'undefined') {
            document.getElementsByTagName("html")[0].setAttribute("lang", language);
        }

        this._currentLanguage = language;
        this.updateTranslations();

        //zum schluss => Falls setzen des Keys fehlschlägt, wird trotzdem noch übersetzt
        await NativeStoragePromise.setItem(this._nativeStorageKey);
    }

    /**
     * Übersetzt sofort einen Key in die aktuelle Sprache
     * @param key
     * @param args
     * @returns {*}
     */
    translate(key, args) {
        if (Helper.isNull(key)){
            return "";
        }

        let translation = null;

        key = key.toLowerCase();
        if (this._translations[this._currentLanguage] && this._translations[this._currentLanguage][key]) {
            translation = this._translations[this._currentLanguage][key];
        }

        if (!Translator._isValid(translation)) {
            if (this._logMissingTranslations) {
                console.warn("missing translation for language " + this._currentLanguage + " and key " + key);
            }
            if (this._translations[this._fallbackLanguage]) {
                translation = this._translations[this._fallbackLanguage][key];
            }

            if (!Translator._isValid(translation)) {
                if (this._logMissingTranslations) {
                    console.error("missing base translation for key " + key + ". FIX IT");
                }
                translation = key;
            }
            if (this._markUntranslatedTranslations) {
                translation = "&gt;&gt;" + translation + "&lt;&lt;";
            }
        }

        if (this._markTranslations) {
            translation = "$" + translation + "$";
        }

        if (args !== undefined) {
            translation = Translator._format(translation, args);
        }

        return translation;
    }

    /**
     * Fügt neue Übersetzungen hinzu
     * @param trans
     */
    addDynamicTranslations(trans) {
        for (let lang in trans) {
            if (!this._translations[lang]) {
                this._translations[lang] = {};
            }
            for (let key in trans[lang]) {
                this._translations[lang][key.toLowerCase()] = trans[lang][key];
            }
        }
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
    removeTranslationCallback(callbackId){
        this._translationCallbacks.delete(callbackId);
    }

    /**
     * Updated die aktuellen übersetzungen
     */
    updateTranslations(baseElement) {
        baseElement = Helper.nonNull(baseElement, document);
        if (typeof baseElement !== 'undefined') {
            let elements = baseElement.getElementsByClassName(this._translationClass);
            for (let i = 0, max = elements.length; i < max; i++) {
                let key = (Translator._isValid(elements[i].dataset["translation"]) ? elements[i].dataset["translation"] : (elements[i].innerText || ""));
                if (key !== "") {
                    try {
                        elements[i].innerHTML = this.translate(key, (elements[i].dataset["translationArgs"] !== undefined) ? JSON.parse(elements[i].dataset["translationArgs"]) : undefined);
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
        this._translationCallbacks.forEach(callback => callback(baseElement));
    }

    /**
     * Lädt die im NativeStorage gespeicherte Sprache oder - falls diese nicht vorhanden ist - die vom User untersütze Sprache im Browser
     * @returns {Promise<*>}
     */
    async loadUserLanguage() {
        // debugger;
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

            if (userLanguages !== undefined) {
                for (let i = 0, numLanguages = userLanguages.length; i < numLanguages; i++) {
                    if (userLanguages[i] in this._translations) {
                        userLanguage = userLanguages[i];
                        break;
                    }
                }
            }
        }
        return userLanguage;
    }

    /**
     * Erstellt eine neue Übersetzung, welche auch übersetzt wird, wenn die Sprache geändert wird
     * @param key
     * @param args
     * @param tag
     * @returns {any}
     */
    makePersistentTranslation(key, args, tag) {
        tag = tag || "span";

        if (typeof document !== 'undefined') {
            let htmlElem = document.createElement(tag);
            htmlElem.dataset["translation"] = key;
            htmlElem.classList.add(this._translationClass);
            if (args !== undefined) {
                htmlElem.dataset["translationArgs"] = JSON.stringify(args);
            }
            htmlElem.innerHTML = this.translate(key, args);
            return htmlElem;
        }
    }

    getTranslationClass() {
        return this._translationClass;
    }

    getCurrentLanguage(){
        return this._currentLanguage;
    }

    static async setLanguage(language) {
        let instance = Translator.getInstance();
        if (instance) {
            return instance.setLanguage(language);
        }
    }

    static translate(key, args) {
        let instance = Translator.getInstance();
        if (instance) {
            return instance.translate(key, args);
        }
        return "";
    }

    static addDynamicTranslations(trans) {
        let instance = Translator.getInstance();
        if (instance) {
            return instance.addDynamicTranslations(trans);
        }
    }

    static makePersistentTranslation(key, args, tag) {
        let instance = Translator.getInstance();
        if (instance) {
            return instance.makePersistentTranslation(key, args, tag);
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
        let instance = Translator.getInstance();
        if (instance) {
            return instance.updateTranslations(baseElement);
        }
    }

    static init(config) {
        Translator.instance = new Translator(config);
    }

    static getInstance() {
        return Translator.instance;
    }

    static _isValid(translation) {
        return (typeof translation === "string");
    }

    static _format(translation, args) {
        return translation.replace(/{(\d+)}/g, function (match, number) {
            return args[number] !== undefined ? args[number] : match;
        });
    }
}

Translator.logMissingTranslations = true;

Translator.instance = null;

/**
 * Eine Klasse mit häufig genutzten, nützlichen Funktionen
 */

class Helper {
    /**
     * Testet, ob eine Variable null oder Undefined ist
     *
     * @param variable
     * @returns {boolean}
     */
    static isNull(variable) {
        return (variable === null || variable === undefined);
    }

    /**
     * Testet, ob eine Variable nicht (null oder undefined) ist
     *
     * @param variable
     * @returns {boolean}
     */
    static isNotNull(variable) {
        return !Helper.isNull(variable);
    }

    /**
     * Gibt den ersten übergebenen Wert, der nicht (null oder undefined) ist, zurück
     *
     * @param val1
     * @param val2
     * @param args
     * @returns {*}
     */
    static nonNull(val1, val2, ...args) {
        for (let i = 0; i < arguments.length; i++) {
            if (Helper.isNotNull(arguments[i])) {
                return arguments[i];
            }
        }
        return null;
    }

    /**
     * Testet, ob der übergebene Index am Objekt gesetzt ist. Werden mehrere Indexes übergeben, so wird getestet,
     * ob die "Index-Kette" gesetzt ist.
     * Bsp.:
     *  Helper.isSet({"index1":{"index2":value}}, "index1", "index2") ist wahr
     *
     * @param object
     * @param indexes
     * @returns {*}
     */
    static isSet(object, ...indexes) {
        if (Helper.isNotNull(object)) {
            if (indexes.length === 0) {
                return true;
            }
            return (Helper.isSet.apply(null, [object[indexes[0]]].concat(indexes.slice(1))));
        }
        return false;
    }

    /**
     * Testet, ob ein Wert null oder Leerstring, bzw nur aus leerzeichend bestehender String ist
     *
     * @param value
     * @returns {boolean}
     */
    static empty(value) {
        return (Helper.isNull(value) || (typeof value === 'string' && value.trim() === ""))
    }

    /**
     * Testet, ob ein Wert NICHT (null oder Leerstring, bzw nur aus leerzeichend bestehender String ist)
     *
     * @param value
     * @returns {boolean}
     */
    static notEmpty(value) {
        return !Helper.empty(value);
    }

    /**
     * Formatiert ein Date-Object nach der Vorlage von der C-Funktion strftime
     *
     * @param sFormat
     * @param date
     * @param useUTC
     * @returns {*|void|string|never}
     */
    static strftime(sFormat, date, useUTC) {
        if (!(date instanceof Date)) date = new Date(date);
        useUTC = Helper.nonNull(useUTC, false);
        let nDay = (useUTC) ? date.getUTCDay() : date.getDay(),
            nDate = (useUTC) ? date.getUTCDate() : date.getDate(),
            nMonth = (useUTC) ? date.getUTCMonth() : date.getMonth(),
            nYear = (useUTC) ? date.getUTCFullYear() : date.getFullYear(),
            nHour = (useUTC) ? date.getUTCHours() : date.getHours(),
            aDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            aMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
            isLeapYear = function () {
                if ((nYear & 3) !== 0) return false;
                return nYear % 100 !== 0 || nYear % 400 === 0;
            },
            getThursday = function () {
                let target = new Date(date);
                target.setDate(nDate - ((nDay + 6) % 7) + 3);
                return target;
            },
            zeroPad = function (nNum, nPad) {
                return ('' + (Math.pow(10, nPad) + nNum)).slice(1);
            };

        return sFormat.replace(/%[a-z]/gi, function (sMatch) {
            return {
                '%a': Translator.makePersistentTranslation(aDays[nDay].slice(0, 3)).outerHTML,
                '%A': Translator.makePersistentTranslation(aDays[nDay]).outerHTML,
                '%b': Translator.makePersistentTranslation(aMonths[nMonth].slice(0, 3)).outerHTML,
                '%B': Translator.makePersistentTranslation(aMonths[nMonth]).outerHTML,
                '%c': date.toUTCString(),
                '%C': Math.floor(nYear / 100),
                '%d': zeroPad(nDate, 2),
                '%e': nDate,
                '%f': zeroPad(date.getTime() % 1000, 4),
                '%F': date.toISOString().slice(0, 10),
                '%G': getThursday().getFullYear(),
                '%g': ('' + getThursday().getFullYear()).slice(2),
                '%H': zeroPad(nHour, 2),
                '%I': zeroPad((nHour + 11) % 12 + 1, 2),
                '%j': zeroPad(aDayCount[nMonth] + nDate + ((nMonth > 1 && isLeapYear()) ? 1 : 0), 3),
                '%k': '' + nHour,
                '%l': (nHour + 11) % 12 + 1,
                '%m': zeroPad(nMonth + 1, 2),
                '%M': zeroPad(date.getMinutes(), 2),
                '%p': (nHour < 12) ? 'AM' : 'PM',
                '%P': (nHour < 12) ? 'am' : 'pm',
                '%s': Math.round(date.getTime() / 1000),
                '%S': zeroPad(date.getSeconds(), 2),
                '%u': nDay || 7,
                '%V': (function () {
                    let target = getThursday(),
                        n1stThu = target.valueOf();
                    target.setMonth(0, 1);
                    let nJan1 = target.getDay();
                    if (nJan1 !== 4) target.setMonth(0, 1 + ((4 - nJan1) + 7) % 7);
                    return zeroPad(1 + Math.ceil((n1stThu - target) / 604800000), 2);
                })(),
                '%w': '' + nDay,
                '%x': date.toLocaleDateString(),
                '%X': date.toLocaleTimeString(),
                '%y': ('' + nYear).slice(2),
                '%Y': nYear,
                '%z': date.toTimeString().replace(/.+GMT([+-]\d+).+/, '$1'),
                '%Z': date.toTimeString().replace(/.+\((.+?)\)$/, '$1')
            }[sMatch] || sMatch;
        });
    }

    /**
     * Deepcopies JSON
     *
     * @param obj
     * @returns {*}
     */
    static cloneJson(obj) {
        // https://stackoverflow.com/questions/4120475/how-to-create-and-clone-a-json-object/17502990#17502990
        let i;

        // basic type deep copy
        if (Helper.isNull(obj) || typeof obj !== 'object') {
            return obj
        }
        // array deep copy
        if (obj instanceof Array) {
            let cloneA = [];
            for (i = 0; i < obj.length; ++i) {
                cloneA[i] = Helper.cloneJson(obj[i]);
            }
            return cloneA;
        }
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        // object deep copy
        let cloneO = {};
        for (i in obj) {
            cloneO[i] = Helper.cloneJson(obj[i]);
        }
        return cloneO;
    }

    /**
     * Erstellt ein FormData-Object von JSON-Data. Nützlich für fetch
     *
     * @param obj
     * @returns {FormData}
     */
    static formDataFromObject(obj) {
        let formData = new FormData();
        for (let k in obj) {
            formData.set(k, obj[k]);
        }
        return formData;
    }

    /**
     * Entfernt alle Children eines Elements
     *
     * @param element
     * @returns {Node}
     */
    static removeAllChildren(element) {
        if (element instanceof Node) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
        return element;
    }

    static shuffleArray(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }


    //Ältere evtl nützliche Funktionen

    // static htmlspecialcharsDecode(text) {
    //     const map = {
    //         '&amp;': '&',
    //         '&#038;': "&",
    //         '&lt;': '<',
    //         '&gt;': '>',
    //         '&quot;': '"',
    //         '&#039;': "'",
    //         '&#8217;': "’",
    //         '&#8216;': "‘",
    //         '&#8211;': "–",
    //         '&#8212;': "—",
    //         '&#8230;': "…",
    //         '&#8221;': '”'
    //     };
    //
    //     if (Helper.isNotNull(text) && typeof text.replace === "function") {
    //         return text.replace(/\&[\w\d\#]{2,5}\;/g, function (m) {
    //             return map[m];
    //         });
    //     }
    //     return text;
    // }
    // static getIndexedObject(array, keyValue) {
    //     let obj = {};
    //     for (let i = 0, n = array.length; i < n; i++) {
    //         obj[array[i][keyValue]] = array[i];
    //     }
    //     return obj;
    // }

    /**
     * Inverts the key-Values for an object
     * @param obj
     * @return {*}
     */
    static invertKeyValues(obj) {
        let new_obj = {};

        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                new_obj[obj[prop]] = prop;
            }
        }

        return new_obj;
    }

    static async asyncForEach(array, callback, runAsyncronous) {
        runAsyncronous = Helper.nonNull(runAsyncronous, false);

        let validPromises = [];
        for (let i = 0; i < array.length; i++) {
            let index = i;
            let currentPromise = Promise.resolve(callback(array[index], index, array));
            if (!runAsyncronous) {
                await currentPromise;
            }
            validPromises.push(currentPromise);
        }
        return Promise.all(validPromises);
    }

    static escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    }

    static objectForEach(object, callback){
        Object.keys(object).forEach(key => {
            callback(object[key], key, object);
        });
    }

    static toArray(object) {
        let res = [];
        for (let k in object) {
            res.push(object[k]);
        }
        return res;
    }
}

/**
 * Ein Manager, welches das Laden von Resourcen übernimmt.
 */
class DataManager {

    /**
     * Diese Funktion sollte anstelle von dem nativen "fetch" verwendet werden!
     * Das native Fetch kann keine file://, welches von Cordova unter Android (und whs iOS) verwendet wird
     * Daher wird heir auf XMLHttpRequest zurückgegriffen
     *
     * @param url
     * @param options
     * @returns {Promise<*>}
     */
    static async fetch(url, options) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(new Response(xhr.responseText, {status: xhr.status}));
            };
            xhr.onerror = function () {
                reject(new TypeError('Local request failed'));
            };
            xhr.open('GET', url);
            xhr.send(null);
        });
    }

    /**
     * Vereinfachung von Laden von Resourcen.
     * Lädt per GET die angegebene URL und gibt diese als JSON oder Text zurück
     *
     * @param url
     * @param asJson
     * @returns {Promise<* | never | void>}
     */
    static async load(url, asJson) {
        asJson = Helper.nonNull(asJson, true);
        return DataManager.fetch(url, {"credentials": "same-origin"}).then(function (res) {
            if (asJson) {
                return res.json();
            }
            return res.text();
        }).catch(e => console.error(e));
    }

    /**
     * Wandelt ein Key-Value-Objekt in einen QueryString um
     *
     * @param values
     * @return {string}
     */
    static buildQuery(values) {
        let queryStrings = [];
        for (let k in values) {
            queryStrings.push(encodeURIComponent(k) + "=" + encodeURIComponent(values[k]));
        }
        return "?" + queryStrings.join("&");
    }
}

/**
 * Singleton-Klasse genutzt zum laden von Views
 */
class ViewInflater {

    /**
     *  Statische Funktion, um die Singleton-Instanz zu holen
     *
     * @returns {ViewInflater}
     */
    static getInstance() {
        if (Helper.isNull(ViewInflater.instance)) {
            ViewInflater.instance = new ViewInflater();
        }
        return ViewInflater.instance;
    }


    constructor() {
        this.loadingPromises = {};
    }

    /**
     * Lädt asynchron eine View anhand einer URL und lädt ebenso alle child-views
     *
     * Extra nicht async, damit Promise sofort in LoadingPromise hinzugefügt werden kann
     *
     * @param viewUrl
     * @param parentUrls
     * @returns {*}
     */
    load(viewUrl, parentUrls) {

        // console.log("viewUrl", viewUrl, parentUrls);

        //Kopiere Elemente, damit originale parentURLS nicht verändert werden
        parentUrls = Helper.cloneJson(Helper.nonNull(parentUrls, []));

        //Detektiert eine Schleife in den Views
        if (parentUrls.indexOf(viewUrl) !== -1) {
            //Return Promise.reject => da View vorher schon einmal geladen, wird das Resultat ebenfalls in loadingPromises gespeichert für diese View
            return Promise.reject("views are in a circuit! cannot resolve view for url " + parentUrls[0] + "! url " + viewUrl + " is in stack before!");
        }
        parentUrls.push(viewUrl);

        //Shortcut, falls die View schon geladen wurde. Muss nach Schleifenüberprüfung aufgerufen werden
        if (Helper.isNotNull(this.loadingPromises[viewUrl])) {
            return this.loadingPromises[viewUrl].then(view => view.cloneNode(true));
        }

        let resultPromise = Promise.resolve();
        if (viewUrl instanceof Element) {
            resultPromise = Promise.resolve(viewUrl);
        } else {
            resultPromise = DataManager.load(viewUrl, false).then(htmlText => {
                let doc = (new DOMParser()).parseFromString(htmlText, "text/html");

                //Parsing hat nicht geklappt, also per innerHTML
                if (Helper.isNull(doc)) {
                    doc = document.implementation.createHTMLDocument('');
                    doc.body.innerHTML = htmlText;
                }

                //Wrappe Elemente mit einem Span
                let spanElem = document.createElement("span");
                spanElem.classList.add("injected-span");
                return ViewInflater.moveChildren(doc.body, spanElem);
            });
        }

        this.loadingPromises[viewUrl] = resultPromise.then(parentElement => {
            let promises = [];
            let childViews = parentElement.querySelectorAll("[data-view]");

            //lade Kinder-Views
            childViews.forEach(childView => {
                promises.push(ViewInflater.getInstance().load(childView.dataset["view"], parentUrls).then(element => {
                    childView.replaceWith(element);
                    ViewInflater.replaceWithChildren(element);
                }));
            });
            return Promise.all(promises).then(function () {
                return parentElement;
            });
        });
        return this.loadingPromises[viewUrl].then(view => view.cloneNode(true));
    }

    /**
     * Statische Funktion, um Elemente aus einem String zu kreieren
     *
     * @param string
     * @returns {NodeListOf<ChildNode>}
     */
    static inflateElementsFromString(string) {
        let template = document.createElement('template');
        template.innerHTML = string;
        return template.content.childNodes;
    }

    /**
     * Kreiert ein Ladesymbol. Evtl entfernen
     *
     * @returns {HTMLDivElement}
     */
    static createLoadingSymbol(loaderClass) {
        let svgNS = "http://www.w3.org/2000/svg";

        let loader = document.createElement("div");
        loader.classList.add('loader');

        //LoaderClass darf nicht leer sein, da sonst HTML einen Felher schmeißt
        if (loaderClass) {
            loader.classList.add(loaderClass);
        }

        let svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute('viewBox', "0 0 32 32");
        svg.setAttribute("width", "32");
        svg.setAttribute("height", "32");

        let circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("class", "spinner");
        circle.setAttribute("cx", "16");
        circle.setAttribute("cy", "16");
        circle.setAttribute("r", "14");
        circle.setAttribute("fill", "none");

        svg.appendChild(circle);
        loader.appendChild(svg);

        // let loader = document.createElement("div");
        // loader.appendChild(document.createTextNode("LOADING..."));

        return loader;
    }

    /**
     * Moves the child-Nodes from one element to another
     * @param from
     * @param to
     * @returns {*}
     */
    static moveChildren(from, to) {
        let children = [];

        //Zwischenspeichern der Children, da removeChild die forEach-Schleife durcheinander bringt
        from.childNodes.forEach(child => {
            children.push(child);
        });

        children.forEach(child => {
            from.removeChild(child);
            to.appendChild(child);
        });
        return to;
    }

    /**
     * Ersetzt ein Element durch seine Kinder (entfernt das Element ohne die Kinder zu entfernen)
     * @param element
     */
    static replaceWithChildren(element) {
        let children = [];

        //Zwischenspeichern der Children, da removeChild die forEach-Schleife durcheinander bringt
        element.childNodes.forEach(child => {
            children.push(child);
        });

        let parent = element.parentElement;
        children.forEach(child => {
            element.removeChild(child);
            parent.insertBefore(child, element);
        });
        element.remove();
    }
}

/**
 * Variable für die Singleton-Instanz
 */
ViewInflater.instance = null;

/**
 * Basis-Klasse für Seiten und Fragmente
 */
class Context {

    /**
     * Erstellt einen neuen Context. Erwartet den Link zu einem HTML-File, welches vom ViewInflater geladen werden kann.
     * Im Constructor sollten fragmente hinzugefügt werden (nachdem super.constructor(<>) aufgerufen wurde)
     *
     * @param view
     */
    constructor(view) {
        this._pauseParameters = [];

        this._view = null;
        this._fragments = [];
        this._viewPromise = null;
        this._state = Context.STATE_CREATED;

        this._viewPromise = ViewInflater.getInstance().load(view).then((siteContent) => {
            this._view = siteContent;
            return siteContent;
        });
    }

    /**
     * Wird von SiteManager aufgerufen, wenn Klasse erstellt wird. Das ViewPromise ist noch nicht zwangsweise geladen!
     * Gibt ein Promise zurück. onViewLoaded wird erst aufgerufen, wenn onConstruct-Promise und view-Promise fullfilled sind.
     *
     * @param constructParameters, Object|Null
     * @returns {Promise<any[]>}
     */
    async onConstruct(constructParameters) {
        this._state = Context.STATE_CONSTRUCTED;

        let onConstructPromises = [];
        for (let k in this._fragments) {
            onConstructPromises.push(this._fragments[k].onConstruct.apply(this._fragments[k], [constructParameters]));
            onConstructPromises.push(this._fragments[k]._viewPromise);
        }
        return Promise.all(onConstructPromises);
    }

    /**
     * Methode wird aufgerufen, sobald onConstruct-Promise und view-Promise fullfilled sind.
     * View ist hier noch nicht im Dokument hinzugefügt.
     *
     * Benutze diese Methode, um die View beim starten zu manipulieren.
     */
    async onViewLoaded() {
        this._state = Context.STATE_CONSTRUCTED;

        let onViewLoadedPromises = [];
        for (let k in this._fragments) {
            onViewLoadedPromises.push(this._fragments[k]._viewPromise.then(() => this._fragments[k].onViewLoaded()));
        }
        return Promise.all(onViewLoadedPromises);
    }

    /**
     * onViewLoaded-Promise ist erfüllt => View wird dem Document hinzugefügt => onStart wird aufgerufen
     *
     * Seite wird pausiert => onPause wird aufgerufen => View wird aus dem Document entfernt => - etwas passiert -
     * => Seite wird fortgesetzt => View wird dem Document hinzugefügt => onStart wird mit dem Rückgabewert von onPause ausgeführt
     *
     * Zurückgegebenes Promise wird ignoriert!
     * @param pauseArguments, Object|NULL
     */
    async onStart(pauseArguments) {
        this._state = Context.STATE_RUNNING;

        for (let k in this._fragments) {
            let fragment = this._fragments[k];
            fragment.onStart.apply(this._fragments[k], [await this._fragments[k]._pauseParameters]);
            this._fragments[k]._viewPromise.then(function (fragmentView) {
                if (fragment.isActive()) {
                    fragmentView.classList.remove("hidden");
                } else {
                    fragmentView.classList.add("hidden");
                }
            });
        }
    }

    /**
     * Seite wird pausiet => onPause wird ausgeführt => View wird aus dem Document entfernt
     * Seite wird beendet => onPause wird ausgeführt (falls State === running) => View wird aus dem Document entfernt
     * => onDestroy wird ausgeführt
     *
     * Rückgabe-Promise wird als Pause-Parameter gespeichert und wird beim Fortsetzen der Seite ausgeführt
     * @returns {Promise<void>}
     */
    async onPause() {
        this._state = Context.STATE_PAUSED;
        for (let k in this._fragments) {
            let pauseParameters = this._fragments[k].onPause.apply(this._fragments[k], arguments);
            this._fragments[k].setPauseParameters(pauseParameters);
        }
    }

    /**
     * Seite wird beendet => onPause wird ausgeführt (falls State === running) => View wird aus dem Document entfernt
     * => onDestroy wird ausgeführt
     *
     * Rückgabe-Promise wird ignoriert
     */
    async onDestroy() {
        this._state = Context.STATE_DESTROYED;
        for (let k in this._fragments) {
            this._fragments[k].onDestroy.apply(this._fragments[k], arguments);
        }
    }

    /**
     * Fügt ein neues Fragment hinzu.
     *
     * @param viewQuery
     * @param fragment
     */
    addFragment(viewQuery, fragment) {
        this._fragments.push(fragment);
        fragment.setViewQuery(viewQuery);
        this._viewPromise = Promise.all([this._viewPromise, fragment._viewPromise]).then(res => {
            res[0].querySelector(viewQuery).appendChild(res[1]);
            return res[0];
        }).catch(e => console.error(e));
    }

    /**
     * Findet ein Element anhand eines Selectors
     *
     * Wenn all = true, werden alle gefundenen Elemente zurückgegeben
     *
     * Wenn asPromise = true, wird das Ergebnis als Promise zurückgegeben. Hier wird gewartet, bis das _viewPromise fullfilled ist
     * Nutze das, um die View in onConstruct zu manipulieren. Evtl entfernen
     *
     * @param query
     * @param all
     * @param asPromise
     * @returns {*}
     */
    findBy(query, all, asPromise) {
        all = Helper.nonNull(all, false);
        asPromise = Helper.nonNull(asPromise, false);

        let getVal = function (root) {
            let res = null;
            if (all) {
                res = root.querySelectorAll(query);
                if (root.matches(query)) {
                    res.push(root);
                }
            } else {
                if (root.matches(query)) {
                    res = root;
                } else {
                    res = root.querySelector(query);
                }
            }
            return res;
        };

        if (asPromise) {
            return this._viewPromise.then(function (rootView) {
                return getVal(rootView);
            });
        }
        return getVal(this._view);
    }

    /**
     * Setzt die PauseParameters
     * @param pauseParameters
     */
    setPauseParameters(pauseParameters) {
        this._pauseParameters = pauseParameters;
    }

    /**
     * Gibt das ViewPromise zurück
     * @returns {*}
     */
    getViewPromise(){
        return this._viewPromise;
    }
}

// Die States für den Context
Context.STATE_CREATED = 0;
Context.STATE_CONSTRUCTED = 1;
Context.STATE_RUNNING = 2;
Context.STATE_PAUSED = 3;
Context.STATE_DESTROYING = 4;
Context.STATE_DESTROYED = 5;

/**
 * Basisklasse für eine Seite
 */
class AbstractSite extends Context {

    /**
     * Construktor für eine Seite, sollte überladen werden und view sollte definiert werden. Seitenkonstruktoren bekommen NUR den siteManager übergebn
     * @param siteManager
     * @param view
     */
    constructor(siteManager, view) {
        super(view);

        //Promise und Resolver, welches erfüllt wird, wenn Seite beendet wird
        this._finishPromiseResolver = {
            resolve: null,
            reject: null
        };
        this._finishPromise = new Promise((resolve, reject) => {
            this._finishPromiseResolver = {resolve: resolve, reject: reject};
        });

        //Promise, welches erfüllt wird, wenn onConstruct-Promsise erfüllt wurde. Wird für onDestroy gebraucht
        this._onConstructPromise = null;
        this._parameters = {};
        this._result = null;

        this._siteManager = siteManager;
        this._title = {
            element: null,
            text: null
        };

        this._loadingSymbol = null;

        //Wird zum speichern der zugehörigen HistoryID genutzt
        this._historyId = null;
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);
        this.setParameters(Helper.nonNull(constructParameters, {}));
        return res;
    }

    async onStart(pauseArguments) {
        await super.onStart(pauseArguments);
        this._updateTitle();
        this.updateUrl(this._parameters);
    }

    /**
     * Setzt den Titel der Website
     *
     * @param titleElement
     * @param title
     */
    setTitle(titleElement, title) {
        if (typeof titleElement === "string") {
            let args = title;
            title = titleElement;
            titleElement = Translator.makePersistentTranslation(title, args);
        }
        title = Helper.nonNull(title, titleElement.textContent);

        this._title = {
            element: titleElement,
            text: title
        };

        this._updateTitle();
    }

    setParameter(name, value) {
        this._parameters[name] = value;
        this.updateUrl(this._parameters);
    }

    setParameters(parameters) {
        this._parameters = parameters;
        this.updateUrl(this._parameters);
    }

    getParameters() {
        return this._parameters;
    }

    async showLoadingSymbol() {
        if (Helper.isNull(this._loadingSymbol) && this._state >= Context.STATE_PAUSED) {
            this._loadingSymbol = ViewInflater.createLoadingSymbol();
            let view = await this.getViewPromise();
            if (Helper.isNotNull(this._loadingSymbol)) {
                view.appendChild(this._loadingSymbol);
            }
        }
    }

    async removeLoadingSymbol() {
        if (Helper.isNotNull(this._loadingSymbol)) {
            this._loadingSymbol.remove();
            this._loadingSymbol = null;
        }
    }

    /**
     * Updatet den Title der Webseite
     * @protected
     */
    _updateTitle() {
        if (this._state === Context.STATE_RUNNING) {
            this._siteManager.updateTitle(this._title.text);
        }
    }

    updateUrl(args) {
        if (this._state === Context.STATE_RUNNING) {
            this._siteManager.updateUrl(this, args);
        }
    }

    /**
     * Startet eine andere Seite mit den angegebenen Parametern
     *
     * @param site
     * @param args
     * @returns {*|Promise<*>}
     */
    startSite(site, args) {
        return this._siteManager.startSite(site, args);
    }

    /**
     * Alias für
     *  this.startSite(...);
     *  this.finish(...);
     *
     * @param site
     * @param args
     * @param result
     * @returns {*|Promise<*>}
     */
    finishAndStartSite(site, args, result) {
        let res = this.startSite(site, args);
        this.finish(result);
        return res;
    }

    /**
     * Beendet die aktuelle Seite. Kann ein Ergebnis setzen
     *
     * @param result
     */
    finish(result) {
        if (!(this._state === Context.STATE_DESTROYING || this._state === Context.STATE_DESTROYED)) {
            this._state = Context.STATE_DESTROYING;
            if (Helper.isNotNull(result)) {
                this.setResult(result);
            }
            this._siteManager.endSite(this);
        }
    }

    goBack() {
        if (this._state === Context.STATE_RUNNING) {
            this._siteManager.goBack();
        }
    }

    /**
     * Wird aufgerufen, falls zurück gedrückt wird. Gib false zurück, um das beenden der Seite zu verhindern
     */
    onBackPressed() {
    }

    /**
     * TODO Einbauen
     */
    onMenuPressed() {
    }

    /**
     * TODO Einbauen
     */
    onSearchPressed() {
    }

    /**
     * Gibt das FinishPromise zurück
     * @returns {Promise<any>}
     */
    getFinishPromise() {
        return this._finishPromise;
    }

    /**
     * Setzt das Resultat. Letztes Setzen gilt
     * @param result
     */
    setResult(result) {
        this._result = result;
    }

    /**
     * Gibt den FinishResolver zurück. Genutzt, um FinishPromise zu resolven order rejecten
     * @returns {*}
     */
    getFinishResolver() {
        return this._finishPromiseResolver;
    }
}

/**
 * Manager, welcher sich um die Manipulation von der Historie kümmert
 */
class HistoryManager {

    /**
     * Constructor für den Manager. Fügt den onPopstateListener hinzu
     */
    constructor() {
        this._lastStateId = -1;
        this._states = {};

        this._stack = [];
        this._ignoreOnPopState = false;
        this._isUpdateNativeStack = false;
        this._onPopStateListener = null;
        this._currentStackIndex = -1;

        window.onpopstate = (e) => {
            //Wenn nativeStack geupdated wird, mache nichts
            if (this._isUpdateNativeStack) {
                this._isUpdateNativeStack = false;
                return;
            }

            let direction = e.state["type"];
            this._currentStackIndex += direction;
            this._updateNativeHistoryStack();

            //Wenn popState ignoriert werden soll, mache ebenfalls nichts außer Stack updaten
            if (this._ignoreOnPopState) {
                this._ignoreOnPopState = false;
                return;
            }

            //Wenn Listener gesetzt, hole daten und führe Listener aus
            if (typeof this._onPopStateListener === 'function') {
                let data = {};
                if (this._stack.length > this._currentStackIndex && this._currentStackIndex >= 0) {
                    data = this._states[this._stack[this._currentStackIndex]];
                }

                this._onPopStateListener(data, direction, e);
            }
        };

        this._updateNativeHistoryStack();
    }

    /**
     * Updated den History-Stack innerhalb des Browsers
     *
     * @param url
     * @private
     */
    _updateNativeHistoryStack(url) {

        url = Helper.nonNull(url, window.location.href);

        //setze das weitere zurückgehen
        if (this._currentStackIndex >= 0) {
            history.pushState({
                "type": HistoryManager.BACK,
            }, "back", url);
        }

        history.pushState({
            "type": HistoryManager.CURRENT,
        }, "current", url);

        if (this._currentStackIndex < this._stack.length - 1) {
            history.pushState({
                "type": HistoryManager.FORWARD,
            }, "forward", url);

            this._isUpdateNativeStack = true;
            history.go(-1);
        }
    }

    /**
     * Generiert einen neuen History-Eintrag. Gibt die ID des Eintrages zurück
     *
     * @param value
     * @param name
     * @param url
     *
     * @return {number}
     */
    pushState(value, name, url) {
        let newState = {
            state: value,
            title: name,
            url: url
        };
        this._lastStateId++;
        this._states[this._lastStateId] = newState;

        this._currentStackIndex++;
        this._stack.splice(this._currentStackIndex, this._stack.length, this._lastStateId);
        this._updateNativeHistoryStack(url);
        return this._lastStateId;
    }

    /**
     * Ersetzt den Eintrag mit der gegebenen ID. Ist die ID nicht gegeben, wird der aktuelle Eintrag ersetzt
     *
     * @param value
     * @param name
     * @param url
     * @param id
     */
    replaceState(value, name, url, id) {
        id = Helper.nonNull(id, this._stack[this._currentStackIndex]);
        if (this._stack.length > this._currentStackIndex && this._currentStackIndex >= 0) {
            this._states[id] = {
                state: value,
                title: name,
                url: url
            };
            this._updateNativeHistoryStack(url);
        }
    }

    /**
     * Verschiebt den Eintrag mit der entsprechenden ID an die aktuell aktive Stelle
     * @param id
     */
    stateToCurrentPosition(id) {
        if (Helper.isNotNull(this._states[id])) {
            let oldStackPosition = this._stack.indexOf(id);
            if (oldStackPosition !== -1) {
                this._stack.splice(oldStackPosition, 1);
                this._stack.splice(this._currentStackIndex + (oldStackPosition <= this._currentStackIndex) ? -1 : 0, 0, id);
            }
        }
    }

    /**
     * Gehe um to in der Historie
     *
     * @param to
     * @param ignoreOnPopState
     */
    go(to, ignoreOnPopState) {
        this._ignoreOnPopState = (Helper.nonNull(ignoreOnPopState, false) === true);
        history.go(to);
    }

    /**
     * Entferne alle Einträge ab at (inklusive). Wenn at nicht gesetzt ist, wird alles über der aktuellen position abgeschnitten
     * @param at
     */
    cutStack(at) {
        at = Helper.nonNull(at, this._currentStackIndex + 1);
        this._stack.splice(at);
        this._currentStackIndex = Math.min(this._currentStackIndex, this._stack.length - 1);
        this._updateNativeHistoryStack();
    }

    /**
     * Alias für this.go(-1)
     */
    back() {
        this.go(-1);
    }

    /**
     * Alias für this.go(1)
     */
    forward() {
        this.go(+1);
    }

    /**
     * Setzt den onPopStateListener
     *
     * @param listener
     */
    setOnPopStateListener(listener) {
        this._onPopStateListener = listener;
    }

    /**
     * Singelton-Getter
     * @return {HistoryManager}
     */
    static getInstance() {
        if (Helper.isNull(HistoryManager._instance)) {
            HistoryManager._instance = new HistoryManager();
        }
        return HistoryManager._instance;
    }
}

HistoryManager._instance = null;

HistoryManager.BACK = -1;
HistoryManager.FORWARD = 1;
HistoryManager.CURRENT = 0;

/**
 * Manager-Klasse für die Seiten
 */
class SiteManager {

    /**
     * Constructor für Manager. Fügt Listener für zurück (onpopstate) hinzu
     *
     * @param siteDivId
     * @param deepLinks
     */
    constructor(siteDivId, deepLinks) {

        this._siteDiv = null;
        this._siteStack = [];
        this._siteDiv = document.getElementById(siteDivId);

        this._titleTranslationCallbackId = null;
        this._appEndedListener = null;

        this._inversedDeepLinks = Helper.invertKeyValues(deepLinks);

        //Listener, welcher beim klicken auf Zurück oder Forward ausgeführt wird
        HistoryManager.getInstance().setOnPopStateListener((state, direction) => {
            //Falls zurück
            if (direction === HistoryManager.BACK) {
                this.goBack();
            }
            //Falls vorwärts
            else if (HistoryManager.FORWARD === direction) {
                if (this._siteStack.indexOf(state.state.site) !== -1) {
                    this.toForeground(state.state.site);
                } else {
                    this.startSite(state.state.site.constructor, state.state.parameters);
                }
            }
        });

        //Cordova-Callbacks
        document.addEventListener("pause", () => this._pauseSite(), false);
        document.addEventListener("resume", async () => await this._resumeSite(), false);

        document.addEventListener("menubutton", () => {
            let site = this.getCurrentSite();
            if (Helper.isNotNull(site)){
                site.onMenuPressed();
            }
        }, false);

        document.addEventListener("searchbutton", () => {
            let site = this.getCurrentSite();
            if (Helper.isNotNull(site)){
                site.onSearchPressed();
            }
        }, false);
    }

    setAppEndedListener(listener){
        this._appEndedListener = listener;
    }

    goBack(){
        if (this._siteStack.length >= 1) {
            let site = this.getCurrentSite();
            if (site && site.onBackPressed() !== false) {
                this.endSite(site);
            }
        }
    }

    /**
     * gibt die aktuelle Seite zurück
     * @returns AbstractSite
     */
    getCurrentSite() {
        if (this._siteStack.length >= 1) {
            return this._siteStack[this._siteStack.length - 1];
        }
        return null;
    }

    /**
     * Erstellt eine neue Seite und zeigt diese an. ParamsPromise kann entweder ein Promise oder ein Objekt oder null sein.
     *
     * @param siteConstructor
     * @param paramsPromise
     * @returns {Promise<any>}
     */
    async startSite(siteConstructor, paramsPromise) {

        console.log("startSite");

        //Testen, ob der Constructor vom richtigen Typen ist
        if (!(siteConstructor.prototype instanceof AbstractSite)) {
            throw {
                "error": "wrong class given! Expected AbstractSite, given " + siteConstructor.name
            };
        }

        //Loading-Symbol, falls ViewParameters noch länger brauchen
        this._siteDiv.appendChild(ViewInflater.createLoadingSymbol("overlay"));

        //create Site
        let site = new siteConstructor(this);

        this._siteStack.unshift(site);

        //Wartet auf onConstruct, viewPromise, onViewLoaded und zeigt dann Seite
        Promise.resolve(paramsPromise).then(async (params) => {
            site._onConstructPromise = site.onConstruct(params);
            await Promise.all([site._onConstructPromise, site.getViewPromise()]);
            await site.onViewLoaded();

            return this._show(site);
        }).catch((e) => {
            console.error("site start error for site ", siteConstructor.name, e);
            site.getFinishResolver().reject(e);

            //Zeige alte Seite im Fehlerfall wieder an
            for (let i = this._siteStack.length - 1; i >= 0; i--) {
                if (this._siteStack[i] !== site) {
                    return this._show(this._siteStack[i]);
                }
            }
        });

        //Gebe Site-Promise zurück
        return site.getFinishPromise();
    }

    updateUrl(site, args) {
        let url = this._generateUrl(site, args);
        HistoryManager.getInstance().replaceState({
            'site': site,
            'parameters': args
        }, site.constructor.name, url);
    }

    _generateUrl(site, args) {
        let deepLink = this.getDeepLinkFor(site);
        let url = [location.protocol, '//', location.host, location.pathname].join('');
        if (Helper.isNotNull(deepLink)) {
            args["s"] = deepLink;
            url = [url, DataManager.buildQuery(args)].join('');
        }
        return url;
    }

    /**
     * Gibt einen DeepLink zurück
     *
     * @param site
     * @return string
     */
    getDeepLinkFor(site) {
        return this._inversedDeepLinks[site.constructor]
    }

    /**
     * Pausiert eine Seite
     *
     * @param site
     * @private
     */
    _pauseSite(site) {
        site = Helper.nonNull(site, this.getCurrentSite());
        if (Helper.isNotNull(site) && site._state === Context.STATE_RUNNING) {
            site._pauseParameters = site.onPause();
            Helper.removeAllChildren(this._siteDiv).appendChild(ViewInflater.createLoadingSymbol());
        }
    }

    /**
     * Lässt eine Seite weiterlaufen
     *
     * @param site
     * @private
     */
    async _resumeSite(site) {
        site = Helper.nonNull(site, this.getCurrentSite());
        if (Helper.isNotNull(site) && (site._state === Context.STATE_PAUSED || site._state === Context.STATE_CONSTRUCTED)) {
            await site.getViewPromise();

            Helper.removeAllChildren(this._siteDiv).appendChild(site._view);
            Translator.getInstance().updateTranslations();

            if (Helper.isNull(site._historyId)) {
                site._historyId = HistoryManager.getInstance().pushState({
                    'site': site,
                    'parameters': site.getParameters()
                }, site.constructor.name, this._generateUrl(site, site.getParameters()));
            } else {
                HistoryManager.getInstance().stateToCurrentPosition(site._historyId);
            }
            await site.onStart(site._pauseParameters);
        }
    }

    /**
     * Zeigt eine Seite an
     *
     * @param site
     * @returns {Promise<*>}
     * @private
     */
    async _show(site) {
        console.log("show");

        //Mache nichts, wenn Seite bereits angezeigt wird
        if (site._state === Context.STATE_RUNNING && this.getCurrentSite() === site) {
            return;
        }

        //Speichere alte Seite
        this._pauseSite();

        //Zeige Ladesymbol
        Helper.removeAllChildren(this._siteDiv).appendChild(ViewInflater.createLoadingSymbol());

        //Hinzufügen/Updaten zum SiteStack
        let currentSiteIndex = this._siteStack.indexOf(site);
        if (-1 !== currentSiteIndex) {
            this._siteStack.splice(currentSiteIndex, 1);
        }
        this._siteStack.push(site);

        //Anzeigen der Seite. Stelle sicher, dass die View wirklich geladen ist!
        return site.getViewPromise().then(async () => {

            //Stelle sicher, dass in der Zwischenzeit keine andere Seite gestartet wurde
            if (this.getCurrentSite() === site) {

                await this._resumeSite(site);
            }
        });
    }

    /**
     * Beendet eine Seite. Muss nicht die aktive Seite sein
     *
     * @param site
     */
    endSite(site) {
        console.log("endSite");
        site._onConstructPromise.then(async () => {
            //Aus Index entfernen
            let index = this._siteStack.indexOf(site);
            this._siteStack.splice(index, 1);

            //Seite war/ist die aktive Seite
            if (index === this._siteStack.length) {
                this._pauseSite(site);
                //Seite ist aktiv, zeige Ladesymbol
                this._siteDiv.appendChild(ViewInflater.createLoadingSymbol('overlay'));
                site.getFinishPromise().then(() => {
                    let newSiteToShow = this.getCurrentSite();
                    if (Helper.isNotNull(newSiteToShow)) {
                        this.toForeground(newSiteToShow);
                    }
                });
            }

            if (this._siteStack.length <= 0) {
                console.log("stack is empty, starting normal site!");
                HistoryManager.getInstance().cutStack(0);
                HistoryManager.getInstance().go(-1 * history.length, true);
                Helper.removeAllChildren(this._siteDiv).appendChild(document.createTextNode("App ist beendet"));
                if (typeof this._appEndedListener === "function"){
                    this._appEndedListener(this);
                }
            }

            await site.onDestroy();
            site.getFinishResolver().resolve(site._result);
        });
    }

    /**
     * Stellt eine aktive Seite in den Vordergrund;
     * @param site
     * @returns {Promise<*>}
     */
    toForeground(site) {
        return this._show(site);
    }

    /**
     * Updated den Seitentitel. Dafür gibt es im translation-file den Key document-title (document-title-empty, falls title null),
     * der als Parameter in der Übersetzung den übergebenen Title übergeben bekommt.
     *
     * Der übergebene title wird mit den angebenenen argumenten zuerst übersetz, bevor der gesamte document-Title überstzt wird
     *
     * Wenn args === false, dann wird title nicht übersetzt
     *
     * Durch das argument titleTemplate kann der key im translation-file von document-title individuell abweichen
     *
     * @param title
     * @param args
     * @param titleTemplate
     */
    updateTitle(title, args, titleTemplate) {
        titleTemplate = Helper.nonNull(titleTemplate, Helper.isNull(title) ? "document-title-empty" : "document-title");
        if (Helper.isNotNull(this._titleTranslationCallbackId)) {
            Translator.removeTranslationCallback(this._titleTranslationCallbackId);
        }

        this._titleTranslationCallbackId = Translator.addTranslationCallback(() => {
            if (args !== false) {
                title = Translator.translate(title, args);
            }

            document.title = Translator.translate(titleTemplate, [title]);
        });
    }
}

/**
 * Eine Klasse, welche als Ursprung für die App genutzt wird
 */

class App {

    /**
     * Erstellt eine neue App, speichert ein internes Promise, welches resolved wird, sobald das deviceready-Event gefeuert wird
     */
    constructor() {
        this._resolver = {resolve: null, reject: null};
        this._readyPromise = new Promise(r => document.addEventListener("deviceready", r, false));

        this._deepLinks = {};
    }

    addDeepLink(link, siteConstructor) {
        this._deepLinks[link] = siteConstructor;
    }

    async start(startSiteConstructor) {
        await this.ready();
        let initalSiteConstructor = startSiteConstructor;

        let params = App._getStartParams();

        if (Helper.isNotNull(params["s"])) {
            startSiteConstructor = Helper.nonNull(this._deepLinks[params["s"]], startSiteConstructor);
            delete params["s"];
        }

        let siteManager = new SiteManager("site", this._deepLinks);
        Helper.removeAllChildren(document.getElementById("site"));
        siteManager.startSite(startSiteConstructor, params);
        siteManager.setAppEndedListener(manager => {
            manager.startSite(initalSiteConstructor);
        });
    }

    /**
     * Führt die Callback aus, sobald das interne Promise aufgelöst wird und App._promises fertig sind oder gibt das interne Promise zurück
     *
     * @param callback
     * @returns {Promise<*>}
     */
    async ready(callback) {

        let promise = this._readyPromise.then(() => {
            App._resolver.resolve(this);
            return Promise.all(App._promises);
        });

        if (callback) {
            return promise.then(callback);
        } else {
            return promise;
        }
    }

    static addInitialization(callbackOrPromise) {
        if (typeof callbackOrPromise === "function") {
            let promise = callbackOrPromise;
            callbackOrPromise = App._mainPromise.then((app) => {
                return promise(app);
            });
        }
        App._promises.push(callbackOrPromise);
    }

    static _getStartParams() {
        return App._extractParams(window.location.search.substr(1));
    }

    static _extractParams(paramString) {
        if (Helper.isNull(paramString)) {
            return null;
        }
        let result = {}, tmp = [];
        let items = paramString.split("&");
        for (let index = 0; index < items.length; index++) {
            tmp = items[index].split("=");
            if (tmp[0].trim().length > 0) {
                result[tmp[0]] = decodeURIComponent(tmp[1]);
            }
        }
        return result;
    }
}

App._promises = [];
App._resolver = {
    resolve: null,
    reject: null,
};
App._mainPromise = new Promise((res, rej) => {
    App._resolver = {
        resolve: res,
        reject: rej,
    };
});

/**
 * Ein Fragment ist ein TeilView einer Ansicht.
 */
class AbstractFragment extends Context {

    /**
     * Erstellt ein neues Fragment
     *
     * @param site
     * @param view
     */
    constructor(site, view) {
        super(view);
        this._site = site;
        this._viewQuery = null;

        this._active = true;

    }

    /**
     * Gibt die zugehörige Seite zurück
     *
     * @returns {*}
     */
    getSite() {
        if (this._site instanceof AbstractFragment){
            return this._site.getSite();
        }
        return this._site;
    }

    /**
     * Gibt zurück, ob das Fragment aktiv ist. Wenn nicht, wird es in der Seite nicht angezeigt
     *
     * @returns {boolean}
     */
    isActive() {
        return this._active;
    }

    setViewQuery(query)
    {
        this._viewQuery = query;
    }

    getViewQuery(){
        return this._viewQuery;
    }

    setActive(active) {
        this._active = active;
        if (Helper.isNotNull(this._view)) {
            if (active) {
                this._view.classList.remove("hidden");
            } else {
                this._view.classList.add("hidden");
            }
        }
    }
}

/**
 * Die Seite bekommt ein Template übergeben und ersetzt in diesem Template das mit dem Selector gefundene
 * Element mit der angebenen View
 */
class TemplateSite extends AbstractSite{

    /**
     * Constructor für eine TemplateSite
     *
     * @param siteManager
     * @param view
     * @param template
     * @param selectorToReplace
     */
    constructor(siteManager, view, template, selectorToReplace) {
        super(siteManager, template);
        this._viewPromise = Promise.all([this._viewPromise, ViewInflater.getInstance().load(view)]).then(res => {
            res[0].querySelector(selectorToReplace).replaceWith(res[1]);
            ViewInflater.replaceWithChildren(res[1]);
            this._view = res[0];
            return res[0];
        }).catch(e => console.error(e));
    }
}

import containerTemplate from './assets/src/html/siteTemplates/container.html';

/**
 * Seite, welche das Container-Template benutzt
 */
class ContainerSite extends TemplateSite{

    /**
     * Constructor für die ContainerSite
     *
     * @param siteManager
     * @param view
     */
    constructor(siteManager, view) {
        super(siteManager, view, containerTemplate, "#site-content");
    }
}

/**
 * Container für verschiedene Eigenschaften
 */
class MenuAction {

    /**
     * Erstellt eine MenuAction.
     * Außer name und action ist alles mit Default-werten vorbelegt
     *
     * @param name
     * @param action
     * @param showFor
     * @param order
     * @param icon
     */
    constructor(name, action, showFor, order, icon) {
        this._name = name;
        this._action = action;
        this._showFor = Helper.nonNull(showFor, MenuAction.SHOW_FOR_MEDIUM);
        this._order = Helper.nonNull(order, 1000);
        this._icon = icon;

        this._id = MenuAction.lastId++;
        this._liClass = "";

        this._shouldTranslate = true;
        this._visible = true;
        this._activated = true;

        this._menu = null;
        // this._copies = [];
    }

    /**
     * Erstellt eine neue MenuAction auf grundlage dieser MenuAction. Alle Eigenschaften sind identisch, bis auf die ID
     *
     * @param action
     * @return {MenuAction}
     */
    copy(action){
        let copiedAction = Helper.nonNull(action, new MenuAction());

        copiedAction._name = this._name;
        copiedAction._action = this._action;
        copiedAction._showFor = this._showFor;
        copiedAction._order = this._order;
        copiedAction._liClass = this._liClass;
        copiedAction._shouldTranslate = this._shouldTranslate;
        copiedAction._visible = this._visible;
        copiedAction._activated = this._activated;

        copiedAction._id = MenuAction.lastId++;
        // this._copies.push(copiedAction);
        return copiedAction;
        // return new MenuActionSlave(this);
    }

    // _triggerCopies(fn, args){
    //     this._copies.forEach(copy => {
    //         copy[fn].apply(copy, args);
    //     })
    // }

    /**
     * Sorgt dafür, dass die Action neu gezeichnet wird
     */
    redraw() {
        this._menu.redrawAction(this);
    }

    /**
     * Sorgt dafür, dass die ActionElemente geupdatet wird
     */
    update(){
        this._menu.updateAction(this);
    }

    /**
     * Gibt die Order der MenuAction zurück. Die Order bestimmt die Reihenfolge in der die Elemente angezeigt werden.
     * Je kleiner die Order, desto weiter rechts/oben werden diese angezeigt
     *
     * @returns {*}
     */
    getOrder() {
        return this._order;
    }

    /**
     * Gibt zurück, ob die MenuAction aktiv ist
     *
     * @returns {boolean}
     */
    isActivated() {
        return this._activated;
    }

    /**
     * Gibt an, ob der Name übersetzt werden soll
     *
     * @returns {boolean}
     */
    isShouldTranslate(){
        return this._shouldTranslate;
    }

    /**
     * Gibt an, ob die MenuAction sichtbar ist
     *
     * @returns {boolean}
     */
    isVisible(){
        return this._visible;
    }

    /**
     * Gibt den Namen zurück
     *
     * @returns {*}
     */
    getName(){
        return this._name;
    }

    /**
     * Gibt die Action, welche beim Click ausgeführt werden soll zurück
     * @returns {string|function}
     */
    getAction() {
        return this._action;
    }

    /**
     * Gibt die ID der MenuAction zurück
     * @returns {number}
     */
    getId() {
        return this._id;
    }

    /**
     * Gibt das Icon der MenuAction zurück
     * @returns {string|null}
     */
    getIcon(){
        return this._icon;
    }

    /**
     * Gibt die View-Klasse der Action zurück
     * @returns {string}
     */
    getShowFor(){
        return this._showFor;
    }

    /**
     * Gibt eine odder mehrere extra Klasse zurück, die dem li-Element der Action hinzugefügt werden kann
     * @returns {string}
     */
    getLiClass(){
        return this._liClass;
    }

    /**
     * Gibt das zugehörige Menu zurück
     *
     * @returns {null}
     */
    getMenu(){
        return this._menu;
    }

    /**
     * Setzt das zugehörige Menu
     *
     * @param menu
     */
    setMenu(menu) {
        this._menu = menu;
    }
}

/**
 * Letzte ID, die vergeben wurde. Wird beim Erstellen einer Acton um eins erhöht
 * @type {number}
 */
MenuAction.lastId = 0;

/**
 * Die SHOW_ALWAYS-Visibility-Klasse
 * Das Element wird bei jeder Größe in der NavBar angezeigt
 *
 * @type {string}
 */
MenuAction.SHOW_ALWAYS = "always";
/**
 * Die SHOW_FOR_SMEDIUM-Visibility-Klasse
 * Das Element wird in der NavBar angezeigt, wenn der Bildschirm mindestens die Größe "SMedium" (zwischen Small und Medium) hat
 *
 * @type {string}
 */
MenuAction.SHOW_FOR_SMEDIUM = "smedium";
/**
 * Die SHOW_FOR_MEDIUM-Visibility-Klasse
 * Das Element wird in der NavBar angezeigt, wenn der Bildschirm mindestens die Größe "Medium" hat
 *
 * @type {string}
 */
MenuAction.SHOW_FOR_MEDIUM = "medium";
/**
 * Die SHOW_FOR_LARGE-Visibility-Klasse
 * Das Element wird in der NavBar angezeigt, wenn der Bildschirm mindestens die Größe "Large" hat
 *
 * @type {string}
 */
MenuAction.SHOW_FOR_LARGE = "large";
/**
 * Die SHOW_FOR_MEDIUM-Visibility-Klasse
 * Das Element wird nie in der NavBar angezeigt, sondern immer nur im aufklapbaren Menu
 *
 * @type {string}
 */
MenuAction.SHOW_NEVER = "never";

/**
 * Action, welche ein Untermenü öffnet
 */
class OpenSubmenuAction extends MenuAction {

    /**
     * Bekommt ein submenu anstelle einer Action übergeben.
     * Erstellt automatisch die action zum öffnen/schließen des Menüs
     *
     * @param title
     * @param menu
     * @param showFor
     * @param order
     * @param icon
     */
    constructor(title, menu, showFor, order, icon) {
        //Erstellt die action zum schließen/öffnen des Submenüs
        super(title, action => {
            action.getSubmenu().toggle();
            action.update();
        }, showFor, order, icon);

        this._submenu = menu;
        menu.setParentAction(this);
    }

    /**
     * Erstellt eine neue MenuAction auf grundlage dieser MenuAction. Alle Eigenschaften sind identisch, bis auf die ID
     * und das Submenu, welches ebenfalls kopiert wird
     *
     * @param action
     * @return {MenuAction}
     */
    copy(action){
        action = Helper.nonNull(action, new OpenSubmenuAction(null, this._submenu.copy()));
        action = super.copy(action);
        action._submenu.setParentAction(action);
        return action;
    }

    /**
     * Gibt das Submenu zurück
     *
     * @returns {*}
     */
    getSubmenu() {
        return this._submenu;
    }
}

/**
 * Klasse für ein Menü, was im Prinzip nichts anderes als eine Collection für MenuActions ist
 * Ein Menü hat einen oder mehrere Renderer, die für die Anzeige zuständig sind
 */
class Menu {
    /**
     * Setzt die Renderer und die initialen Actions
     *
     * @param renderer
     * @param actions
     */
    constructor(renderer, actions) {
        this._actions = [];
        this._renderers = [];
        this._submenus = [];

        if (Array.isArray(renderer)) {
            this._renderers = renderer;
        } else {
            this._renderers = [renderer];
        }

        //Initialisiert onClickListener
        this._onClickListener = this._generateOnClickListener();

        //Setze die Actions so, um einzelne Actions noch zu überprüfen
        Helper.nonNull(actions, []).forEach(action => {
            this.addAction(action, false);
        });

        this._openSubmenuListener = null;
    }

    /**
     * Erstellt ein neues Menu auf grundlage dieses Menüs. Alle Actions & Submenüs werden ebenfalls kopiert
     * @param menu
     * @return {Menu}
     */
    copy(menu) {
        menu = Helper.nonNull(menu, new Menu());
        menu._actions = [];
        this._actions.forEach(action => {
            menu.addAction(action.copy());
        });
        menu._renderers = this._renderers;
        menu._onClickListener = this._onClickListener;

        return menu;
    }

    /**
     * Schließt das Menü, hauptsächlich hier zum Schließen der Submenüs.
     * Zum öffnen wird nicht so eine Funktion gebraucht, da beim öffnen nicht die untermenüs geöffnet werden sollen
     */
    close() {
        this._submenus.forEach(submenu => {
            submenu.close();
        });
    }

    /**
     * Fügt eine Action dem Menü hinzu
     *
     * @param action
     * @param redraw
     */
    addAction(action, redraw) {
        //Überprüfung, ob es die richtige Klasse ist und ob die Action nicht schon hinzugefügt wurde
        if (action instanceof MenuAction && this._actions.indexOf(action) === -1) {

            //Falls es sich um ein Submenu handelt, füge dieses hinzu
            if (action instanceof OpenSubmenuAction) {
                this._submenus.push(action.getSubmenu());
            }

            this._actions.push(action);
            action.setMenu(this);

            //Falls redraw true (oder nicht angegeben, redraw)
            if (Helper.nonNull(redraw, true)) {
                this.redraw();
            }
        }
    }

    /**
     * Sortiert die Actions und sagt danach den Renderern, dass diese das Menü zeuchnen sollen
     */
    draw() {
        try {
            this.sortActions();
            this._renderers.forEach(renderer => {
                renderer.render(this);
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Sortiert die Actions der Order nach
     */
    sortActions() {
        this._actions = this._actions.sort(function (first, second) {
            return first.getOrder() - second.getOrder();
        });
    }

    openSubmenu(submenu){
        if (this._openSubmenuListener)
        {
            this._openSubmenuListener(submenu);
        }
    }

    setOpenSubmenuListener(listener){
        this._openSubmenuListener = listener;
    }

    /**
     * Generiert den defaultmäßigen onclick-listener.
     * @returns {Function}
     * @private
     */
    _generateOnClickListener() {
        return (event) => {
            let _element = event.target;

            //Falls es eine Action oder ein Unterlement einer Action war...
            if (_element.matches('li') || _element.matches('li *')) {
                //...finde das zugehörige Element und lese ID aus
                _element = _element.closest("li");
                let actionId = parseInt(_element.dataset["id"]);

                //Schaue nach, welche Action angeklickt wurde
                for (let i = 0, n = this._actions.length; i < n; i++) {
                    if (this._actions[i].getId() === actionId) {
                        //Falls action eine Funktion (und kein Link), sowie aktiv ist, führe action aus
                        if (typeof this._actions[i].getAction() === 'function' && this._actions[i].isActivated()) {
                            this._actions[i].getAction()(this._actions[i], event);
                            event.preventDefault();
                        }
                        //Gebe gefundene Action zurück
                        return this._actions[i];
                    }
                }

                //Falls action nicht gefunden (da noch nicht beendet), suche in den submenüs nach der Action
                for (let i = 0, n = this._submenus.length; i < n; i++) {
                    let action = this._submenus[i].click(actionId, event);
                    if (action) {
                        return action;
                    }
                }
            }
            return null;
        };
    }

    /**
     * Setzt den OnClickListener
     *
     * @param listener
     */
    setOnClickListener(listener) {
        this._onClickListener = listener;
    }

    /**
     * Gibt den OnClickListener zurück
     *
     * @returns {*}
     */
    getOnClickListener() {
        return this._onClickListener;
    }

    /**
     * Gibt die Actions zurück
     * @returns {Array}
     */
    getActions() {
        return this._actions;
    }

    /**
     * Triggert ein neues Rendern für eine Action. Das entsprechende ActionElement wird ausgetauscht
     * @param action
     */
    redrawAction(action) {
        this._renderers.forEach(renderer => {
            renderer._triggerRenderAction(action);
        });
    }

    /**
     * Updated das entsprechende ActionElement abhängig vom Renderer. Das Element wird nicht ausgetauscht
     * @param action
     */
    updateAction(action) {
        this._renderers.forEach(renderer => {
            renderer.updateAction(action);
        });
    }

    /**
     * alias für draw
     */
    redraw() {
        this.draw();
    }
}

import viewNavbar from './assets/src/html/siteTemplates/navbar.html';

/**
 * Rendert ein Menü
 */
class MenuRenderer {

    /**
     * Jeder Renderer hat ein Element, wo er die gerenderten Elemente hinzufügt
     *
     * @param parentElement
     */
    constructor(parentElement) {

        this._parentElement = parentElement;
        this._renderedElements = {};
    }

    /**
     * Stößt das Rendern an
     * @param menu
     * @param parentElement
     */
    render(menu, parentElement) {

        let actions = menu.getActions();

        //Funktion wird auch für Submenüs genutzt. Daher muss hier ein anderes parentElement übergeben werden
        parentElement = Helper.nonNull(parentElement, this._parentElement);

        if (Helper.isNotNull(parentElement)) {
            Helper.removeAllChildren(parentElement);

            //Füge Elemente hinzu
            actions.forEach(action => {
                parentElement.appendChild(this.getElementForAction(action));
            });

            //Setze den onclick-Listener
            parentElement.onclick = (e) => {
                if (typeof menu.getOnClickListener() === 'function') {
                    menu.getOnClickListener()(e);
                }
            };
        }
    }

    /**
     * Führt das Rendern der Elemente aus und ersetzt evtl schon alte Elemente
     * Auslagern von renderAction und renderSubmenuAction zum besseren überschreiben der Funktionen.
     *
     * renderSubmenuAction und renderAction sollten nur von dieser Funktion aufgerufen werden, damit die
     * _rendererElements aktuell bleiben!
     *
     * @param action
     * @returns {HTMLElement}
     * @private
     */
    _triggerRenderAction(action) {
        let oldElement = this._renderedElements[action.getId()];
        if (action instanceof OpenSubmenuAction) {
            this._renderedElements[action.getId()] = this.renderSubmenuAction(action);
        } else {
            this._renderedElements[action.getId()] = this.renderAction(action);
        }
        this.updateAction(action);

        if (Helper.isNotNull(oldElement)) {
            oldElement.replaceWith(this._renderedElements[action.getId()]);
        }
        return this._renderedElements[action.getId()];
    }

    /**
     * Gibt das Element zur Action. Falls es noch nicht existiert, wird dieses gerendert
     * @param action
     * @returns {*}
     */
    getElementForAction(action) {
        if (Helper.isNull(this._renderedElements[action.getId()])) {
            this._triggerRenderAction(action);
        }
        return this._renderedElements[action.getId()];
    }

    /**
     * Funktion zum überladen
     * @param action
     */
    renderAction(action) {
    }

    /**
     * Funktion zum überladen
     * @param action
     */
    updateAction(action){
    }

    /**
     * Rendert eine SubmenuAction, kann/sollte überladen werden
     * @param action
     * @returns {*}
     */
    renderSubmenuAction(action) {
        let actionElement = this.renderAction(action);

        action.getSubmenu().sortActions();
        let submenuParentElement = this.createSubmenuParentElement(action);
        this.render(action.getSubmenu(), submenuParentElement);

        actionElement.appendChild(submenuParentElement);

        return actionElement;
    };

    /**
     * Erstellt ein Element für ein Submenu. Sollte überladen werden
     * @param action
     * @returns {HTMLUListElement}
     */
    createSubmenuParentElement(action) {
        return document.createElement("ul");
    }
}

/**
 * Leitet von DropdownRenderer ab, da Funktionalität fast gleich ist
 */
class AccordionRenderer extends MenuRenderer{

    /**
     * Rendert eine Action
     *
     * @param action
     * @returns {HTMLLIElement}
     */
    renderAction(action) {
        let linkElement = this.renderLinkElement(action);
        let liElement = this.renderLiElement(action);

        liElement.insertBefore(linkElement, liElement.firstChild);
        return liElement;
    }

    /**
     * Rendert das AnchorElement für eine Action
     * @param action
     * @returns {HTMLAnchorElement}
     */
    renderLinkElement(action) {
        let aElement = document.createElement("a");
        if (typeof action.getAction() === 'string') {
            aElement.href = action.getAction();
        }

        if (Helper.isNotNull(action.getIcon())) {
            let iconElement = document.createElement("img");
            iconElement.src = action.getIcon();
            iconElement.classList.add('action-image');
            if (action.isShouldTranslate()) {
                iconElement.dataset["translationTitle"] = action.getName();
                iconElement.classList.add(Translator.getInstance().getTranslationClass());
            } else {
                iconElement.title = action.getName();
            }
            aElement.appendChild(iconElement);
        }
        let name = action.getName();
        // debugger;
        if (action.isShouldTranslate()) {
            name = Translator.makePersistentTranslation(name);
        } else {
            name = document.createTextNode(name);
        }
        aElement.appendChild(name);
        return aElement;
    }

    /**
     * Render das LI-Element für eine Action
     *
     * @param action
     * @returns {HTMLLIElement}
     */
    renderLiElement(action) {
        let liElement = document.createElement("li");

        if (action.getLiClass().trim() !== "") {
            liElement.classList.add(action.getLiClass());
        }
        // liElement.appendChild(aElement);
        liElement.dataset["id"] = action.getId();

        if (Helper.isNotNull(action.getIcon())) {
            liElement.classList.add("img");
        }

        if (!action.isVisible()) {
            liElement.classList.add("hidden");
        }

        liElement.classList.add(action.getShowFor());

        return liElement;
    }

    /**
     * Da abgeleitet von DropdownRenderer, muss eine Klasse wieder entfernt werden
     *
     * @param action
     * @returns {*}
     */
    renderSubmenuAction(action) {
        let submenuActionElement = super.renderSubmenuAction(action);
        submenuActionElement.classList.remove('is-dropdown-submenu-parent');
        submenuActionElement.classList.add('is-accordion-submenu-parent');
        return submenuActionElement;
    }

    /**
     * erstellt ein SubmenuParent für Accordion
     * @param action
     * @returns {HTMLUListElement}
     */
    createSubmenuParentElement(action) {
        let menuElement = document.createElement("ul");
        menuElement.classList.add("menu");
        menuElement.classList.add("vertical");
        menuElement.classList.add("submenu");
        menuElement.classList.add("accordion-menu");
        menuElement.classList.add("is-accordion-submenu");
        menuElement.classList.add("first-sub");

        return menuElement;
    }

    /**
     * Updatet ein ActionElement
     * @param action
     */
    updateAction(action) {
        if (action instanceof OpenSubmenuAction){
            let submenuElement = this.getElementForAction(action).querySelector(".submenu");
            if (action.getSubmenu().isOpen()) {
                this.getElementForAction(action).setAttribute("aria-expanded", true);
                submenuElement.classList.add("js-active");
                submenuElement.style="";
            }
            else{
                this.getElementForAction(action).removeAttribute("aria-expanded");
                submenuElement.classList.remove("js-activ");
                submenuElement.style="display:none;";
            }
        }
    }
}

/**
 * Submenü, ein untermenü
 */
class Submenu extends Menu {
    /**
     * Constructor für ein Submenu
     *
     * Bekommt parameter für die OpenSubmenuAction übergeben und reicht diese weiter.
     * Renderer besitzt das Menü keine, da die Renderer des ParentMenus genutzt werden
     * Actions können nicht bei der Erstellung hinzugefügt werden
     *
     * @param title
     * @param showFor
     * @param order
     * @param icon
     */
    constructor(title, showFor, order, icon) {
        super([]);

        this._parentAction = new OpenSubmenuAction(title, this, showFor, order, icon);
        this._isOpen = false;
    }

    /**
     * Erstellt ein neues Menu auf grundlage dieses Menüs. Alle Actions & Submenüs werden ebenfalls kopiert
     *
     * @param menu
     * @return {Submenu}
     */
    copy(menu) {
        menu = Helper.nonNull(menu, new Submenu());
        menu = super.copy(menu);
        menu._isOpen = this._isOpen;
        return menu;
    }

    /**
     * Setzt die ParentAction
     *
     * @param action
     */
    setParentAction(action) {
        this._parentAction = action;
    }

    /**
     * Gibt das ParentMenu zurück
     */
    getParentMenu() {
        return this._parentAction.getMenu();
    }

    /**
     * Erstelle keinen onClickListener, damit der Listener aus dem Obermenü aufgerufen wird
     *
     * @returns {null}
     * @private
     */
    _generateOnClickListener() {
        return null;
    }

    /**
     * Wird vom Obermenü aufgerufen, um die ensprechende Action zu finden
     *
     * @param actionId
     * @param event
     * @returns {boolean}
     */
    click(actionId, event) {
        for (let i = 0, n = this._actions.length; i < n; i++) {
            if (this._actions[i].getId() === actionId) {
                if (typeof this._actions[i].getAction() === 'function' && this._actions[i].isActivated()) {
                    this._actions[i].getAction()(this._actions[i], event);
                    event.preventDefault();
                }
                if (!(this._actions[i] instanceof OpenSubmenuAction)) {
                    this.close();
                }
                return this._actions[i];
            }
        }

        //Falls action nicht gefunden (da noch nicht beendet), suche in den submenüs nach der Action
        for (let i = 0, n = this._submenus.length; i < n; i++) {
            let action = this._submenus[i].click(actionId, event);
            if (action) {
                return action;
            }
        }

        return null;
    }

    /**
     * Öffnet oder schließt das Menü
     */
    toggle() {
        if (this._isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * öffnet das Menü und updatet die Elemente
     */
    open() {
        this._isOpen = true;
        this.openSubmenu(this);
        if (Helper.isNotNull(this._parentAction)) {
            this._parentAction.update();
        }
    }

    openSubmenu(submenu){
        this.getParentMenu().openSubmenu(submenu);
    }

    /**
     * schließt das Menü und updatet die Elemente
     */
    close() {
        this._isOpen = false;
        super.close();
        if (Helper.isNotNull(this._parentAction)) {
            this._parentAction.update();
        }
    }

    /**
     * Gibt die ParentAction zurück
     *
     * @returns {OpenSubmenuAction}
     */
    getParentAction() {
        return this._parentAction;
    }

    /**
     * Updated eine Action. Da ein Submenu keine Renderer hat, muss es ans parentMenu weitergegeben werden
     * @param action
     */
    updateAction(action) {
        this.getParentMenu().updateAction(action);
        // super.updateAction(action);
    }

    /**
     * Gibt an, ob das Submenu offen ist oder nicht
     *
     * @returns {boolean}
     */
    isOpen() {
        return this._isOpen;
    }
}

/**
 * Erstellt ein Dropdown-Menu
 */
class DropdownRenderer extends AccordionRenderer {


    constructor(parentElement) {
        super(parentElement);
        this._accordionMenuRenderer = new AccordionRenderer();
    }

    // /**
    //  * Rendert eine Action
    //  *
    //  * @param action
    //  * @returns {HTMLLIElement}
    //  */
    // renderAction(action) {
    //     let linkElement = this.renderLinkElement(action);
    //     let liElement = this.renderLiElement(action);
    //
    //     liElement.insertBefore(linkElement, liElement.firstChild);
    //     return liElement;
    // }
    //
    // /**
    //  * Rendert das AnchorElement für eine Action
    //  * @param action
    //  * @returns {HTMLAnchorElement}
    //  */
    // renderLinkElement(action) {
    //     let aElement = document.createElement("a");
    //     if (typeof action.getAction() === 'string') {
    //         aElement.href = action.getAction();
    //     }
    //
    //     if (Helper.isNotNull(action.getIcon())) {
    //         let iconElement = document.createElement("img");
    //         iconElement.src = action.getIcon();
    //         iconElement.classList.add('action-image');
    //         if (action.isShouldTranslate()) {
    //             iconElement.dataset["translationTitle"] = action.getName();
    //             iconElement.classList.add(Translator.getInstance().getTranslationClass());
    //         } else {
    //             iconElement.title = action.getName();
    //         }
    //         aElement.appendChild(iconElement);
    //     }
    //     let name = action.getName();
    //     // debugger;
    //     if (action.isShouldTranslate()) {
    //         name = Translator.makePersistentTranslation(name);
    //     } else {
    //         name = document.createTextNode(name);
    //     }
    //     aElement.appendChild(name);
    //     return aElement;
    // }
    //
    // /**
    //  * Render das LI-Element für eine Action
    //  *
    //  * @param action
    //  * @returns {HTMLLIElement}
    //  */
    // renderLiElement(action) {
    //     let liElement = document.createElement("li");
    //
    //     if (action.getLiClass().trim() !== "") {
    //         liElement.classList.add(action.getLiClass());
    //     }
    //     // liElement.appendChild(aElement);
    //     liElement.dataset["id"] = action.getId();
    //
    //     if (Helper.isNotNull(action.getIcon())) {
    //         liElement.classList.add("img");
    //     }
    //
    //     if (!action.isVisible()) {
    //         liElement.classList.add("hidden");
    //     }
    //
    //     liElement.classList.add(action.getShowFor());
    //
    //     return liElement;
    // }

    /**
     * Rendert die SubmenuAction
     *
     * @param action
     * @returns {*}
     */
    renderSubmenuAction(action) {
        if (action.getMenu() instanceof Submenu){
            return super.renderSubmenuAction(action);
        }

        let submenuActionElement = super.renderSubmenuAction(action);
        submenuActionElement.classList.add('is-dropdown-submenu-parent');
        submenuActionElement.classList.add('opens-right');

        return submenuActionElement;
    }

    /**
     * Erstellt ein SubmenuParent
     *
     * @param action
     * @returns {HTMLUListElement}
     */
    createSubmenuParentElement(action) {
        if (action.getMenu() instanceof Submenu){
            return super.createSubmenuParentElement(action);
        }

        let menuElement = document.createElement("ul");
        menuElement.classList.add("menu");
        menuElement.classList.add("vertical");
        menuElement.classList.add("submenu");
        menuElement.classList.add("accordion-menu");
        menuElement.classList.add("is-dropdown-submenu");
        menuElement.classList.add("first-sub");

        return menuElement;
    }

    /**
     * Updatet das Element für eine Action
     * @param action
     */
    updateAction(action) {
        if (action.getMenu() instanceof Submenu){
            return super.updateAction(action);
        }

        if (action instanceof OpenSubmenuAction){
            let submenuElement = this.getElementForAction(action).querySelector(".submenu");
            if (action.getSubmenu().isOpen()) {
                submenuElement.classList.add("js-dropdown-active");
            }
            else{
                submenuElement.classList.remove("js-dropdown-active");
            }
        }
    }
}

/**
 * Fragment, welches ein Menü in der Navbar anzeigt und hinzufügt.
 *
 * Technisch gesehen wird das gleiche Menü zwei mal gezeichnet und hinzugefügt. Einmal das Menü in der Navbar, welches
 * immer sichtbar ist und einmal das versteckte Menü, welches durch einen Toggle-Button angezeigt werden kann.
 * Dabei hat jede MenuAction eine Sichtbarkeitsklasse. Anhand der Sichtbarkeitsklasse und der Bildschirmgröße wird
 * entweder das eine oder das andere Element sichtbar, jedoch niemals beide.
 */
class NavbarFragment extends AbstractFragment {

    /**
     * Erstellt das Fragment
     * @param site
     */
    constructor(site) {
        super(site, viewNavbar);
        this._menu = null;

        this._responsiveMenu = null;

        this._menuActions = [];
        NavbarFragment.defaultActions.forEach(action => {
            this._menuActions.push(action.copy());
        });
    }

    /**
     * Wird aufgerufen, sobald die View geladen ist
     * @returns {Promise<*>}
     */
    async onViewLoaded() {
        let res = super.onViewLoaded();

        //Erstelle die Renderers und das Menü
        let renderers = [];
        renderers.push(new DropdownRenderer(this.findBy("#navbar-menu-visible")));
        renderers.push(new AccordionRenderer(this.findBy("#navbar-menu-hidden")));
        this._menu = new Menu(renderers, this._menuActions);
        this._closeListenerContainer = this.findBy("#navbar-close-listener-container");

        //Falls im visible-submenu eine Submenu-Action zu sehen ist
        this._menu.setOpenSubmenuListener(() => {
            this._showCloseListener();
        });

        //Falls ein Element im Menü angeklickt wird, sollte das Menü geschlossen werden,
        //außer dadurch wird ein Untermenü geöffnet/geschlossen
        let oldListener = this._menu.getOnClickListener();
        this._menu.setOnClickListener(e => {
            if (!(oldListener(e) instanceof OpenSubmenuAction)) {
                this.closeMenu();
            }
        });

        //Fügt close/open-Listener für den Toggle-Button hinzu
        this._responsiveMenu = this.findBy("#responsive-menu");
        this.findBy("#responsive-menu-toggle").onclick = () => {
            if (window.getComputedStyle(this._responsiveMenu).getPropertyValue('display') === 'none') {
                this.openMenu();
            } else {
                this.closeMenu();
            }
        };

        //Wenn das "versteckte" Menü geöffnet ist, sollte jeder Click nicht auf das Menü dieses wieder schließen
        //Dazu gibt es den navbar-close-listener der sich vor allen (außer dem Menü) befindet. Er wird nur angezeigt,
        //wenn das Menü offen ist
        let navbarFragment = this;
        this.findBy("#navbar-close-listener").addEventListener("click", function (e) {
            if (e.target === this) {
                navbarFragment.closeMenu();
            }
        });


        //Wenn die größe des Fenster geändert wird, muss nachgeschaut werden, ob der Menü-Button für das hidden-Menü noch angezeigt werden muss
        window.addEventListener('resize', () => {
            //Reicht aus, wenn Seite im Vordergrund, da bei jedem Start (durch onStart) der toggleButton geupdatet wird
            if (this._state === Context.STATE_RUNNING) {
                this.updateToggleButton();
            }
        });

        //Rendere das Menü
        this.drawMenu();

        return res;
    }

    /**
     * Jedes mal, wenn die Seite startet, update den toggleButton
     *
     * @param pauseArguments
     * @returns {Promise<void>}
     */
    async onStart(pauseArguments) {
        super.onStart(pauseArguments);
        this.updateToggleButton();
    }

    _showCloseListener(){
        if (this._closeListenerContainer){
            this._closeListenerContainer.style.display = 'block';
        }
    }

    /**
     * Schließe das Menü
     */
    closeMenu() {
        if (Helper.isNotNull(this._responsiveMenu)) {
            this._responsiveMenu.style.display = 'none';
        }
        if (this._closeListenerContainer){
            this._closeListenerContainer.style.display = 'none';
        }
        this._menu.close();
    }

    /**
     * Öffne das Menü
     */
    openMenu() {
        if (Helper.isNotNull(this._responsiveMenu)) {
            this._responsiveMenu.style.display = 'block';
        }
        this._showCloseListener();
    }



    /**
     * rendere das Menü
     */
    drawMenu() {
        if (Helper.isNotNull(this._menu)) {
            this._menu.draw();
        }
    }

    /**
     * Update die Sichtbarkeit des MenüButtons für das "versteckte" Menü
     */
    updateToggleButton() {
        //Bekomme die aktuelle Bildschirm-größe als Foundation-Klasse
        let size = NavbarFragment._getCurrentSize();

        //schaue hier nach den enthaltenen Elementen. Evtl sollte das direkt an den MenüActions gemacht werden
        let firstParentElement = this.findBy("#navbar-menu-visible");

        if (
            //Es existieren Elemente für large und Bildschirmgröße ist kleiner large => ToggleButton muss angezeigt werden
            (size === "medium" || size === "smedium" || size === "small") &&
            firstParentElement.querySelectorAll("." + MenuAction.SHOW_FOR_LARGE + ":not(.hidden)").length > 0 ||

            //Es existieren Elemente für medium und Bildschirmgröße ist kleiner medium=> ToggleButton muss angezeigt werden
            (size === "smedium" || size === "small") &&
            firstParentElement.querySelectorAll("." + MenuAction.SHOW_FOR_MEDIUM + ":not(.hidden)").length > 0 ||

            //Es existieren Elemente für smedium und Bildschirmgröße ist kleiner medium=> ToggleButton muss angezeigt werden
            (size === "small") &&
            firstParentElement.querySelectorAll("." + MenuAction.SHOW_FOR_SMEDIUM + ":not(.hidden)").length > 0 ||

            //Es existieren Elemente, welche nie angezeigt werden sollen => ToggleButton muss angezeigt werden
            firstParentElement.querySelectorAll("." + MenuAction.SHOW_NEVER + ":not(.hidden)").length > 0) {

            document.getElementById("responsive-menu-toggle").style.display = 'block';
        } else {
            document.getElementById("responsive-menu-toggle").style.display = 'none';

            //schließe Menü, falls es offen war
            this.closeMenu();
        }
    }

    /**
     * Funktion zum hinzufügen von Actions
     * @param action
     */
    addAction(action) {
        this._menuActions.push(action);

        //Falls Menü schon existiert, füge Elemente hinzu
        if (Helper.nonNull(this._menu)) {
            this._menu.addAction(action);
        }
    }

    /**
     * Updatet das Title-Element
     * @param titleElement
     */
    setTitleElement(titleElement) {
        Helper.removeAllChildren(this.findBy("#title-element-container")).appendChild(titleElement);
    }

    /**
     * Gibt die aktuelle Size zurück
     *
     * @returns {*}
     * @private
     */
    static _getCurrentSize() {
        let matched;

        //Queries sind paare von css-selektoren auf die Mindest-Breite und Namen
        //Queries sind so geordnet, dass größter zum schluss kommt
        let queries = NavbarFragment._getViewQueries();

        for (let i = 0; i < queries.length; i++) {
            let query = queries[i];

            //Letzter sollte matchen, daher noch nicht breaken
            if (matchMedia(query._value).matches) {
                matched = query;
            }
        }

        if (typeof matched === 'object') {
            return matched._name;
        } else {
            return matched;
        }
    }

    /**
     * Gibt die ViewQueries zurück, triggert die Berechnung der ViewQueries, falls das noch nicht geschehen ist
     *
     * @returns {Array}
     * @private
     */
    static _getViewQueries() {
        if (NavbarFragment.queries.length === 0) {
            NavbarFragment.queries = NavbarFragment._calculateViewQueries();
        }
        return NavbarFragment.queries;
    }

    /**
     * Berechnet die ViewQueries, bzw liest diese aus Foundation/CSS ein
     * Eine Veränderung der Werte in SASS, verändert daher auch hier die Werte
     *
     * @returns {*}
     * @private
     */
    static _calculateViewQueries() {

        //Hilfs-Funktion zum Parsen der Bildschirmgröße
        function parseStyleToObject(str) {
            let styleObject = {};

            if (typeof str !== 'string') {
                return styleObject;
            }

            str = str.trim().slice(1, -1); // browsers re-quote string style values

            if (!str) {
                return styleObject;
            }

            styleObject = str.split('&').reduce(function (ret, param) {
                const parts = param.replace(/\+/g, ' ').split('=');
                let key = parts[0];
                let val = parts[1];
                key = decodeURIComponent(key);

                // missing `=` should be `null`:
                // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
                val = val === undefined ? null : decodeURIComponent(val);

                if (!ret.hasOwnProperty(key)) {
                    ret[key] = val;
                } else if (Array.isArray(ret[key])) {
                    ret[key].push(val);
                } else {
                    ret[key] = [ret[key], val];
                }
                return ret;
            }, {});

            return styleObject;
        }

        //die Font-Family ist reiner Text. Daher übergibt Foundation die Bildchirmgröße mit den dazugehörigen Namen als
        // Font-Family in einem Element im Head
        let cssStyleElements = document.getElementsByClassName('foundation-mq');
        if (cssStyleElements.length === 0) {
            return;
        }

        let queries = [];

        //Lade Bildschirmgrößen und speichere diese als Query in einem Array
        cssStyleElements = parseStyleToObject(window.getComputedStyle(cssStyleElements[0]).getPropertyValue('font-family'));
        for (let key in cssStyleElements) {
            if (cssStyleElements.hasOwnProperty(key)) {
                //Erstelle aus der Bildschirmgröße die Queries
                queries.push({
                    _name: key,
                    _value: 'only screen and (min-width: ' + cssStyleElements[key] + ')'
                });
            }
        }
        return queries;
    }
}

/**
 * Variable zum Speichern der Queries
 * @type {Array}
 */
NavbarFragment.queries = [];

NavbarFragment.defaultActions = [];

import menuTemplate from './assets/src/html/siteTemplates/menuSite.html';

/**
 * Seite benutzt das menuTemplate, welches das ContainerTemplate includiert.
 *
 * Außerdem beinhaltet die MenuSite ein NavbarFragment, wo Menüelemente hinzugefügt werden können
 */
class MenuSite extends TemplateSite{

    /**
     * Constructor für eine MenuSite
     *
     * @param siteManager
     * @param view
     */
    constructor(siteManager, view) {
        super(siteManager, view, menuTemplate, "#site-content");
        this._navbarFragment = new NavbarFragment(this);
        this.addFragment("#navbar-fragment", this._navbarFragment);
    }

    /**
     * Während des onConstructs werden die Menüelemente hinzugefügt => aufrufen des onCreateMenu
     *
     * @param constructParameters
     * @returns {Promise<any[]>}
     */
    async onConstruct(constructParameters) {
        let res = await super.onConstruct(constructParameters);
        this.onCreateMenu(this._navbarFragment);
        return res;
    }

    onMenuPressed() {
        this._navbarFragment.openMenu();
    }

    /**
     * Überschreibt updateTtle, um Element in der Statusbar zu setzen
     *
     * @protected
     */
    _updateTitle() {
        super._updateTitle();
        if (this._title.element && this._state === Context.STATE_RUNNING){
            this._navbarFragment.setTitleElement(this._title.element);
        }
    }

    /**
     * Überschreiben durch Kinder-Klassen, um ein Menü zu erstellen
     *
     * @param {NavbarFragment} navbar
     */
    onCreateMenu(navbar){}
}

class SwipeChildFragment extends AbstractFragment {

    constructor(site, view) {
        super(site, view);
        this._parent = null;
    }

    async onSwipeRight() {
        this.previousFragment();
    }

    async onSwipeLeft() {
        this.nextFragment();
    }

    setParent(parent) {
        this._parent = parent;
    }

    nextFragment() {
        if (Helper.isNotNull(this._parent)) {
            this._parent.nextFragment();
        }
    }

    previousFragment(){
        if (Helper.isNotNull(this._parent)) {
            this._parent.previousFragment();
        }
    }
}

import view from './assets/src/html/Framework/Fragment/swipeFragment.html';

class SwipeFragment extends AbstractFragment {

    constructor(site) {
        super(site, view);
        this._activeIndex = 0;
        this._touchStart = null;
    }

    async onViewLoaded() {
        this._view.addEventListener("touchstart", e => {
            this._touchStart = e.touches[0];
        }, false);
        this._view.addEventListener("touchend", e => {
            this._handleSwipe(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            this._touchStart = null;
        });

        this._view.addEventListener("mousedown", e => {
            this._touchStart = e;
        }, false);
        this._view.addEventListener("mouseup", e => {
            this._handleSwipe(e.clientX, e.clientY);
            this._touchStart = null;
        });
        return super.onViewLoaded();
    }

    async _handleSwipe(endX, endY) {
        if (Helper.isNull(this._touchStart)) {
            return;
        }
        let touchStart = this._touchStart;
        this._touchStart = null;

        let diffX = touchStart.clientX - endX;
        if (Math.abs(touchStart.clientY - endY) <= SwipeFragment.MAX_Y
            && Math.abs(diffX) >= SwipeFragment.MIN_X) {
            if (diffX > 0) {
                await this._fragments[this._activeIndex].onSwipeLeft();
            } else {
                await this._fragments[this._activeIndex].onSwipeRight();
            }
        }
    }

    async onStart(pauseArguments) {
        if (this._activeIndex >= 0 && this._activeIndex < this._fragments.length){
            this.setActiveFragment(this._activeIndex);
        }
        return super.onStart(pauseArguments);
    }

    setActiveFragment(index) {
        if (index instanceof SwipeChildFragment) {
            index = this._fragments.indexOf(index);
        }

        if (index >= 0 && index < this._fragments.length) {
            this._activeIndex = index;
            this._fragments.forEach((frag, i) => {
                frag.setActive(i === this._activeIndex);
            });
        }
    }

    nextFragment(){
        this.setActiveFragment((this._activeIndex + 1) % this._fragments.length);
    }

    previousFragment(){
        this.setActiveFragment((this._activeIndex + this._fragments.length - 1) % this._fragments.length);
    }

    addFragment(fragment) {
        if (fragment instanceof SwipeChildFragment) {
            fragment.setParent(this);
            return super.addFragment(".swipe-container", fragment);
        }
    }
}

SwipeFragment.MAX_Y = 80;
SwipeFragment.MIN_X = 150;

// import {MBBDatabase} from "../Database/MBBDatabase";

class BaseModel {

    constructor() {
        this._id = null;
    }

    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

    async save(){
        //Wenn direkt BaseModel.saveModel aufgerufen wird, später ein Fehler geschmissen (_method not defined), da der
        // falsche Kontext am Objekt existiert
        return this.constructor.saveModel(this);
    }

    static _newModel() {
        throw new Error("_method not defined");
    }

    static getModelName() {
        throw new Error("_method not defined!");
    }

    static getTableSchema() {
        throw new Error("_method not defined!");
    }

    static async _getDBInstance() {
        throw new Error("_method not defined!");
    }

    static _modelToJson(model) {
        let schemaDefinition = this.getTableSchema();
        let jsonObject = {};
        schemaDefinition.forEach(column => {
            let getterName = ["get", column.key.substr(0, 1).toUpperCase(), column.key.substr(1)].join('');
            if (typeof model[getterName] === "function") {
                jsonObject[column.key] = model[getterName]();
            }
        });
        return jsonObject;
    }

    static async saveModel(model) {

        let table = this.getTable();
        let jsonModel = this._modelToJson(model);

        table = await table;
        let res = await table.query("upsert", jsonModel).exec();
        if (res[0] && res[0]["affectedRowPKS"] && res[0]["affectedRows"] && res[0]["affectedRows"].length >= 1) {
            let jsonObject = res[0]["affectedRows"][0];
            return this._inflate(jsonObject, model);
        }
        return null;
    }

    static async getTable() {
        let db = await this._getDBInstance();
        return db.getTable(this.getModelName());
    }

    static async selectOne(where, orderBy, offset) {
        let models = await this.select(where, orderBy, 1, offset);
        if (models.length >= 1){
            return models[0];
        }
        return null;
    }

    /**
     * @param where
     * @param orderBy
     * @param limit
     * @param offset
     * @returns {Promise<[Article]>}
     */
    static async select(where, orderBy, limit, offset) {
        let table = await this.getTable();

        let query = table.query("select");
        if (Helper.isNotNull(where)) {
            if (!Array.isArray(where) && typeof where === "object"){
                let newWhere = [];
                let keys= Object.keys(where);
                keys.forEach((key, index) => {
                    newWhere.push([key, "=", where[key]]);
                    if (index < keys.length-1){
                        newWhere.push("AND");
                    }
                });
                where = newWhere;
            }
            query = query.where(where);
        }
        if (Helper.isNotNull(orderBy)) {
            query = query.orderBy(orderBy);
        }
        if (Helper.isNotNull(limit)) {
            query = query.limit(limit);
        }
        if (Helper.isNotNull(offset)) {
            query = query.offset(offset);
        }
        return this._inflate(await query.exec());
    }

    static _inflate(jsonObjects, models) {
        models = Helper.nonNull(models, []);

        let isArray = Array.isArray(jsonObjects);
        if (!isArray) {
            jsonObjects = [jsonObjects];
        }
        if (!Array.isArray(models)) {
            models = [models];
        }

        jsonObjects.forEach((jsonObject, index) => {
            let model = (models.length > index) ? models[index] : this._newModel();
            for (let k in jsonObject) {
                let setterName = ["set", k.substr(0, 1).toUpperCase(), k.substr(1)].join('');
                if (typeof model[setterName] === "function") {
                    model[setterName](jsonObject[k]);
                }
                models[index] = model;
            }
        });
        if (!isArray) {
            models = (models.length > 0) ? models[0] : null;
        }
        return models;
    }
}

/**
 * Wrapper für Nano-SQL, sollte Abgeleitet werden und setupDatabase überschrieben werden
 *
 * Handled den Datenbank-Typ (IndexedDB, SQLite, ...) in _connectToDatabase
 * Bei Anfragen durch getTable() ist die Datenbank verbunden
 */
class NanoSQLWrapper {

    /**
     * Initialisiert das Verbindungs-Promise,
     * Lässt die Datenbank initialisieren und verbinden
     *
     * @param databaseName
     */
    constructor(databaseName) {
        this.connectionResolveReject = {};
        this._connectionPromise = new Promise((resolver, rejecter) => {
            this.connectionResolveReject.resolve = resolver;
            this.connectionResolveReject.reject = rejecter;
        });

        this.databaseName = databaseName;

        this.setupDatabase();
        this._connectToDatabase();
    }

    /**
     * Methode, welche von Kinderklassen überschrieben werden sollte
     * Datenbank-Schema sollte hier definiert werden
     */
    setupDatabase() {

    }

    /**
     * Hilfs-funktion, um ein Model/Eine Tabelle schneller zu generieren
     *
     * @param name
     * @param schema
     */
    declareModel(name, schema) {
        return nSQL(name).model(schema);
    }

    /**
     * Methode, welche sich zur Datenbank verbindet. Benutzt den an den Constructor übergebenen Datenbanknamen
     *
     * @returns {Promise<any>}
     */
    async _connectToDatabase() {
        nSQL().config({
            mode: (typeof cordova === "undefined"
                || window.cordova.platformId === "browser"
                || !window["sqlitePlugin"]) ?
                "PERM" : new SQLiteStore(),
            id: this.databaseName
        }).connect().then(this.connectionResolveReject.resolve).catch(this.connectionResolveReject.reject);
        return this._connectionPromise;
    }

    async waitForConnection(){
        return this._connectionPromise;
    }

    /**
     *  Gibt ein Promise mit einer NanoSQLInstance auf die entsprechende Tabelle zurück.
     *  Promise wartet auf das Verbinden der Datenbank (welches durch den Constructor ausgelöst wird), um vorzeitige
     *  Anfragen zu verhindern.
     *
     * @param table
     * @returns {Promise<NanoSQLInstance>}
     */
    async getTable(table) {
        await this._connectionPromise;
        return nSQL(table);
    }
}

class Dialog {
    constructor(content, title) {
        this._resolver = null;
        this._content = null;
        this._backgroundElement = null;
        this._cancelable = true;
        this._title = Helper.nonNull(title, "");
        this._translatable = true;
        this._additionalClasses = "";
        this._buttons = [];
        this._result = null;
        this._contentPromise = null;

        if (Helper.isNotNull(content)) {
            this.setContent(content);
        }
    }

    setTitle(title) {
        this._title = title;
        return this;
    }

    setTranslatable(translatable) {
        this._translatable = translatable;
    }

    setAdditionalClasses(classes) {
        this._additionalClasses = classes;
    }

    getTitle() {
        return this._title;
    }

    setCancelable(cancelable) {
        this._cancelable = (cancelable === true);
        return this;
    }

    async setContent(content) {
        if (typeof content === "string" && content.endsWith(".html")){
            content = ViewInflater.getInstance().load(content);
        }
        this._contentPromise = Promise.resolve(content);
        this._content = await this._contentPromise;
        return this;
    }

    addButton(elementOrText, listenerOrResult, shouldClose) {
        shouldClose = Helper.nonNull(shouldClose, true);

        let button = null;
        if (typeof elementOrText === "string") {
            button = document.createElement("button");
            button.classList.add("button");
            button.classList.add("right");
            button.appendChild(Translator.makePersistentTranslation(elementOrText));
        }
        else {
            button = elementOrText;
        }

        let self = this;
        if (typeof listenerOrResult !== "function") {
            let result = listenerOrResult;
            listenerOrResult = function () {
                self._result = result;
            };
        }

        let callback = null;
        if (shouldClose) {
            callback = function (e) {
                if (Helper.isNotNull(listenerOrResult)) {
                    listenerOrResult(e);
                }
                self.close();
            };
        }
        else {
            callback = listenerOrResult;
        }

        if (Helper.isNotNull(callback)) {
            button.addEventListener("click", callback);
        }
        this._buttons.push(button);
    }

    async show() {

        let titleElement = document.createElement("span");
        titleElement.classList.add("title");
        if (this._translatable && this._title !== "") {
            titleElement.appendChild(Translator.makePersistentTranslation(this._title));
        }
        else {
            titleElement.innerHTML = this._title;
        }

        let titleBar = document.createElement("div");
        titleBar.appendChild(titleElement);

        let contentContainer = document.createElement("div");
        contentContainer.classList.add("content-container");

        let modalDialog = document.createElement("div");
        modalDialog.className = this._additionalClasses;
        modalDialog.classList.add("modal");
        modalDialog.appendChild(titleBar);
        modalDialog.appendChild(contentContainer);

        let buttonBar = document.createElement("div");
        buttonBar.classList.add("modal-button-container");

        for (let i = 0, n = this._buttons.length; i < n; i++) {
            buttonBar.appendChild(this._buttons[i]);
        }

        await this._contentPromise;
        if (!(this._content instanceof Node)) {
            this._content = (this._translatable) ? Translator.makePersistentTranslation(this._content) : document.createTextNode(this._content);
        }
        contentContainer.appendChild(this._content);

        this._backgroundElement = document.createElement("div");
        this._backgroundElement.classList.add("background");
        this._backgroundElement.appendChild(modalDialog);

        this._backgroundElement.querySelector(".modal").appendChild(buttonBar);
        this._backgroundElement.style.display = "block";

        let self = this;
        if (this._cancelable) {
            let closeButton = document.createElement("span");
            closeButton.classList.add("close");
            closeButton.innerHTML = "&times;";

            titleBar.appendChild(closeButton);
            closeButton.addEventListener("click", function () {
                self.close();
            });
            window.addEventListener("click", function (e) {
                if (e.target === self._backgroundElement) {
                    self.close();
                }
            });
        }

        document.body.appendChild(this._backgroundElement);
        Translator.getInstance().updateTranslations();

        return new Promise(function (resolve) {
            self._resolver = resolve;
        });
    }

    close() {
        if (Helper.isNotNull(this._backgroundElement)) {
            this._backgroundElement.style.display = "none";
            this._backgroundElement.remove();
            this._backgroundElement = null;
        }
        if (Helper.isNotNull(this._resolver)) {
            this._resolver(this._result);
        }
    }

    // addDefaultButton(){
    //     this.addButton("confirm-button");
    // }
}

import view$1 from './assets/src/html/Framework/Dialog/chooseDialog.html';

class ChooseDialog extends Dialog {

    constructor(valueNames, title) {
        let viewPromise = ViewInflater.getInstance().load(view$1).then(view => {

            let template = view.querySelector("#choose-value-template");
            template.remove();
            template.removeAttribute("id");

            let templateContainer = view.querySelector("#choose-container");

            for(let k in valueNames){
                let valueElem = template.cloneNode(true);
                valueElem.querySelector(".choose-dialog-value").appendChild(Translator.makePersistentTranslation(valueNames[k]));
                valueElem["dataset"]["value"] = k;

                valueElem.addEventListener("click", () => {
                    this._result = k;
                    this.close();
                });
                templateContainer.appendChild(valueElem);
            }
            return view;
        });

        super(viewPromise, title);
    }
}

class ConfirmDialog extends Dialog {
    constructor(content, title) {
        super(content, title);
    }

    async show() {
        this.addButton("confirm-button", true);
        this.addButton("cancel-button", false);

        return super.show();
    }


    close() {
        if (Helper.isNull(this._result))
        {
            this._result = false;
        }
        return super.close();
    }
}

class Form {
    constructor(formElem, urlOrCallback, method) {
        this._formElem = formElem;
        this._method = Helper.nonNull(method, formElem["method"], "POST");
        this._elementChangeListener = null;

        this._validators = [];

        this._isBusy = false;

        if (typeof urlOrCallback === "string") {
            this._submitHandler = (values) => {
                if (this._method.toLowerCase() === "get") {
                    return (DataManager.load(urlOrCallback + DataManager.buildQuery(values)));
                }
            };
        } else {
            this._submitHandler = urlOrCallback;
        }

        this._submitCallback = null;
        this.errorCallback = async (errors) => {
            await this.setErrors(errors);
        };

        formElem.addEventListener("submit", async function (e) {
            e.preventDefault();
            await self.doSubmit(e);
        });

        let self = this;
        [...formElem.elements].forEach(element => {
            element.addEventListener("change", function () {
                if (this.value.trim() !== "") {
                    this.classList.add("notEmpty");
                } else {
                    this.classList.remove("notEmpty");
                }
                this.setCustomValidity("");
                if (Helper.isNotNull(self._elementChangeListener)) {
                    self._elementChangeListener();
                }
                this.setCustomValidity("");
            });
            element.addEventListener("keydown", function () {
                this.setCustomValidity("");
            });
        });
    }

    addValidator(validatorCallback) {
        this._validators.push(validatorCallback);
    }

    onError(errorHandler) {
        this.errorCallback = errorHandler;
    }

    async doSubmit() {
        if (!this._isBusy) {
            let res = await this.submit();
            //TODO einbauen, wenn server dazu kommt

            // if (res["success"]) {
            //     if (self._submitCallback !== null) {
            //         return self._submitCallback(res["result"]);
            //     }
            // } else if (Helper.isNotNull(self.errorCallback)) {
            //     return self.errorCallback(res["errors"]);
            // }
            return res;
        }
        return false;
    }

    // load(url, isCached) {
    //     this.setValues(DataManager.load(url, isCached).then(function (values) {
    //         if (values["success"]) {
    //             return values["result"];
    //         }
    //         return {};
    //     }));
    //     return this;
    // }

    async setValues(valuePromise) {
        this.setIsBusy(true);
        let values = await Promise.resolve(valuePromise);

        this.setIsBusy(false);
        for (let k in values) {
            if (Helper.isNotNull(this._formElem.elements[k])) {
                if (Helper.isNotNull(this._formElem.elements[k].options) && Helper.isNotNull(values[k + "Options"])) {
                    let options = this._formElem.elements[k].options;
                    for (let val in values[k + "Options"]) {
                        let option = document.createElement("option");
                        option.value = val;
                        option.innerText = values[k + "Options"][val];
                        options.add(option);
                    }
                }

                this._formElem.elements[k].value = Helper.htmlspecialcharsDecode(values[k]);
                if (Helper.isNotNull(values[k]) && ("" + values[k]).trim() !== "") {
                    this._formElem.elements[k].classList.add("notEmpty");
                } else {
                    this._formElem.elements[k].classList.remove("notEmpty");
                }
            }
        }
        return this;
    }

    async getValues(filesToBase64) {
        let values = new FormData(this._formElem);
        values = Array.from(values.entries()).reduce((memo, pair) => ({
            ...memo,
            [pair[0]]: pair[1],
        }), {});
        if (Helper.nonNull(filesToBase64, true)) {
            let filePromises = [];

            Object.keys(values).forEach(key => {
                if (values[key] instanceof File) {
                    filePromises.push(new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = error => reject(error);
                        reader.readAsDataURL(values[key]);
                    }).then(base64 => values[key] = base64));
                }
            });

            await Promise.all(filePromises);
        }
        return values;
    }

    setElementChangeListener(listener) {
        this._elementChangeListener = listener;
    }

    async setErrors(errors) {
        let hasElem = false;
        let firstError = null;

        for (let k in errors) {
            if (Helper.isNotNull(this._formElem.elements[k]) && this._formElem.elements[k].type !== "hidden"
                && Helper.isNull(this._formElem.elements[k].readonly) && (
                    Helper.isNull(this._formElem.elements[k].disabled) || !this._formElem.elements[k].disabled)
            ) {
                this._formElem.elements[k].setCustomValidity(Translator.translate(Helper.nonNull(errors[k], "form-default-error")));
                hasElem = true;
            }
            if (Helper.isNull(firstError)) {
                firstError = Helper.nonNull(errors[k], "form-default-error");
            }
        }
        if (!hasElem && Helper.isNotNull(firstError)) {
            for (let k in this._formElem.elements) {
                if (this._formElem.elements[k].type !== "hidden") {
                    this._formElem.elements[k].setCustomValidity(Translator.translate(firstError));
                    hasElem = true;
                    break;
                }
            }
        }

        if (hasElem) {
            this._formElem.reportValidity();//querySelector("input[type=submit], button").click();
        }
    }

    setIsBusy(isBusy) {
        this._isBusy = isBusy;
        if (this._isBusy) {
            this._formElem.classList.add("sending");
        } else {
            this._formElem.classList.remove("sending");
        }
    }

    async submit() {
        this.setIsBusy(true);
        if (await this.validate()) {
            this.setIsBusy(false);
            return await (this._submitHandler(await this.getValues(), this));
        }
        this.setIsBusy(false);
        return false;
    }

    async validate() {
        if (!this._formElem.reportValidity()) {
            return false;
        }
        let values = await this.getValues();

        let res = await Helper.asyncForEach(this._validators, async validator => {
            return validator(values, this);
        }, true);

        let hasErrors = false;
        let errors = {};
        res.forEach(value => {
            if (value !== true) {
                hasErrors = true;
                if (typeof value === "object") {
                    for (let k in value) {
                        errors[k] = value[k];
                    }
                }
            }
        });

        if (hasErrors) {
            await this.setErrors(errors);
            return false;
        }
        return true;
    }

    onSubmit(callback) {
        this._submitCallback = callback;
    }

    getFormElement(){
        return this._formElem;
    }
}

class ToastManager {

    constructor() {
        this._toastContainer = document.querySelector(ToastManager._toastContainerSelector);
        this._toastTemplate = this._toastContainer.querySelector(".toast-template");
        this._toastTemplate.classList.remove("toast-template");
        this._toastTemplate.remove();
    }

    async showToast(toast) {
        let message = toast.getMessage();
        if (toast.isShouldTranslate()) {
            message = Translator.makePersistentTranslation(message, toast.getTranslationArgs());
        } else {
            message = document.createTextNode(message);
        }

        let toastElement = this._toastTemplate.cloneNode(true);
        toastElement.querySelector(".message").appendChild(message);
        toast.setToastElement(toastElement);

        this._toastContainer.appendChild(toastElement);

        toastElement.style.opacity = 1;

        return new Promise(resolve => {
            toastElement.querySelector(".message").onclick = () => {
                this.hideToast(toast);
                resolve(true);
            };
            setTimeout(() => {
                this.hideToast(toast);
                resolve(false);
            }, toast.getDuration());
        });
    }

    async hideToast(toast) {
        //TODO Animation hinzufügen
        let element = toast.getToastElement();
        if (Helper.isNotNull(element)) {
            element.style.opacity = 0;
            return new Promise(res => {
                setTimeout(() => {
                    element.remove();
                    res();
                }, 250);
            });
        }
        return Promise.reject("toast is not showing");
    }

    static setToastContainerSelector(selector) {
        ToastManager._toastContainerSelector = selector;
    }

    static getInstance() {
        if (!ToastManager._instance) {
            ToastManager._instance = new ToastManager();
        }
        return ToastManager._instance;
    }
}

ToastManager._instance = null;
ToastManager._toastContainerSelector = "#toast-container";

class Toast{
    constructor(message, duration, shouldTranslateOrTranslationArgs){
        this._message = message;
        this._duration = Helper.nonNull(duration, Toast.DEFAULT_DURATION);
        this._shouldTranslate = shouldTranslateOrTranslationArgs !== false;
        this._translationArgs = Helper.nonNull(shouldTranslateOrTranslationArgs, []);
        this._id  = Toast.LAST_ID++;
        this._toastElement = null;
    }

    getId(){
        return this._id;
    }

    getMessage() {
        return this._message;
    }

    getDuration(){
        return this._duration;
    }

    isShouldTranslate(){
        return this._shouldTranslate;
    }

    getTranslationArgs(){
        return this._translationArgs;
    }

    setToastElement(element){
        this._toastElement = element;
    }

    getToastElement(){
        return this._toastElement;
    }

    async show(){
        return ToastManager.getInstance().showToast(this);
    }

    async hide(){
        return ToastManager.getInstance().hideToast(this);
    }
}
Toast.LAST_ID = 0;

Toast.DEFAULT_DURATION = 2500;

export { App, AbstractFragment, AbstractSite, ContainerSite, Context, Menu, MenuAction, OpenSubmenuAction, NavbarFragment, AccordionRenderer, DropdownRenderer, MenuRenderer, Submenu, MenuSite, SiteManager, SwipeChildFragment, SwipeFragment, TemplateSite, DataManager, BaseModel, NanoSQLWrapper, ChooseDialog, ConfirmDialog, Dialog, Form, Helper, HistoryManager, NativeStoragePromise, Toast, ToastManager, Translator, ViewInflater };
