export declare class Form {
    private formElem;
    private _method;
    private _elementChangeListener;
    private _validators;
    private _isBusy;
    private _submitHandler;
    private _editors;
    private _submitCallback;
    private errorCallback;
    private imageSelectionElementReady;
    private imageSelectionElements;
    constructor(formElem: any, urlOrCallback: any, method?: any, imageSelectionSelector?: string);
    private prepareForImageSelection;
    setImagesForImageSelectionElement(name: string, images: {
        [category: string]: {
            name?: string;
            src: string;
        }[];
    }): Promise<void>;
    addValidator(validatorCallback: any): void;
    onError(errorHandler: any): void;
    addEditor(e: any): void;
    doSubmit(e?: any): Promise<boolean>;
    setValues(valuePromise: any): Promise<this>;
    reset(): void;
    getValues(filesToBase64?: any): Promise<unknown>;
    static filesToBase64(values: any): Promise<any>;
    setElementChangeListener(listener: any): void;
    clearErrors(): void;
    setErrors(errors: any): void;
    setIsBusy(isBusy: any): void;
    submit(): Promise<boolean>;
    validate(): Promise<boolean>;
    onSubmit(callback: any): void;
    getFormElement(): any;
}
