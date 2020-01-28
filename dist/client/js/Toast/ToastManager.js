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
const Helper_1 = require("../Legacy/Helper");
const Translator_1 = require("../Translator");
class ToastManager {
    constructor() {
        this._toastContainer = document.querySelector(ToastManager._toastContainerSelector);
        this._toastTemplate = this._toastContainer.querySelector(".toast-template");
        this._toastTemplate.classList.remove("toast-template");
        this._toastTemplate.remove();
    }
    showToast(toast) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = toast.getMessage();
            if (toast.isShouldTranslate()) {
                message = Translator_1.Translator.makePersistentTranslation(message, toast.getTranslationArgs());
            }
            else {
                message = document.createTextNode(message);
            }
            let toastElement = this._toastTemplate.cloneNode(true);
            toastElement.querySelector(".message").appendChild(message);
            toast.setToastElement(toastElement);
            this._toastContainer.appendChild(toastElement);
            toastElement.style.opacity = 1;
            return new Promise(resolve => {
                toastElement.querySelector(".message").onclick = () => {
                    this.hideToast(toast);
                    resolve(true);
                };
                setTimeout(() => {
                    this.hideToast(toast);
                    resolve(false);
                }, toast.getDuration());
            });
        });
    }
    hideToast(toast) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO Animation hinzufügen
            let element = toast.getToastElement();
            if (Helper_1.Helper.isNotNull(element)) {
                element.style.opacity = 0;
                return new Promise(res => {
                    setTimeout(() => {
                        element.remove();
                        res();
                    }, 250);
                });
            }
            return Promise.reject("toast is not showing");
        });
    }
    static setToastContainerSelector(selector) {
        ToastManager._toastContainerSelector = selector;
    }
    static getInstance() {
        if (!ToastManager._instance) {
            ToastManager._instance = new ToastManager();
        }
        return ToastManager._instance;
    }
}
exports.ToastManager = ToastManager;
ToastManager._instance = null;
ToastManager._toastContainerSelector = "#toast-container";
//# sourceMappingURL=ToastManager.js.map