import { AbstractFragment } from "../AbstractFragment";
export declare class SwipeFragment extends AbstractFragment {
    private _activeIndex;
    private _touchStart;
    static MAX_Y: number;
    static MIN_X: number;
    constructor(site: any);
    onViewLoaded(): Promise<any[]>;
    _handleSwipe(endX: any, endY: any): Promise<void>;
    onStart(pauseArguments: any): Promise<void>;
    setActiveFragment(index: any): void;
    nextFragment(): void;
    previousFragment(): void;
    addFragment(fragment: any): void;
}
