export declare class Dialog {
    protected _contentPromise: any;
    protected _resolver: any;
    protected _content: any;
    protected _backgroundElement: any;
    protected _cancelable: boolean;
    protected _title: any;
    protected _translatable: boolean;
    protected _additionalClasses: string;
    protected _buttons: any[];
    protected _result: any;
    protected _addedToDomePromise: any;
    protected _addedToDomePromiseResolver: any;
    constructor(content: any, title: any);
    setTitle(title: any): this;
    setTranslatable(translatable: any): void;
    setAdditionalClasses(classes: any): void;
    getTitle(): any;
    setCancelable(cancelable: any): this;
    setContent(content: any): Promise<this>;
    addButton(elementOrText: any, listenerOrResult: any, shouldClose?: any): void;
    show(): Promise<unknown>;
    createModalDialogElement(): any;
    waitForAddedToDom(): Promise<any>;
    close(): void;
}
