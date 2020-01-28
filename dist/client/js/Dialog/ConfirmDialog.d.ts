import { Dialog } from "./Dialog";
export declare class ConfirmDialog extends Dialog {
    constructor(content: any, title: any);
    show(): Promise<unknown>;
    close(): void;
}
