export declare class Toast {
    private _message;
    private _duration;
    private _shouldTranslate;
    private _translationArgs;
    private _id;
    private _toastElement;
    private static LAST_ID;
    static DEFAULT_DURATION: number;
    constructor(message: any, duration?: any, shouldTranslateOrTranslationArgs?: any);
    getId(): number;
    getMessage(): any;
    getDuration(): any;
    isShouldTranslate(): boolean;
    getTranslationArgs(): any;
    setToastElement(element: any): void;
    getToastElement(): null;
    show(): Promise<unknown>;
    hide(): Promise<void>;
}
