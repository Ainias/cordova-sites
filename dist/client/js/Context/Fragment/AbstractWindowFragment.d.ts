import { AbstractFragment } from "../AbstractFragment";
export declare class AbstractWindowFragment extends AbstractFragment {
    private _position;
    protected _container: any;
    private _title;
    private _titleElement;
    private _window;
    private _margin;
    private _resizeElements;
    private id;
    private saveData;
    private state;
    private popupWindow;
    protected translateTitle: boolean;
    constructor(site: any, view: any, position: {
        x: number;
        y: number;
        width?: number;
        height?: number;
    }, title?: string, id?: string);
    setTitle(title: any): void;
    getDimension(): {
        x: number;
        y: number;
    };
    setDimension(x: any, y: any): void;
    onViewLoaded(): Promise<unknown[]>;
    private addListeners;
    private load;
    private save;
    toggleMinimize(): void;
    toggleMaximize(): void;
    resizeToContent(): void;
    _checkPositionAndDimension(): void;
    onStart(pauseArguments: any): Promise<void>;
    moveAt(x: any, y: any): void;
    moveTo(x: any, y: any): void;
    onButtonClick(id: string, button: HTMLElement, e: MouseEvent): void;
    openInNewWindow(): void;
    private getPosition;
}
