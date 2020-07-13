import { AbstractFragment } from "../AbstractFragment";
export declare class AbstractWindowFragment extends AbstractFragment {
    _position: any;
    _container: any;
    _title: string;
    _titleElement: any;
    _window: any;
    _margin: any;
    _resizeElements: any;
    constructor(site: any, view: any, position: any, title?: string);
    setTitle(title: any): void;
    getDimension(): {
        x: number;
        y: number;
    };
    setDimension(x: any, y: any): void;
    onViewLoaded(): Promise<unknown[]>;
    resizeToContent(): void;
    _checkPositionAndDimension(): void;
    onStart(pauseArguments: any): Promise<void>;
    moveAt(x: any, y: any): void;
    moveTo(x: any, y: any): void;
}
