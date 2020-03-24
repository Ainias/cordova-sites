"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Promise-Wrapper-Klasse für Native-Storage
 */
const Helper_1 = require("js-helper/dist/shared/Helper");
const JsonHelper_1 = require("js-helper/dist/shared/JsonHelper");
class NativeStoragePromise {
    static _isElectron() {
        return (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0);
    }
    /**
     * Setzt ein Item für NativeStorage
     *
     * @param key
     * @param value
     * @returns {Promise<*>}
     */
    static setItem(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.persistent) {
                if (this._isElectron()) {
                    return new Promise((res, rej) => this.electronStorage.set(this.prefix + key, value, err => {
                        if (err) {
                            rej(err);
                        }
                        else {
                            res();
                        }
                    }));
                }
                else {
                    return new Promise((res, rej) => NativeStorage.setItem(this.prefix + key, value, res, rej));
                }
            }
            else {
                this._cache[this.prefix + key] = value;
            }
        });
    }
    /**
     * Bekomme ein Item von NativeStorage
     *
     * @param key
     * @param defaultValue?
     * @returns {Promise<*>}
     */
    static getItem(key, defaultValue) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                if (this._isElectron()) {
                    this.electronStorage.get(this.prefix + key, (e, data) => {
                        if (e) {
                            res(Helper_1.Helper.nonNull(this._cache[this.prefix + key], defaultValue));
                        }
                        else {
                            res(JsonHelper_1.JsonHelper.deepEqual(data, {}) ? defaultValue : data);
                        }
                    });
                }
                else {
                    NativeStorage.getItem(this.prefix + key, data => res(Helper_1.Helper.nonNull(data, defaultValue)), (e => {
                        res(Helper_1.Helper.nonNull(this._cache[this.prefix + key], defaultValue));
                    }));
                }
            });
        });
    }
    /**
     * Bekomme die Keys vom NativeStorage
     *
     * @returns {Promise<*>}
     */
    static keys() {
        return __awaiter(this, void 0, void 0, function* () {
            let keys = [];
            if (this.persistent) {
                if (this._isElectron()) {
                    keys = yield new Promise((res, rej) => this.electronStorage.keys((err, keys) => {
                        if (err) {
                            rej(err);
                        }
                        else {
                            res(keys);
                        }
                    }));
                }
                else {
                    keys = yield new Promise((res, rej) => NativeStorage.keys(res, rej));
                }
            }
            else {
                keys = Object.keys(this._cache);
            }
            return keys.filter(key => key.startsWith(this.prefix));
        });
    }
    /**
     * Entfernt ein Object aus dem NativeStorage
     *
     * @param key
     * @returns {Promise<*>}
     */
    static remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            delete this._cache[this.prefix + key];
            if (this._isElectron()) {
                return new Promise((res, rej) => this.electronStorage.remove(this.prefix + key, err => {
                    if (err) {
                        rej(err);
                    }
                    else {
                        res();
                    }
                }));
            }
            else {
                return new Promise((res, rej) => NativeStorage.remove(this.prefix + key, res, rej));
            }
        });
    }
    /**
     * Entfernt alle Objects aus dem NativeStorage
     *
     * @returns {Promise<*>}
     */
    static clear() {
        return __awaiter(this, void 0, void 0, function* () {
            let keys = yield this.keys();
            yield Helper_1.Helper.asyncForEach((keys), (key) => __awaiter(this, void 0, void 0, function* () {
                yield this.remove(key);
            }), true);
        });
    }
    static makePersistent() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.persistent) {
                this.persistent = true;
                yield Helper_1.Helper.asyncForEach(Object.keys(this._cache), (key) => __awaiter(this, void 0, void 0, function* () {
                    yield this.setItem(key, this._cache[key]);
                }), true);
            }
        });
    }
    static makeUnpersistent() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.persistent) {
                let keys = yield this.keys();
                let values = {};
                yield Helper_1.Helper.asyncForEach(keys, (key) => __awaiter(this, void 0, void 0, function* () {
                    values[key] = yield this.getItem(key);
                }));
                this.clear();
                this.persistent = false;
                this._cache = values;
            }
        });
    }
}
exports.NativeStoragePromise = NativeStoragePromise;
NativeStoragePromise._cache = {};
NativeStoragePromise.prefix = "";
NativeStoragePromise.persistent = true;
NativeStoragePromise.electronStorage = null;
//# sourceMappingURL=NativeStoragePromise.js.map