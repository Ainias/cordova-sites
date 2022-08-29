declare type Translations = Record<string, Record<string, string>>;
declare type TranslatorConfig = {
    translations: Translations;
    fallbackLanguage: string;
    markUntranslatedTranslations: boolean;
    markTranslations: boolean;
    logMissingTranslations?: boolean | ((missingTranslation: string, language: string) => void);
};
/**
 * Singleton-Klasse zum Übersetzen von Text-Inhalten
 */
export declare class Translator {
    private static translations;
    static instance: Translator;
    private dynamicKey;
    private translations;
    private fallbackLanguage;
    private markUntranslatedTranslations;
    private markTranslations;
    private logMissingTranslationsFunction?;
    private translationCallbacks;
    private lastTranslationCallbackId;
    /**
     * Erstellt einen neuen Translator
     * @param config
     */
    constructor(config?: TranslatorConfig);
    createDynamicKey(): string;
    /**
     * Übersetzt sofort einen Key in die aktuelle Sprache
     * @param key
     * @param args
     * @param selectedLanguage
     * @returns {*}
     */
    translate(key: string, args?: string[], selectedLanguage?: string): string;
    /**
     * Fügt neue Übersetzungen hinzu
     * @param trans
     */
    addDynamicTranslations(trans: Translations): void;
    getLanguages(): string[];
    getFallbackLanguage(): string;
    static translate(key: string, args?: string[], language?: string): string;
    static addDynamicTranslations(trans: Translations): void;
    static init(config: TranslatorConfig): void;
    /**
     * @returns {Translator|null}
     */
    static getInstance(): Translator;
    private static format;
}
export {};
