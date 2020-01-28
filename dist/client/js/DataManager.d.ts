/**
 * Ein Manager, welches das Laden von Resourcen übernimmt.
 */
export declare class DataManager {
    static _additionalHeaders: any;
    static _basePath: string;
    static onlineCallback: any;
    /**
     * Diese Funktion sollte anstelle von dem nativen "fetch" verwendet werden!
     * Das native Fetch kann keine file://, welches von Cordova unter Android (und whs iOS) verwendet wird
     * Daher wird heir auf XMLHttpRequest zurückgegriffen
     *
     * @param url
     * @param options
     * @returns {Promise<*>}
     */
    static fetch(url: any, options: any): Promise<unknown>;
    /**
     * Vereinfachung von Laden von Resourcen.
     * Lädt per GET die angegebene URL und gibt diese als JSON oder Text zurück
     *
     * @param url
     * @param asJson
     * @param useBasePath
     * @returns {Promise<*  | void>}
     */
    static load(url: any, asJson?: any, useBasePath?: any): Promise<any>;
    /**
     * Vereinfachung von Laden von Resourcen.
     * Lädt per GET das angegebene Asset und gibt diese als JSON oder Text zurück
     *
     * @param url
     * @returns {Promise<*  | void>}
     */
    static loadAsset(url: any): Promise<any>;
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
    static basePath(url: any): string;
    static setHeader(header: any, value: any): void;
}
