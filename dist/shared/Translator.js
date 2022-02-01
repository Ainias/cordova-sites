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
        fallbackLanguage: 'en',
        markUntranslatedTranslations: true,
        markTranslations: false,
        logMissingTranslations: true,
    }) {
        this.dynamicKey = 0;
        this.translations = {};
        this.addDynamicTranslations(Translator.translations);
        this.addDynamicTranslations(config.translations);
        this.fallbackLanguage = config.fallbackLanguage;
        this.markUntranslatedTranslations = config.markUntranslatedTranslations;
        this.markTranslations = config.markTranslations;
        if (config.logMissingTranslations === true) {
            this.logMissingTranslationsFunction = (missingTranslation, language) => {
                if (language === this.fallbackLanguage) {
                    console.error(`missing base translation for key ${missingTranslation}`);
                }
                else {
                    console.warn(`missing translation for language >${language}< and key >${missingTranslation}<`);
                }
            };
        }
        else if (typeof config.logMissingTranslations === 'function') {
            this.logMissingTranslationsFunction = config.logMissingTranslations;
        }
        else {
            this.logMissingTranslationsFunction = undefined;
        }
        this.translationCallbacks = new Map();
        this.lastTranslationCallbackId = 0;
    }
    createDynamicKey() {
        this.dynamicKey++;
        return `translator-dynamic-${new Date().getTime()}-${this.dynamicKey}`;
    }
    /**
     * Übersetzt sofort einen Key in die aktuelle Sprache
     * @param key
     * @param args
     * @param selectedLanguage
     * @returns {*}
     */
    translate(key, args, selectedLanguage) {
        if (shared_1.Helper.isNull(key)) {
            return '';
        }
        const language = shared_1.Helper.nonNull(selectedLanguage, args, this.fallbackLanguage);
        let translation = null;
        key = key.toLowerCase();
        if (shared_1.Helper.isNotNull(this.translations[language]) && shared_1.Helper.isNotNull(this.translations[language][key])) {
            translation = this.translations[language][key];
        }
        else {
            if (typeof this.logMissingTranslationsFunction === 'function') {
                this.logMissingTranslationsFunction(key, language);
            }
            if (this.translations[this.fallbackLanguage]) {
                translation = this.translations[this.fallbackLanguage][key];
            }
            else {
                if (typeof this.logMissingTranslationsFunction === 'function') {
                    this.logMissingTranslationsFunction(key, language);
                }
                translation = key;
            }
            if (this.markUntranslatedTranslations) {
                translation = `&gt;&gt;${translation}&lt;&lt;`;
            }
        }
        if (this.markTranslations) {
            translation = `$${translation}$`;
        }
        if (args !== undefined) {
            translation = Translator.format(translation, args);
        }
        return translation;
    }
    /**
     * Fügt neue Übersetzungen hinzu
     * @param trans
     */
    addDynamicTranslations(trans) {
        Object.keys(trans).forEach((lang) => {
            if (!this.translations[lang]) {
                this.translations[lang] = {};
            }
            Object.keys(trans[lang]).forEach((key) => {
                this.translations[lang][key.toLowerCase()] = trans[lang][key];
            });
        });
    }
    getLanguages() {
        return Object.keys(this.translations);
    }
    getFallbackLanguage() {
        return this.fallbackLanguage;
    }
    static translate(key, args, language) {
        const instance = Translator.getInstance();
        if (instance) {
            return instance.translate(key, args, language);
        }
        return '';
    }
    static addDynamicTranslations(trans) {
        const instance = Translator.getInstance();
        if (instance) {
            instance.addDynamicTranslations(trans);
        }
        else {
            Object.keys(trans).forEach((lang) => {
                if (shared_1.Helper.isNull(Translator.translations[lang])) {
                    Translator.translations[lang] = {};
                }
                Object.assign(Translator.translations[lang], trans[lang]);
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
    static format(translation, args) {
        return translation.replace(/{(\d+)}/g, (match, number) => {
            return args[number] !== undefined ? args[number] : match;
        });
    }
}
exports.Translator = Translator;
Translator.translations = {};
//# sourceMappingURL=Translator.js.map