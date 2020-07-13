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
exports.SwipeChildFragment = void 0;
const AbstractFragment_1 = require("../AbstractFragment");
const Helper_1 = require("../../Legacy/Helper");
class SwipeChildFragment extends AbstractFragment_1.AbstractFragment {
    constructor(site, view) {
        super(site, view);
        this._parent = null;
    }
    onSwipeRight() {
        return __awaiter(this, void 0, void 0, function* () {
            this.previousFragment();
        });
    }
    onSwipeLeft() {
        return __awaiter(this, void 0, void 0, function* () {
            this.nextFragment();
        });
    }
    setParent(parent) {
        this._parent = parent;
    }
    nextFragment() {
        if (Helper_1.Helper.isNotNull(this._parent)) {
            this._parent.nextFragment();
        }
    }
    previousFragment() {
        if (Helper_1.Helper.isNotNull(this._parent)) {
            this._parent.previousFragment();
        }
    }
}
exports.SwipeChildFragment = SwipeChildFragment;
//# sourceMappingURL=SwipeChildFragment.js.map