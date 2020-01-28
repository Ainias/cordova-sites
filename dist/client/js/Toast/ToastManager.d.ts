export declare class ToastManager {
    private _toastContainer;
    private _toastTemplate;
    private static _instance;
    private static _toastContainerSelector;
    constructor();
    showToast(toast: any): Promise<unknown>;
    hideToast(toast: any): Promise<unknown>;
    static setToastContainerSelector(selector: any): void;
    static getInstance(): ToastManager;
}
