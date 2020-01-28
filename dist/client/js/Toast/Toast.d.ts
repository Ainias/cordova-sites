export declare class Toast {
    private _message;
    private _duration;
    private _shouldTranslate;
    private _translationArgs;
    private _id;
    private _toastElement;
    private static LAST_ID;
    private static DEFAULT_DURATION;
    constructor(message: any, duration?: any, shouldTranslateOrTranslationArgs?: any);
    getId(): number;
    getMessage(): any;
    getDuration(): any;
    isShouldTranslate(): boolean;
    getTranslationArgs(): any;
    setToastElement(element: any): void;
    getToastElement(): null;
    show(): Promise<unknown>;
    hide(): Promise<unknown>;
}
