import { AbstractFragment } from "../AbstractFragment";
export declare class SwipeChildFragment extends AbstractFragment {
    private _parent;
    constructor(site: any, view: any);
    onSwipeRight(): Promise<void>;
    onSwipeLeft(): Promise<void>;
    setParent(parent: any): void;
    nextFragment(): void;
    previousFragment(): void;
}
