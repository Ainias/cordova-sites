import { Helper } from 'js-helper/dist/shared';
/**
 * Singleton-Klasse zum Übersetzen von Text-Inhalten
 */
var Translator = /** @class */ (function () {
    /**
     * Erstellt einen neuen Translator
     * @param config
     */
    function Translator(config) {
        var _this = this;
        if (config === void 0) { config = {
            translations: {},
            fallbackLanguage: 'en',
            markUntranslatedTranslations: true,
            markTranslations: false,
            logMissingTranslations: true,
        }; }
        this.dynamicKey = 0;
        this.translations = {};
        this.addDynamicTranslations(Translator.translations);
        this.addDynamicTranslations(config.translations);
        this.fallbackLanguage = config.fallbackLanguage;
        this.markUntranslatedTranslations = config.markUntranslatedTranslations;
        this.markTranslations = config.markTranslations;
        if (config.logMissingTranslations === true) {
            this.logMissingTranslationsFunction = function (missingTranslation, language) {
                if (language === _this.fallbackLanguage) {
                    console.error("missing base translation for key " + missingTranslation);
                }
                else {
                    console.warn("missing translation for language >" + language + "< and key >" + missingTranslation + "<");
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
    Translator.prototype.createDynamicKey = function () {
        this.dynamicKey++;
        return "translator-dynamic-" + new Date().getTime() + "-" + this.dynamicKey;
    };
    /**
     * Übersetzt sofort einen Key in die aktuelle Sprache
     * @param key
     * @param args
     * @param selectedLanguage
     * @returns {*}
     */
    Translator.prototype.translate = function (key, args, selectedLanguage) {
        if (Helper.isNull(key)) {
            return '';
        }
        var language = Helper.nonNull(selectedLanguage, args, this.fallbackLanguage);
        var translation = null;
        key = key.toLowerCase();
        if (Helper.isNotNull(this.translations[language]) && Helper.isNotNull(this.translations[language][key])) {
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
                translation = "&gt;&gt;" + translation + "&lt;&lt;";
            }
        }
        if (this.markTranslations) {
            translation = "$" + translation + "$";
        }
        if (args !== undefined) {
            translation = Translator.format(translation, args);
        }
        return translation;
    };
    /**
     * Fügt neue Übersetzungen hinzu
     * @param trans
     */
    Translator.prototype.addDynamicTranslations = function (trans) {
        var _this = this;
        Object.keys(trans).forEach(function (lang) {
            if (!_this.translations[lang]) {
                _this.translations[lang] = {};
            }
            Object.keys(trans[lang]).forEach(function (key) {
                _this.translations[lang][key.toLowerCase()] = trans[lang][key];
            });
        });
    };
    Translator.prototype.getLanguages = function () {
        return Object.keys(this.translations);
    };
    Translator.prototype.getFallbackLanguage = function () {
        return this.fallbackLanguage;
    };
    Translator.translate = function (key, args, language) {
        var instance = Translator.getInstance();
        if (instance) {
            return instance.translate(key, args, language);
        }
        return '';
    };
    Translator.addDynamicTranslations = function (trans) {
        var instance = Translator.getInstance();
        if (instance) {
            instance.addDynamicTranslations(trans);
        }
        else {
            Object.keys(trans).forEach(function (lang) {
                if (Helper.isNull(Translator.translations[lang])) {
                    Translator.translations[lang] = {};
                }
                Object.assign(Translator.translations[lang], trans[lang]);
            });
        }
    };
    Translator.init = function (config) {
        Translator.instance = new Translator(config);
    };
    /**
     * @returns {Translator|null}
     */
    Translator.getInstance = function () {
        return Translator.instance;
    };
    Translator.format = function (translation, args) {
        return translation.replace(/{(\d+)}/g, function (match, number) {
            return args[number] !== undefined ? args[number] : match;
        });
    };
    Translator.translations = {};
    return Translator;
}());
export { Translator };
//# sourceMappingURL=Translator.js.map