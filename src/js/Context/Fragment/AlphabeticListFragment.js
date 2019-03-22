import {AbstractFragment} from "../AbstractFragment";
import {Helper} from "../../Helper";

import defaultView from "../../../html/Framework/Fragment/alphabeticListFragment.html"

export class AlphabeticListFragment extends AbstractFragment {
    constructor(site, view) {
        super(site, Helper.nonNull(view, defaultView));
        this._elements = {};
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        //TODO font-size changing

        this.findBy(".alphabet-scroll-to", true).forEach(elem => {
            let listener = ()=> {
                this.findBy(".alphabet-section."+elem.dataset.letter).scrollIntoView({behavior:"smooth", block:"start"});
            };
            elem.addEventListener("touchstart", listener);
            elem.addEventListener("touchmove", listener);
            elem.addEventListener("click", listener);
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
            let newLetter = key.substring(0,1).toUpperCase();
            if (newLetter !== currentLetter){
                currentLetter = newLetter;
                let newSegment = this.findBy(".alphabet-section."+newLetter);
                if (newSegment !== null){
                    currentSegment = newSegment;
                }
                console.log(newLetter, currentSegment);
            }
            let element = this.renderElement(this._elements[key]);
            currentSegment.appendChild(element);
        });
    }
}