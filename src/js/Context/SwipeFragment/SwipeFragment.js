import {AbstractFragment} from "../AbstractFragment";
import {SwipeChildFragment} from "./SwipeChildFragment";
import {Helper} from "../../Helper";

import view from "../../../html/Framework/Fragment/swipeFragment.html";

export class SwipeFragment extends AbstractFragment {

    constructor(site) {
        super(site, view);
        this._activeIndex = 0;
        this._touchStart = null;
    }

    async onViewLoaded() {
        this._view.addEventListener("touchstart", e => {
            this._touchStart = e.touches[0];
        }, false);
        this._view.addEventListener("touchend", e => {
            this._handleSwipe(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            this._touchStart = null;
        });

        this._view.addEventListener("mousedown", e => {
            this._touchStart = e;
        }, false);
        this._view.addEventListener("mouseup", e => {
            this._handleSwipe(e.clientX, e.clientY);
            this._touchStart = null;
        });
        return super.onViewLoaded();
    }

    async _handleSwipe(endX, endY) {
        if (Helper.isNull(this._touchStart)) {
            return;
        }
        let touchStart = this._touchStart;
        this._touchStart = null;

        let diffX = touchStart.clientX - endX;
        if (Math.abs(touchStart.clientY - endY) <= SwipeFragment.MAX_Y
            && Math.abs(diffX) >= SwipeFragment.MIN_X) {
            if (diffX > 0) {
                await this._fragments[this._activeIndex].onSwipeLeft();
            } else {
                await this._fragments[this._activeIndex].onSwipeRight();
            }
        }
    }

    async onStart(pauseArguments) {
        if (this._activeIndex >= 0 && this._activeIndex < this._fragments.length){
            this.setActiveFragment(this._activeIndex);
        }
        return super.onStart(pauseArguments);
    }

    setActiveFragment(index) {
        if (index instanceof SwipeChildFragment) {
            index = this._fragments.indexOf(index);
        }

        if (index >= 0 && index < this._fragments.length) {
            this._activeIndex = index;
            this._fragments.forEach((frag, i) => {
                frag.setActive(i === this._activeIndex);
            });
        }
    }

    nextFragment(){
        this.setActiveFragment((this._activeIndex + 1) % this._fragments.length);
    }

    previousFragment(){
        this.setActiveFragment((this._activeIndex + this._fragments.length - 1) % this._fragments.length);
    }

    addFragment(fragment) {
        if (fragment instanceof SwipeChildFragment) {
            fragment.setParent(this);
            return super.addFragment(".swipe-container", fragment);
        }
    }
}

SwipeFragment.MAX_Y = 80;
SwipeFragment.MIN_X = 150;