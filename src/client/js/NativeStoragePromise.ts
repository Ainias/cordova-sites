/**
 * Promise-Wrapper-Klasse für Native-Storage
 */
import {Helper} from "./Legacy/Helper";

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
     *
     * @param key
     * @param defaultValue?
     * @returns {Promise<*>}
     */
    static async getItem(key, defaultValue?) {
        return new Promise((res, rej) => {
            NativeStorage.getItem(key, res, (e => {
                res(defaultValue);
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