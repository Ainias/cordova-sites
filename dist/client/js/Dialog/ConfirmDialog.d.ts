import { Dialog } from "./Dialog";
export declare class ConfirmDialog extends Dialog {
    private readonly confirmButtonText;
    private readonly cancelButtonText;
    constructor(content: any, title: any, confirmButtonText?: any, cancelButtonText?: any);
    show(): Promise<unknown>;
    close(): void;
}
