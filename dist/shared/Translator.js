"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translator = void 0;
const shared_1 = require("js-helper/dist/shared");
/**
 * Singleton-Klasse zum Übersetzen von Text-Inhalten
 */
class Translator {
    /**
     * Erstellt einen neuen Translator
     * @param config
     */
    constructor(config = {
        translations: {},
        fallbackLanguage: "en",
        markUntranslatedTranslations: true,
        markTranslations: false,
        logMissingTranslations: true
    }) {
        this._dynamicKey = 0;
        this._translations = {};
        this.addDynamicTranslations(Translator._translations);
        this.addDynamicTranslations(config.translations);
        this._fallbackLanguage = config.fallbackLanguage;
        this._markUntranslatedTranslations = config.markUntranslatedTranslations;
        this._markTranslations = config.markTranslations;
        if (config.logMissingTranslations === true) {
            this._logMissingTranslationsFunction = (missingTranslation, language) => {
                if (language === this._fallbackLanguage) {
                    console.error("missing base translation for key " + missingTranslation);
                }
                else {
                    console.warn("missing translation for language >" + language + "< and key >" + missingTranslation + "<");
                }
            };
        }
        else if (typeof config.logMissingTranslations === "function") {
            this._logMissingTranslationsFunction = config.logMissingTranslations;
        }
        else {
            this._logMissingTranslationsFunction = null;
        }
        this._translationCallbacks = new Map();
        this._lastTranslationCallbackId = 0;
    }
    createDynamicKey() {
        this._dynamicKey++;
        return "translator-dynamic-" + new Date().getTime() + "-" + this._dynamicKey;
    }
    /**
     * Übersetzt sofort einen Key in die aktuelle Sprache
     * @param key
     * @param args
     * @param language
     * @returns {*}
     */
    translate(key, args, language) {
        if (shared_1.Helper.isNull(key)) {
            return "";
        }
        language = shared_1.Helper.nonNull(language, args, this._fallbackLanguage);
        let translation = null;
        key = key.toLowerCase();
        if (shared_1.Helper.isNotNull(this._translations[language]) && shared_1.Helper.isNotNull(this._translations[language][key])) {
            translation = this._translations[language][key];
        }
        if (!Translator._isValid(translation)) {
            if (this._logMissingTranslationsFunction !== null) {
                this._logMissingTranslationsFunction(key, language);
            }
            if (this._translations[this._fallbackLanguage]) {
                translation = this._translations[this._fallbackLanguage][key];
            }
            if (!Translator._isValid(translation)) {
                if (this._logMissingTranslationsFunction !== null) {
                    this._logMissingTranslationsFunction(key, language);
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
    getLanguages() {
        return Object.keys(this._translations);
    }
    getFallbackLanguage() {
        return this._fallbackLanguage;
    }
    static translate(key, args, language) {
        let instance = Translator.getInstance();
        if (instance) {
            return instance.translate(key, args, language);
        }
        return "";
    }
    static addDynamicTranslations(trans) {
        let instance = Translator.getInstance();
        if (instance) {
            return instance.addDynamicTranslations(trans);
        }
        else {
            Object.keys(trans).forEach(lang => {
                if (shared_1.Helper.isNull(Translator._translations[lang])) {
                    Translator._translations[lang] = {};
                }
                Object.assign(Translator._translations[lang], trans[lang]);
            });
        }
    }
    static init(config) {
        Translator.instance = new Translator(config);
    }
    /**
     * @returns {Translator|null}
     */
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
exports.Translator = Translator;
Translator._translations = {};
Translator.instance = null;
//# sourceMappingURL=Translator.js.map