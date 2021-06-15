import {Helper} from "../Legacy/Helper";
import {Translator} from "../Translator";

export class ToastManager {
    private _toastContainer: any;
    private _toastTemplate: any;
    private static _instance: ToastManager = null;
    private static _toastContainerSelector: any = "#toast-container";

    constructor() {
        this._toastContainer = document.querySelector(ToastManager._toastContainerSelector);
        this._toastTemplate = this._toastContainer.querySelector(".toast-template");
        this._toastTemplate.classList.remove("toast-template");
        this._toastTemplate.remove();
    }

    async showToast(toast) {
        let message = toast.getMessage();
        if (toast.isShouldTranslate()) {
            message = Translator.makePersistentTranslation(message, toast.getTranslationArgs());
        } else {
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
    }

    async hideToast(toast) {
        //TODO Animation hinzufügen
        let element = toast.getToastElement();
        if (Helper.isNotNull(element)) {
            element.style.opacity = 0;
            return new Promise<void>(res => {
                setTimeout(() => {
                    element.remove();
                    res();
                }, 250);
            });
        }
        return Promise.reject("toast is not showing");
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
