import {AbstractFragment} from "../AbstractFragment";
import {ViewHelper} from "js-helper/dist/client";
import {Helper} from "js-helper/dist/shared";

const defaultView = require("../../../html/Framework/Fragment/alphabeticListFragment.html");

export class AlphabeticListFragment extends AbstractFragment {

    private elements: { [key: string]: any[] };
    private sideScrolling: boolean;
    private heading: HTMLElement;
    private headingElement: HTMLElement;

    constructor(site, view) {
        super(site, Helper.nonNull(view, defaultView));
        this.elements = {};
        this.sideScrolling = false;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

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
    }

    setElements(elements) {
        this.elements = {};
        Object.keys(elements).sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        }).forEach(key => {
            this.elements[key] = elements[key];
        });
    }

    setHeading(headingElement: HTMLElement){
        this.heading = headingElement;
        if (this.headingElement && this.heading){
            ViewHelper.removeAllChildren(this.headingElement);
            this.headingElement.appendChild(this.heading);
        }
    }

    renderElement(element): HTMLElement {
        console.warn("should be overloaded?");
        let elem = document.createElement("div");
        elem.innerText = element;
        return elem;
    }

    renderList() {
        ViewHelper.removeAllChildren(this.headingElement);
        if (this.heading) {
            this.headingElement.appendChild(this.heading);
        }

        this.findBy(".alphabet-section", true).forEach(section => {
            ViewHelper.removeAllChildren(section);
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
