import {Helper} from "js-helper/dist/shared";

/**
 * Singleton-Klasse zum Übersetzen von Text-Inhalten
 */
export class Translator {

    /**
     * Erstellt einen neuen Translator
     * @param config
     */
    constructor(config) {

        config = Helper.nonNull(config, {});
        this._translations = {};
        this.addDynamicTranslations(Translator._translations);
        this.addDynamicTranslations(config.translations || {});

        this._fallbackLanguage = config.fallbackLanguage || "en";

        this._markUntranslatedTranslations = config.markUntranslatedTranslations;
        this._markTranslations = config.markTranslations;
        this._logMissingTranslations = config.logMissingTranslations;

        this._translationCallbacks = new Map();
        this._lastTranslationCallbackId = 0;
    }

    /**
     * Übersetzt sofort einen Key in die aktuelle Sprache
     * @param key
     * @param args
     * @param language
     * @returns {*}
     */
    translate(key, args, language) {
        if (Helper.isNull(key)) {
            return "";
        }

        language = Helper.nonNull(language, args, this._fallbackLanguage);

        let translation = null;

        key = key.toLowerCase();
        if (this._translations[language] && this._translations[language][key]) {
            translation = this._translations[language][key];
        }

        if (!Translator._isValid(translation)) {
            if (this._logMissingTranslations) {
                console.warn("missing translation for language " + language + " and key " + key);
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
            translation = Translator._format(translation, args)
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
        } else {
            Object.keys(trans).forEach(lang => {
                if (Helper.isNull(Translator._translations[lang])) {
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

Translator._translations = {};

Translator.instance = null;
