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
exports.AlphabeticListFragment = void 0;
const AbstractFragment_1 = require("../AbstractFragment");
const Helper_1 = require("../../Legacy/Helper");
const defaultView = require("../../../html/Framework/Fragment/alphabeticListFragment.html");
class AlphabeticListFragment extends AbstractFragment_1.AbstractFragment {
    constructor(site, view) {
        super(site, Helper_1.Helper.nonNull(view, defaultView));
        this._elements = {};
        this._sideScrolling = false;
    }
    onViewLoaded() {
        const _super = Object.create(null, {
            onViewLoaded: { get: () => super.onViewLoaded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onViewLoaded.call(this);
            //TODO font-size changing
            let sideAlphabet = this.findBy(".alphabetic-list-sidealphabet");
            sideAlphabet.addEventListener("mousedown", () => {
                this._sideScrolling = true;
            });
            window.addEventListener("touchstart", (e) => {
                this._sideScrolling = true;
            });
            window.addEventListener("mouseup", () => {
                this._sideScrolling = false;
            });
            window.addEventListener("touchend", () => {
                this._sideScrolling = false;
            });
            this.findBy(".alphabet-scroll-to", true).forEach(elem => {
                let listener = (e) => {
                    if (this._sideScrolling) {
                        this.findBy(".alphabet-section." + elem.dataset.letter).scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }
                };
                elem.addEventListener("mousedown", (e) => {
                    this._sideScrolling = true;
                    listener(e);
                });
                elem.addEventListener("mousemove", listener);
                elem.addEventListener("touchstart", (e) => {
                    this._sideScrolling = true;
                    listener(e);
                });
                elem.addEventListener("touchmove", listener);
            });
            this.renderList();
            return res;
        });
    }
    setElements(elements) {
        this._elements = {};
        Object.keys(elements).sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        }).forEach(key => {
            this._elements[key] = elements[key];
        });
    }
    renderElement(element) {
        console.warn("should be overloaded?");
        let elem = document.createElement("div");
        elem.innerText = element;
        return elem;
    }
    renderList() {
        this.findBy(".alphabet-section", true).forEach(section => {
            Helper_1.Helper.removeAllChildren(section);
        });
        let currentLetter = 'A';
        let currentSegment = this.findBy(".alphabet-section.A");
        Object.keys(this._elements).forEach(key => {
            let newLetter = key.trim().substring(0, 1).toUpperCase();
            if (newLetter !== currentLetter) {
                currentLetter = newLetter;
                let newSegment = this.findBy(".alphabet-section." + newLetter);
                if (newSegment !== null) {
                    currentSegment = newSegment;
                }
            }
            let element = this.renderElement(this._elements[key]);
            currentSegment.appendChild(element);
        });
    }
}
exports.AlphabeticListFragment = AlphabeticListFragment;
//# sourceMappingURL=AlphabeticListFragment.js.map