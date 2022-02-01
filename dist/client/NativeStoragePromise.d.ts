import { PromiseWithHandlers } from 'js-helper';
export declare class NativeStoragePromise {
    private static cache;
    static prefix: string;
    static persistent: boolean;
    static electronStorage: any;
    static readonly initializationPromise: PromiseWithHandlers<unknown>;
    private static isElectron;
    /**
     * Setzt ein Item für NativeStorage
     */
    static setItem(key: string, value: number | string | Record<string, any> | unknown[]): Promise<unknown>;
    /**
     * Bekomme ein Item von NativeStorage
     */
    static getItem<Type extends number | string | Record<string, unknown> | unknown[]>(key: string, defaultValue?: Type): Promise<any>;
    /**
     * Bekomme die Keys vom NativeStorage
     *
     */
    static getAllKeys(): Promise<string[]>;
    static removeItem(key: string): Promise<unknown>;
    /**
     * Entfernt ein Object aus dem NativeStorage
     *
     */
    static remove(key: string): Promise<unknown>;
    /**
     * Entfernt alle Objects aus dem NativeStorage
     */
    static clear(): Promise<void>;
    static makePersistent(): Promise<void>;
    static makeUnpersistent(): Promise<void>;
}
