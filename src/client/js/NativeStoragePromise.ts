/**
 * Promise-Wrapper-Klasse für Native-Storage
 */
import {Helper} from "./Helper";

declare const NativeStorage;

export class NativeStoragePromise {

    /**
     * Setzt ein Item für NativeStorage
     *
     * @param key
     * @param value
     * @returns {Promise<*>}
     */
    static async setItem(key, value) {
        return new Promise((res, rej) => NativeStorage.setItem(key, value, res, rej));
    }

    /**
     * Bekomme ein Item von NativeStorage
     * sofern nothrow auf true oder weggelassen wird, wird null zurückgegeben, sollte der Index nicht existieren
     *
     * @param key
     * @param nothrow?
     * @returns {Promise<*>}
     */
    static async getItem(key, nothrow?) {
        nothrow = Helper.nonNull(nothrow, true);
        return new Promise((res, rej) => {
            NativeStorage.getItem(key, res, (e => {
                if (nothrow){
                    res(null);
                }
                else{
                    rej(e);
                }
            }))
        });
    }

    /**
     * Bekomme die Keys vom NativeStorage
     *
     * @returns {Promise<*>}
     */
    static async keys() {
        return new Promise((res, rej) => NativeStorage.keys(res, rej));
    }

    /**
     * Entfernt ein Object aus dem NativeStorage
     *
     * @param key
     * @returns {Promise<*>}
     */
    static async remove(key) {
        return new Promise((res, rej) => NativeStorage.remove(key, res, rej));
    }

    /**
     * Entfernt alle Objects aus dem NativeStorage
     *
     * @returns {Promise<*>}
     */
    static async clear() {
        return new Promise((res, rej) => NativeStorage.clear(res, rej));
    }
}