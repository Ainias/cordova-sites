var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * Promise-Wrapper-Klasse für Native-Storage
 */
import { Helper } from 'js-helper/dist/shared/Helper';
import { JsonHelper } from 'js-helper/dist/shared/JsonHelper';
import { ArrayHelper, PromiseWithHandlers } from 'js-helper';
import { Sites } from './App/Sites';
var NativeStoragePromise = /** @class */ (function () {
    function NativeStoragePromise() {
    }
    NativeStoragePromise.isElectron = function () {
        return (typeof navigator === 'object' &&
            typeof navigator.userAgent === 'string' &&
            navigator.userAgent.indexOf('Electron') >= 0);
    };
    /**
     * Setzt ein Item für NativeStorage
     */
    NativeStoragePromise.setItem = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initializationPromise];
                    case 1:
                        _a.sent();
                        if (this.persistent) {
                            if (this.isElectron()) {
                                return [2 /*return*/, new Promise(function (res, rej) {
                                        return _this.electronStorage.set(_this.prefix + key, value, function (err) {
                                            if (err) {
                                                rej(err);
                                            }
                                            else {
                                                res();
                                            }
                                        });
                                    })];
                            }
                            return [2 /*return*/, new Promise(function (res, rej) { return NativeStorage.setItem(_this.prefix + key, value, res, rej); })];
                        }
                        this.cache[this.prefix + key] = value;
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    /**
     * Bekomme ein Item von NativeStorage
     */
    NativeStoragePromise.getItem = function (key, defaultValue) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initializationPromise];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, new Promise(function (res) {
                                if (_this.isElectron()) {
                                    _this.electronStorage.get(_this.prefix + key, function (e, data) {
                                        if (e) {
                                            res(Helper.nonNull(_this.cache[_this.prefix + key], defaultValue));
                                        }
                                        else {
                                            res(JsonHelper.deepEqual(data, {}) ? defaultValue : data);
                                        }
                                    });
                                }
                                else {
                                    NativeStorage.getItem(_this.prefix + key, function (data) { return res(Helper.nonNull(data, defaultValue)); }, function () {
                                        res(Helper.nonNull(_this.cache[_this.prefix + key], defaultValue));
                                    });
                                }
                            })];
                }
            });
        });
    };
    /**
     * Bekomme die Keys vom NativeStorage
     *
     */
    NativeStoragePromise.getAllKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keys;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initializationPromise];
                    case 1:
                        _a.sent();
                        if (!this.persistent) return [3 /*break*/, 6];
                        if (!this.isElectron()) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (res, rej) {
                                return _this.electronStorage.keys(function (err, electronKeys) {
                                    if (err) {
                                        rej(err);
                                    }
                                    else {
                                        res(electronKeys);
                                    }
                                });
                            })];
                    case 2:
                        keys = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, new Promise(function (res, rej) { return NativeStorage.keys(res, rej); })];
                    case 4:
                        keys = _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        keys = Object.keys(this.cache);
                        _a.label = 7;
                    case 7: return [2 /*return*/, keys.filter(function (key) { return key.startsWith(_this.prefix); })];
                }
            });
        });
    };
    NativeStoragePromise.removeItem = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.remove(key)];
            });
        });
    };
    /**
     * Entfernt ein Object aus dem NativeStorage
     *
     */
    NativeStoragePromise.remove = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initializationPromise];
                    case 1:
                        _a.sent();
                        delete this.cache[this.prefix + key];
                        if (this.isElectron()) {
                            return [2 /*return*/, new Promise(function (res, rej) {
                                    return _this.electronStorage.remove(_this.prefix + key, function (err) {
                                        if (err) {
                                            rej(err);
                                        }
                                        else {
                                            res();
                                        }
                                    });
                                })];
                        }
                        return [2 /*return*/, new Promise(function (res, rej) { return NativeStorage.remove(_this.prefix + key, res, rej); })];
                }
            });
        });
    };
    /**
     * Entfernt alle Objects aus dem NativeStorage
     */
    NativeStoragePromise.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keys;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initializationPromise];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getAllKeys()];
                    case 2:
                        keys = _a.sent();
                        return [4 /*yield*/, ArrayHelper.asyncForEach(keys, function (key) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.remove(key)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, true)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NativeStoragePromise.makePersistent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initializationPromise];
                    case 1:
                        _a.sent();
                        if (!!this.persistent) return [3 /*break*/, 3];
                        this.persistent = true;
                        return [4 /*yield*/, ArrayHelper.asyncForEach(Object.keys(this.cache), function (key) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.setItem(key, this.cache[key])];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, true)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NativeStoragePromise.makeUnpersistent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keys, values_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initializationPromise];
                    case 1:
                        _a.sent();
                        if (!this.persistent) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getAllKeys()];
                    case 2:
                        keys = _a.sent();
                        values_1 = {};
                        return [4 /*yield*/, ArrayHelper.asyncForEach(keys, function (key) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _a = values_1;
                                            _b = key;
                                            return [4 /*yield*/, this.getItem(key)];
                                        case 1:
                                            _a[_b] = _c.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.clear()];
                    case 4:
                        _a.sent();
                        this.persistent = false;
                        this.cache = values_1;
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    NativeStoragePromise.cache = {};
    NativeStoragePromise.prefix = '';
    NativeStoragePromise.persistent = true;
    NativeStoragePromise.electronStorage = null;
    NativeStoragePromise.initializationPromise = new PromiseWithHandlers();
    return NativeStoragePromise;
}());
export { NativeStoragePromise };
Sites.addInitialization(function () { return NativeStoragePromise.initializationPromise.resolve(); });
//# sourceMappingURL=NativeStoragePromise.js.map