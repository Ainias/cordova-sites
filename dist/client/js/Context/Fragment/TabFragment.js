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
const AbstractFragment_1 = require("../AbstractFragment");
const defaultTabView = require("../../../html/Framework/Fragment/tabFragment.html");
const Helper_1 = require("../../Legacy/Helper");
const ViewInflater_1 = require("../../ViewInflater");
const Translator_1 = require("../../Translator");
class TabFragment extends AbstractFragment_1.AbstractFragment {
    constructor(site, view) {
        super(site, Helper_1.Helper.nonNull(view, defaultTabView));
        this._tabViews = [];
        this._tabViewPromise = this._viewLoadedPromise;
        if (Helper_1.Helper.isNotNull(view)) {
            this._viewPromise.then(view => {
                let views = view.querySelectorAll(".tab-site");
                let buttons = view.querySelectorAll(".tab-button");
                views.forEach((site, i) => {
                    if (!site.classList.contains("tab-site-template")) {
                        // site.remove();
                        // buttons[i].remove();
                        this.addTab(buttons[i], site);
                    }
                });
            });
        }
    }
    onViewLoaded() {
        const _super = Object.create(null, {
            onViewLoaded: { get: () => super.onViewLoaded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onViewLoaded.call(this);
            this._nameContainer = this.findBy(".tab-names");
            this._nameButton = this.findBy(".tab-button-template");
            this._nameButton.classList.remove("tab-button-template");
            this._nameButton.remove();
            this._tabContent = this.findBy(".tab-content");
            this._tabSite = this.findBy(".tab-site-template");
            this._tabSite.classList.remove("tab-site-template");
            this._tabSite.remove();
            return res;
        });
    }
    addTab(name, origView, nameIsTranslatable) {
        return __awaiter(this, void 0, void 0, function* () {
            nameIsTranslatable = Helper_1.Helper.nonNull(nameIsTranslatable, true);
            let tabView = {
                name: name,
                nameIsTranslatable: nameIsTranslatable,
                viewPromise: ViewInflater_1.ViewInflater.getInstance().load(origView),
                view: null,
                button: null,
            };
            this._tabViews.push(tabView);
            let isFirst = this._tabViews.length === 1;
            this._tabViewPromise = this._tabViewPromise.then(() => tabView.viewPromise).then((view) => {
                let tabViewElement = null;
                if (view.classList.contains("tab-site")) {
                    tabViewElement = origView;
                    origView.remove();
                }
                else {
                    tabViewElement = this._tabSite.cloneNode(true);
                    tabViewElement.appendChild(view);
                }
                tabView.view = tabViewElement;
                this._tabContent.appendChild(tabViewElement);
                let nameElement = null;
                if (name instanceof Element) {
                    nameElement = name;
                    nameElement.remove();
                }
                else {
                    let nameElement = this._nameButton.cloneNode(true);
                    nameElement.appendChild((tabView.nameIsTranslatable) ? Translator_1.Translator.getInstance().makePersistentTranslation(name) : document.createTextNode(tabView.name));
                }
                this._nameContainer.appendChild(nameElement);
                tabView.button = nameElement;
                nameElement.addEventListener("click", () => {
                    this.setActiveTab(tabView);
                });
                if (isFirst) {
                    this.setActiveTab(tabView);
                }
            });
            yield this._tabViewPromise;
        });
    }
    setActiveTab(tabView) {
        let previousActive = this.findBy(".tab-site.active");
        if (Helper_1.Helper.isNotNull(previousActive)) {
            previousActive.classList.remove("active");
        }
        let previousActiveButton = this.findBy(".tab-button.active");
        if (Helper_1.Helper.isNotNull(previousActiveButton)) {
            previousActiveButton.classList.remove("active");
        }
        tabView.view.classList.add("active");
        tabView.button.classList.add("active");
    }
}
exports.TabFragment = TabFragment;
//# sourceMappingURL=TabFragment.js.map