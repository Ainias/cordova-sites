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
exports.NativeStoragePromise = void 0;
/**
 * Promise-Wrapper-Klasse für Native-Storage
 */
const Helper_1 = require("js-helper/dist/shared/Helper");
const JsonHelper_1 = require("js-helper/dist/shared/JsonHelper");
const js_helper_1 = require("js-helper");
const Sites_1 = require("./App/Sites");
class NativeStoragePromise {
    static isElectron() {
        return (typeof navigator === 'object' &&
            navigator.userAgent.indexOf('Electron') >= 0);
    }
    /**
     * Setzt ein Item für NativeStorage
     */
    static setItem(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initializationPromise;
            if (this.persistent) {
                if (this.isElectron()) {
                    return new Promise((res, rej) => this.electronStorage.set(this.prefix + key, value, (err) => {
                        if (err) {
                            rej(err);
                        }
                        else {
                            res();
                        }
                    }));
                }
                return new Promise((res, rej) => NativeStorage.setItem(this.prefix + key, value, res, rej));
            }
            this.cache[this.prefix + key] = value;
            return Promise.resolve();
        });
    }
    /**
     * Bekomme ein Item von NativeStorage
     */
    static getItem(key, defaultValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initializationPromise;
            return new Promise((res) => {
                if (this.isElectron()) {
                    this.electronStorage.get(this.prefix + key, (e, data) => {
                        if (e) {
                            res(Helper_1.Helper.nonNull(this.cache[this.prefix + key], defaultValue));
                        }
                        else {
                            res(JsonHelper_1.JsonHelper.deepEqual(data, {}) ? defaultValue : data);
                        }
                    });
                }
                else {
                    NativeStorage.getItem(this.prefix + key, (data) => res(Helper_1.Helper.nonNull(data, defaultValue)), () => {
                        res(Helper_1.Helper.nonNull(this.cache[this.prefix + key], defaultValue));
                    });
                }
            });
        });
    }
    /**
     * Bekomme die Keys vom NativeStorage
     *
     */
    static getAllKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initializationPromise;
            let keys;
            if (this.persistent) {
                if (this.isElectron()) {
                    keys = yield new Promise((res, rej) => this.electronStorage.keys((err, electronKeys) => {
                        if (err) {
                            rej(err);
                        }
                        else {
                            res(electronKeys);
                        }
                    }));
                }
                else {
                    keys = yield new Promise((res, rej) => NativeStorage.keys(res, rej));
                }
            }
            else {
                keys = Object.keys(this.cache);
            }
            return keys.filter((key) => key.startsWith(this.prefix));
        });
    }
    static removeItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.remove(key);
        });
    }
    /**
     * Entfernt ein Object aus dem NativeStorage
     *
     */
    static remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initializationPromise;
            delete this.cache[this.prefix + key];
            if (this.isElectron()) {
                return new Promise((res, rej) => this.electronStorage.remove(this.prefix + key, (err) => {
                    if (err) {
                        rej(err);
                    }
                    else {
                        res();
                    }
                }));
            }
            return new Promise((res, rej) => NativeStorage.remove(this.prefix + key, res, rej));
        });
    }
    /**
     * Entfernt alle Objects aus dem NativeStorage
     */
    static clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initializationPromise;
            const keys = yield this.getAllKeys();
            yield js_helper_1.ArrayHelper.asyncForEach(keys, (key) => __awaiter(this, void 0, void 0, function* () {
                yield this.remove(key);
            }), true);
        });
    }
    static makePersistent() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initializationPromise;
            if (!this.persistent) {
                this.persistent = true;
                yield js_helper_1.ArrayHelper.asyncForEach(Object.keys(this.cache), (key) => __awaiter(this, void 0, void 0, function* () {
                    yield this.setItem(key, this.cache[key]);
                }), true);
            }
        });
    }
    static makeUnpersistent() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initializationPromise;
            if (this.persistent) {
                const keys = yield this.getAllKeys();
                const values = {};
                yield js_helper_1.ArrayHelper.asyncForEach(keys, (key) => __awaiter(this, void 0, void 0, function* () {
                    values[key] = yield this.getItem(key);
                }));
                yield this.clear();
                this.persistent = false;
                this.cache = values;
            }
        });
    }
}
exports.NativeStoragePromise = NativeStoragePromise;
NativeStoragePromise.cache = {};
NativeStoragePromise.prefix = '';
NativeStoragePromise.persistent = true;
NativeStoragePromise.electronStorage = null;
NativeStoragePromise.initializationPromise = new js_helper_1.PromiseWithHandlers();
Sites_1.Sites.addInitialization(() => NativeStoragePromise.initializationPromise.resolve());
//# sourceMappingURL=NativeStoragePromise.js.map