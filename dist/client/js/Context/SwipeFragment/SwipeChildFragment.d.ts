import { AbstractFragment } from "../AbstractFragment";
import { AbstractSite } from "../AbstractSite";
import { SwipeFragment } from "./SwipeFragment";
export declare class SwipeChildFragment<ct extends AbstractSite> extends AbstractFragment<ct> {
    private _parent;
    constructor(site: any, view: any);
    onSwipeRight(): Promise<void>;
    onSwipeLeft(): Promise<void>;
    setParent(parent: SwipeFragment<ct>): void;
    nextFragment(): void;
    previousFragment(): void;
}
