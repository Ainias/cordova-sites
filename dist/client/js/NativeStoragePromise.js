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
class NativeStoragePromise {
    /**
     * Setzt ein Item für NativeStorage
     *
     * @param key
     * @param value
     * @returns {Promise<*>}
     */
    static setItem(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => NativeStorage.setItem(key, value, res, rej));
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
                NativeStorage.getItem(key, res, (e => {
                    res(defaultValue);
                }));
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
            return new Promise((res, rej) => NativeStorage.keys(res, rej));
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
            return new Promise((res, rej) => NativeStorage.remove(key, res, rej));
        });
    }
    /**
     * Entfernt alle Objects aus dem NativeStorage
     *
     * @returns {Promise<*>}
     */
    static clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => NativeStorage.clear(res, rej));
        });
    }
}
exports.NativeStoragePromise = NativeStoragePromise;
//# sourceMappingURL=NativeStoragePromise.js.map