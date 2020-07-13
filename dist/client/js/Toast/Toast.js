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
exports.Toast = void 0;
const Helper_1 = require("../Legacy/Helper");
const ToastManager_1 = require("./ToastManager");
class Toast {
    constructor(message, duration, shouldTranslateOrTranslationArgs) {
        this._message = message;
        this._duration = Helper_1.Helper.nonNull(duration, Toast.DEFAULT_DURATION);
        this._shouldTranslate = shouldTranslateOrTranslationArgs !== false;
        this._translationArgs = Helper_1.Helper.nonNull(shouldTranslateOrTranslationArgs, []);
        this._id = Toast.LAST_ID++;
        this._toastElement = null;
    }
    getId() {
        return this._id;
    }
    getMessage() {
        return this._message;
    }
    getDuration() {
        return this._duration;
    }
    isShouldTranslate() {
        return this._shouldTranslate;
    }
    getTranslationArgs() {
        return this._translationArgs;
    }
    setToastElement(element) {
        this._toastElement = element;
    }
    getToastElement() {
        return this._toastElement;
    }
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            return ToastManager_1.ToastManager.getInstance().showToast(this);
        });
    }
    hide() {
        return __awaiter(this, void 0, void 0, function* () {
            return ToastManager_1.ToastManager.getInstance().hideToast(this);
        });
    }
}
exports.Toast = Toast;
Toast.LAST_ID = 0;
Toast.DEFAULT_DURATION = 2500;
//# sourceMappingURL=Toast.js.map