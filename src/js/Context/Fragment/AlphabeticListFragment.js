import {AbstractFragment} from "../AbstractFragment";
import {Helper} from "../../Helper";

import defaultView from "../../../html/Framework/Fragment/alphabeticListFragment.html"

export class AlphabeticListFragment extends AbstractFragment {
    constructor(site, view) {
        super(site, Helper.nonNull(view, defaultView));
        this._elements = {};
        this._sideScrolling = false;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

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
            Helper.removeAllChildren(section);
        });

        let currentLetter = 'A';
        let currentSegment = this.findBy(".alphabet-section.A");
        Object.keys(this._elements).forEach(key => {
            let newLetter = key.substring(0, 1).toUpperCase();
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