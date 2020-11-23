/**
 * Singleton-Klasse zum Übersetzen von Text-Inhalten
 */
export declare class Translator {
    static _translations: any;
    static instance: Translator;
    _dynamicKey: number;
    _translations: any;
    _fallbackLanguage: string;
    _markUntranslatedTranslations: boolean;
    _markTranslations: boolean;
    _logMissingTranslationsFunction: any;
    _translationCallbacks: any;
    _lastTranslationCallbackId: number;
    /**
     * Erstellt einen neuen Translator
     * @param config
     */
    constructor(config?: {
        translations: {};
        fallbackLanguage: string;
        markUntranslatedTranslations: boolean;
        markTranslations: boolean;
        logMissingTranslations: boolean;
    });
    createDynamicKey(): string;
    /**
     * Übersetzt sofort einen Key in die aktuelle Sprache
     * @param key
     * @param args
     * @param language
     * @returns {*}
     */
    translate(key: any, args?: any, language?: any): any;
    /**
     * Fügt neue Übersetzungen hinzu
     * @param trans
     */
    addDynamicTranslations(trans: any): void;
    getLanguages(): string[];
    getFallbackLanguage(): string;
    static translate(key: any, args?: any, language?: any): any;
    static addDynamicTranslations(trans: any): void;
    static init(config: any): void;
    /**
     * @returns {Translator|null}
     */
    static getInstance(): Translator;
    static _isValid(translation: any): boolean;
    static _format(translation: any, args: any): any;
}
