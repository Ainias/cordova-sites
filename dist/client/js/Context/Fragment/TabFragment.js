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
exports.TabFragment = void 0;
const AbstractFragment_1 = require("../AbstractFragment");
const defaultTabView = require("../../../html/Framework/Fragment/tabFragment.html");
const Helper_1 = require("../../Legacy/Helper");
const Translator_1 = require("../../Translator");
const client_1 = require("js-helper/dist/client");
class TabFragment extends AbstractFragment_1.AbstractFragment {
    constructor(site, view) {
        super(site, Helper_1.Helper.nonNull(view, defaultTabView));
        this.lastTabId = 0;
        this.activeTab = null;
        this.onTabChangeListener = null;
        this.tabs = new Map();
        this.tabViewPromise = this._viewLoadedPromise;
    }
    onViewLoaded() {
        const _super = Object.create(null, {
            onViewLoaded: { get: () => super.onViewLoaded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onViewLoaded.call(this);
            this.nameContainer = this.findBy(".tab-names");
            this.nameButton = this.findBy(".tab-button-template");
            this.nameButton.classList.remove("tab-button-template");
            this.nameButton.remove();
            this.tabContent = this.findBy(".tab-content");
            this.tabSite = this.findBy(".tab-site-template");
            this.tabSite.classList.remove("tab-site-template");
            this.tabSite.remove();
            return res;
        });
    }
    addFragment(name, fragment, nameIsTranslatable) {
        super.addFragment(".tab-content", fragment);
        fragment._viewLoadedPromise.then(() => {
            const view = this.tabSite.cloneNode(true);
            view.appendChild(fragment._view);
            this.lastTabId++;
            const tab = {
                name: name,
                fragment: fragment,
                view: view,
                nameIsTranslatable: Helper_1.Helper.nonNull(nameIsTranslatable, true),
                button: null,
                id: this.lastTabId,
            };
            this.tabs.set(this.lastTabId, tab);
            this._viewLoadedPromise.then(() => {
                const nameElement = this.nameButton.cloneNode(true);
                nameElement.appendChild(tab.nameIsTranslatable ? Translator_1.Translator.makePersistentTranslation(name) : document.createTextNode(name));
                this.nameContainer.appendChild(nameElement);
                nameElement.addEventListener("click", () => {
                    this.showTab(tab.id);
                });
                tab.button = nameElement;
                if (Helper_1.Helper.isNull(this.activeTab)) {
                    this.showTab(tab.id);
                }
            });
        });
    }
    showTab(tabId) {
        const tab = this.tabs.get(tabId);
        if (tab && tabId !== this.activeTab) {
            let previousActiveButton = this.findBy(".tab-button.active");
            if (Helper_1.Helper.isNotNull(previousActiveButton)) {
                previousActiveButton.classList.remove("active");
            }
            tab.button.classList.add("active");
            client_1.ViewHelper.removeAllChildren(this.tabContent);
            this.tabContent.appendChild(tab.view);
            this.activeTab = tabId;
            if (this.onTabChangeListener) {
                this.onTabChangeListener(tab);
            }
        }
    }
    setOnTabChangeListener(listener) {
        this.onTabChangeListener = listener;
    }
}
exports.TabFragment = TabFragment;
//# sourceMappingURL=TabFragment.js.map