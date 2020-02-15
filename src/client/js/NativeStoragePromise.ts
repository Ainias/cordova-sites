/**
 * Promise-Wrapper-Klasse für Native-Storage
 */
import {Helper} from "js-helper/dist/shared/Helper";

declare const NativeStorage;

export class NativeStoragePromise {

    static _cache: any = {};
    static prefix: string = "";
    static persistent: boolean = true;

    /**
     * Setzt ein Item für NativeStorage
     *
     * @param key
     * @param value
     * @returns {Promise<*>}
     */
    static async setItem(key, value) {
        if (this.persistent) {
            return new Promise((res, rej) => NativeStorage.setItem(this.prefix + key, value, res, rej));
        } else {
            this._cache[this.prefix + key] = value;
        }
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
            NativeStorage.getItem(this.prefix + key, res, (e => {
                res(Helper.nonNull(this._cache[this.prefix + key], defaultValue));
            }))
        });
    }

    /**
     * Bekomme die Keys vom NativeStorage
     *
     * @returns {Promise<*>}
     */
    static async keys() {
        let keys = [];
        if (this.persistent) {
            keys = await new Promise((res, rej) => NativeStorage.keys(res, rej));
        } else {
            keys = Object.keys(this._cache);
        }
        return keys.filter(key => key.startsWith(this.prefix));
    }

    /**
     * Entfernt ein Object aus dem NativeStorage
     *
     * @param key
     * @returns {Promise<*>}
     */
    static async remove(key) {
        delete this._cache[this.prefix + key];
        return new Promise((res, rej) => NativeStorage.remove(this.prefix + key, res, rej));
    }

    /**
     * Entfernt alle Objects aus dem NativeStorage
     *
     * @returns {Promise<*>}
     */
    static async clear() {
        let keys = await this.keys();
        await Helper.asyncForEach((keys), async key => {
            await this.remove(key);
        }, true);
    }

    static async makePersistent() {
        if (!this.persistent) {
            this.persistent = true;
            await Helper.asyncForEach(Object.keys(this._cache), async key => {
                await this.setItem(key, this._cache[key]);
            }, true);
        }
    }

    static async makeUnpersistent() {
        if (this.persistent) {
            let keys = await this.keys();
            let values = {};
            await Helper.asyncForEach(keys, async key => {
                values[key] = await this.getItem(key);
            });
            this.clear();
            this.persistent = false;
            this._cache = values;
        }
    }
}