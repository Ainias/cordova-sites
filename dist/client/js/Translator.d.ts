import { Translator as SharedTranslator } from "../../shared/Translator";
/**
 * Singleton-Klasse zum Übersetzen von Text-Inhalten
 */
export declare class Translator extends SharedTranslator {
    private _currentLanguage;
    private _nativeStorageKey;
    private _translationClass;
    private _initPromise;
    static logMissingTranslations: boolean;
    /**
     * Erstellt einen neuen Translator
     * @param config
     */
    constructor(config: any);
    /**
     * Setzt die neue Sprache, updated alle Übersetzungen. Speichert danach die aktuelle Sprache in NativeStorage
     * @param language
     */
    setLanguage(language: any): Promise<void>;
    /**
     * Übersetzt sofort einen Key in die aktuelle Sprache
     * @param key
     * @param args
     * @returns {*}
     */
    translate(key: any, args?: any, language?: any): any;
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
    addTranslationCallback(callback: any, callImmediately: any): number;
    /**
     * Entfernt die Callback anhand der gegebenen ID
     *
     * @param callbackId
     */
    removeTranslationCallback(callbackId: any): void;
    /**
     * Updated die aktuellen übersetzungen
     */
    updateTranslations(baseElement?: any): Promise<void>;
    /**
     * Lädt die im NativeStorage gespeicherte Sprache oder - falls diese nicht vorhanden ist - die vom User untersütze Sprache im Browser
     * @returns {Promise<*>}
     */
    loadUserLanguage(): Promise<unknown>;
    /**
     * Erstellt eine neue Übersetzung, welche auch übersetzt wird, wenn die Sprache geändert wird
     * @param key
     * @param args
     * @param tag
     * @param useText
     * @returns {any}
     */
    makePersistentTranslation(key: any, args?: any, tag?: any, useText?: any): any;
    getTranslationClass(): string;
    getCurrentLanguage(): string;
    static getInstance(): Translator;
    static setLanguage(language: any): Promise<void>;
    static makePersistentTranslation(key: any, args?: any, tag?: any, useText?: any): any;
    static addTranslationCallback(callback: any, callImmediately?: any): number;
    static removeTranslationCallback(callbackId: any): void;
    static updateTranslations(baseElement: any): Promise<void>;
    static init(config: any): void;
}
