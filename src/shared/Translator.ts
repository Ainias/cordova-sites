import { Helper } from '@ainias42/js-helper';

type Translations = Record<string, Record<string, string>>;
type TranslatorConfig = {
    translations: Translations;
    fallbackLanguage: string;
    markUntranslatedTranslations: boolean;
    markTranslations: boolean;
    logMissingTranslations?: boolean | ((missingTranslation: string, language: string) => void);
};

/**
 * Singleton-Klasse zum Übersetzen von Text-Inhalten
 */
export class Translator {
    private static translations: Record<string, Record<string, string>> = {};
    static instance: Translator;

    private dynamicKey = 0;

    private translations: Translations;
    private fallbackLanguage: string;
    private markUntranslatedTranslations: boolean;
    private markTranslations: boolean;
    private logMissingTranslationsFunction?: (missingTranslation: string, language: string) => void;

    private translationCallbacks;
    private lastTranslationCallbackId: number;

    /**
     * Erstellt einen neuen Translator
     * @param config
     */
    constructor(
        config: TranslatorConfig = {
            translations: {},
            fallbackLanguage: 'en',
            markUntranslatedTranslations: true,
            markTranslations: false,
            logMissingTranslations: true,
        }
    ) {
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
                } else {
                    console.warn(`missing translation for language >${language}< and key >${missingTranslation}<`);
                }
            };
        } else if (typeof config.logMissingTranslations === 'function') {
            this.logMissingTranslationsFunction = config.logMissingTranslations;
        } else {
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
    translate(key: string, args?: string[], selectedLanguage?: string) {
        if (Helper.isNull(key)) {
            return '';
        }

        const language = Helper.nonNull(selectedLanguage, args, this.fallbackLanguage);

        let translation;

        key = key.toLowerCase();
        if (Helper.isNotNull(this.translations[language]) && Helper.isNotNull(this.translations[language][key])) {
            translation = this.translations[language][key];
        } else {
            if (typeof this.logMissingTranslationsFunction === 'function') {
                this.logMissingTranslationsFunction(key, language);
            }
            if (this.translations[this.fallbackLanguage]) {
                translation = this.translations[this.fallbackLanguage][key];
            } else {
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
    addDynamicTranslations(trans: Translations) {
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

    static translate(key: string, args?: string[], language?: string) {
        const instance = Translator.getInstance();
        if (instance) {
            return instance.translate(key, args, language);
        }
        return '';
    }

    static addDynamicTranslations(trans: Translations) {
        const instance = Translator.getInstance();
        if (instance) {
            instance.addDynamicTranslations(trans);
        } else {
            Object.keys(trans).forEach((lang) => {
                if (Helper.isNull(Translator.translations[lang])) {
                    Translator.translations[lang] = {};
                }
                Object.assign(Translator.translations[lang], trans[lang]);
            });
        }
    }

    static init(config: TranslatorConfig) {
        Translator.instance = new Translator(config);
    }

    /**
     * @returns {Translator|null}
     */
    static getInstance(): Translator {
        return Translator.instance;
    }

    private static format(translation: string, args: string[]) {
        return translation.replace(/{(\d+)}/g, (match, number) => {
            return args[number] !== undefined ? args[number] : match;
        });
    }
}
