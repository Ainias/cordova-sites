import { MenuAction } from "./MenuAction";
export declare class ErrorAction extends MenuAction {
    static ERROR_ICON: any;
    private static _instance;
    private static _errors;
    static addError(errorMessage: any): void;
    static removeError(errorMessage: any): void;
    /**
     * @return ErrorAction;
     */
    static getInstance(): any;
    constructor();
}
