import {Helper} from "../Helper";
import {ToastManager} from "./ToastManager";

export class Toast{
    constructor(message, duration, shouldTranslateOrTranslationArgs){
        this._message = message;
        this._duration = Helper.nonNull(duration, Toast.DEFAULT_DURATION);
        this._shouldTranslate = shouldTranslateOrTranslationArgs !== false;
        this._translationArgs = Helper.nonNull(shouldTranslateOrTranslationArgs, [])
        this._id  = Toast.LAST_ID++;
        this._toastElement = null;
    }

    getId(){
        return this._id;
    }

    getMessage() {
        return this._message;
    }

    getDuration(){
        return this._duration;
    }

    isShouldTranslate(){
        return this._shouldTranslate;
    }

    getTranslationArgs(){
        return this._translationArgs;
    }

    setToastElement(element){
        this._toastElement = element;
    }

    getToastElement(){
        return this._toastElement;
    }

    async show(){
        return ToastManager.getInstance().showToast(this);
    }

    async hide(){
        return ToastManager.getInstance().hideToast(this);
    }
}
Toast.LAST_ID = 0;

Toast.DEFAULT_DURATION = 2500;