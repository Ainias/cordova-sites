import {AbstractFragment} from "../AbstractFragment";
import {Helper} from "../../Helper";

export class SwipeChildFragment extends AbstractFragment {
    private _parent: any;

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

    setParent(parent) {
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