import {Helper} from "../Legacy/Helper";
import {ToastManager} from "./ToastManager";

export class Toast{

    private _message: any;
    private _duration: any;
    private _shouldTranslate: boolean;
    private _translationArgs: any;
    private _id: number;
    private _toastElement: null;
    private static LAST_ID: number = 0;
    private static DEFAULT_DURATION: number = 2500;

    constructor(message, duration?, shouldTranslateOrTranslationArgs?){
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