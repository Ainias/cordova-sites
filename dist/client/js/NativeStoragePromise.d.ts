export declare class NativeStoragePromise {
    static _cache: any;
    static prefix: string;
    static persistent: boolean;
    static electronStorage: any;
    static _isElectron(): boolean;
    /**
     * Setzt ein Item für NativeStorage
     *
     * @param key
     * @param value
     * @returns {Promise<*>}
     */
    static setItem(key: any, value: any): Promise<unknown>;
    /**
     * Bekomme ein Item von NativeStorage
     *
     * @param key
     * @param defaultValue?
     * @returns {Promise<*>}
     */
    static getItem(key: any, defaultValue?: any): Promise<any>;
    /**
     * Bekomme die Keys vom NativeStorage
     *
     * @returns {Promise<*>}
     */
    static keys(): Promise<any[]>;
    /**
     * Entfernt ein Object aus dem NativeStorage
     *
     * @param key
     * @returns {Promise<*>}
     */
    static remove(key: any): Promise<unknown>;
    /**
     * Entfernt alle Objects aus dem NativeStorage
     *
     * @returns {Promise<*>}
     */
    static clear(): Promise<void>;
    static makePersistent(): Promise<void>;
    static makeUnpersistent(): Promise<void>;
}
