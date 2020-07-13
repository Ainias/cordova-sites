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
exports.PromiseHelper = void 0;
const Helper_1 = require("./Legacy/Helper");
class PromiseHelper {
    static delay(milliseconds) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(r => {
                setTimeout(r, milliseconds);
            });
        });
    }
    static tryMultipleTimes(func, times, delay) {
        return __awaiter(this, void 0, void 0, function* () {
            times = Helper_1.Helper.nonNull(times, 5);
            delay = Helper_1.Helper.nonNull(delay, 50);
            for (let i = 0; i < times; i++) {
                let res = yield func();
                if (res !== undefined) {
                    return res;
                }
                else {
                    yield PromiseHelper.delay(delay);
                }
            }
            return undefined;
        });
    }
    static tryUntilTimeout(func, timeout, delay) {
        return __awaiter(this, void 0, void 0, function* () {
            timeout = Helper_1.Helper.nonNull(timeout, 500);
            delay = Helper_1.Helper.nonNull(delay, 50);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let shouldRun = true;
                PromiseHelper.delay(timeout).then(() => {
                    reject(new Error("timeout"));
                    shouldRun = false;
                });
                while (shouldRun) {
                    let res = yield func();
                    if (res !== undefined) {
                        resolve(res);
                        break;
                    }
                    yield PromiseHelper.delay(delay);
                }
            }));
        });
    }
}
exports.PromiseHelper = PromiseHelper;
//# sourceMappingURL=PromiseHelper.js.map