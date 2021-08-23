import {AbstractFragment} from "../AbstractFragment";
import {Helper} from "../../Legacy/Helper";
import {AbstractSite} from "../AbstractSite";
import {SwipeFragment} from "./SwipeFragment";

export class SwipeChildFragment<ct extends AbstractSite> extends AbstractFragment<ct> {
    private _parent: SwipeFragment<ct>;

    constructor(site, view) {
        super(site, view);
        this._parent = null;
    }

    async onSwipeRight() {
        this.previousFragment();
    }

    async onSwipeLeft() {
        this.nextFragment();
    }

    setParent(parent: SwipeFragment<ct>) {
        this._parent = parent;
    }

    nextFragment() {
        if (Helper.isNotNull(this._parent)) {
            this._parent.nextFragment();
        }
    }

    previousFragment(){
        if (Helper.isNotNull(this._parent)) {
            this._parent.previousFragment();
        }
    }
}
