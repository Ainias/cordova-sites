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
const client_1 = require("js-helper/dist/client");
const shared_1 = require("js-helper/dist/shared");
const defaultView = require("../../../html/Framework/Fragment/alphabeticListFragment.html");
class AlphabeticListFragment extends AbstractFragment_1.AbstractFragment {
    constructor(site, view) {
        super(site, shared_1.Helper.nonNull(view, defaultView));
        this.elements = {};
        this.sideScrolling = false;
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
                this.sideScrolling = true;
            });
            window.addEventListener("touchstart", (e) => {
                this.sideScrolling = true;
            });
            window.addEventListener("mouseup", () => {
                this.sideScrolling = false;
            });
            window.addEventListener("touchend", () => {
                this.sideScrolling = false;
            });
            this.findBy(".alphabet-scroll-to", true).forEach(elem => {
                let listener = (e) => {
                    if (this.sideScrolling) {
                        this.findBy(".alphabet-section." + elem.dataset.letter).scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }
                };
                elem.addEventListener("mousedown", (e) => {
                    this.sideScrolling = true;
                    listener(e);
                });
                elem.addEventListener("mousemove", listener);
                elem.addEventListener("touchstart", (e) => {
                    this.sideScrolling = true;
                    listener(e);
                });
                elem.addEventListener("touchmove", listener);
            });
            this.headingElement = this.findBy("#alphabetic-list-heading");
            this.renderList();
            return res;
        });
    }
    setElements(elements) {
        this.elements = {};
        Object.keys(elements).sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        }).forEach(key => {
            this.elements[key] = elements[key];
        });
    }
    setHeading(headingElement) {
        this.heading = headingElement;
        if (this.headingElement && this.heading) {
            client_1.ViewHelper.removeAllChildren(this.headingElement);
            this.headingElement.appendChild(this.heading);
        }
    }
    renderElement(element) {
        console.warn("should be overloaded?");
        let elem = document.createElement("div");
        elem.innerText = element;
        return elem;
    }
    renderList() {
        client_1.ViewHelper.removeAllChildren(this.headingElement);
        if (this.heading) {
            this.headingElement.appendChild(this.heading);
        }
        this.findBy(".alphabet-section", true).forEach(section => {
            client_1.ViewHelper.removeAllChildren(section);
        });
        let currentLetter = 'A';
        let currentSegment = this.findBy(".alphabet-section.A");
        Object.keys(this.elements).forEach(key => {
            let newLetter = key.trim().substring(0, 1).toUpperCase();
            if (newLetter !== currentLetter) {
                currentLetter = newLetter;
                let newSegment = this.findBy(".alphabet-section." + newLetter);
                if (newSegment !== null) {
                    currentSegment = newSegment;
                }
            }
            let element = this.renderElement(this.elements[key]);
            currentSegment.appendChild(element);
        });
    }
}
exports.AlphabeticListFragment = AlphabeticListFragment;
//# sourceMappingURL=AlphabeticListFragment.js.map