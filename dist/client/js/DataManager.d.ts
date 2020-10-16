/**
 * Ein Manager, welches das Laden von Resourcen übernimmt.
 */
export declare class DataManager {
    static _additionalHeaders: any;
    static _basePath: string;
    static _assetBasePath: string;
    static onlineCallback: any;
    /**
     * Diese Funktion sollte anstelle von dem nativen "fetch" verwendet werden!
     * Das native Fetch kann keine file://, welches von Cordova unter Android (und whs iOS) verwendet wird
     * Daher wird heir auf XMLHttpRequest zurückgegriffen
     *
     * @param url
     * @param useArrayBuffer
     * @returns {Promise<*>}
     */
    static fetch(url: any, useArrayBuffer?: any): Promise<unknown>;
    static fetchBlob(url: any): Promise<unknown>;
    /**
     * Vereinfachung von Laden von Resourcen.
     * Lädt per GET die angegebene URL und gibt diese als JSON oder Text zurück
     *
     * @param url
     * @param format
     * @param useBasePath
     * @returns {Promise<*  | void>}
     */
    static load(url: any, format?: any, useBasePath?: any): Promise<any>;
    /**
     * Vereinfachung von Laden von Resourcen.
     * Lädt per GET das angegebene Asset und gibt diese als JSON oder Text zurück
     *
     * @param url
     * @param format
     * @returns {Promise<*  | void>}
     */
    static loadAsset(url: any, format?: any): Promise<any>;
    /**
     * Wandelt ein Key-Value-Objekt in einen QueryString um
     *
     * @param values
     * @return {string}
     */
    static buildQuery(values: any): string;
    /**
     * Wandelt ein Key-Value-Objekt in einen QueryString um
     *
     * @param values
     * @return {string}
     */
    static buildQueryWithoutNullValues(values: any): string;
    static send(url: any, params: any): Promise<any>;
    static basePath(url: any, basePath?: any): any;
    static setHeader(header: any, value: any): void;
}
