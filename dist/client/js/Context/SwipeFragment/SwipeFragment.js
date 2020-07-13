"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwipeFragment = void 0;
const AbstractFragment_1 = require("../AbstractFragment");
const SwipeChildFragment_1 = require("./SwipeChildFragment");
const Helper_1 = require("../../Legacy/Helper");
const view = require("../../../html/Framework/Fragment/swipeFragment.html");
class SwipeFragment extends AbstractFragment_1.AbstractFragment {
    constructor(site) {
        super(site, view);
        this._activeIndex = 0;
        this._touchStart = null;
    }
    onViewLoaded() {
        const _super = Object.create(null, {
            onViewLoaded: { get: () => super.onViewLoaded }
        });
        return __awaiter(this, void 0, void 0, function* () {
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
            return _super.onViewLoaded.call(this);
        });
    }
    _handleSwipe(endX, endY) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Helper_1.Helper.isNull(this._touchStart)) {
                return;
            }
            let touchStart = this._touchStart;
            this._touchStart = null;
            let diffX = touchStart.clientX - endX;
            if (Math.abs(touchStart.clientY - endY) <= SwipeFragment.MAX_Y
                && Math.abs(diffX) >= SwipeFragment.MIN_X) {
                if (diffX > 0) {
                    yield this._fragments[this._activeIndex].onSwipeLeft();
                }
                else {
                    yield this._fragments[this._activeIndex].onSwipeRight();
                }
            }
        });
    }
    onStart(pauseArguments) {
        const _super = Object.create(null, {
            onStart: { get: () => super.onStart }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this._activeIndex >= 0 && this._activeIndex < this._fragments.length) {
                this.setActiveFragment(this._activeIndex);
            }
            return _super.onStart.call(this, pauseArguments);
        });
    }
    setActiveFragment(index) {
        if (index instanceof SwipeChildFragment_1.SwipeChildFragment) {
            index = this._fragments.indexOf(index);
        }
        if (index >= 0 && index < this._fragments.length) {
            this._activeIndex = index;
            this._fragments.forEach((frag, i) => {
                frag.setActive(i === this._activeIndex);
            });
        }
    }
    nextFragment() {
        this.setActiveFragment((this._activeIndex + 1) % this._fragments.length);
    }
    previousFragment() {
        this.setActiveFragment((this._activeIndex + this._fragments.length - 1) % this._fragments.length);
    }
    addFragment(fragment) {
        if (fragment instanceof SwipeChildFragment_1.SwipeChildFragment) {
            fragment.setParent(this);
            return super.addFragment(".swipe-container", fragment);
        }
    }
}
exports.SwipeFragment = SwipeFragment;
SwipeFragment.MAX_Y = 80;
SwipeFragment.MIN_X = 150;
//# sourceMappingURL=SwipeFragment.js.map