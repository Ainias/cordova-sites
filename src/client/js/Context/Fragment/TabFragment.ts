import {AbstractFragment} from "../AbstractFragment";

const defaultTabView = require("../../../html/Framework/Fragment/tabFragment.html");
import {Helper} from "../../Legacy/Helper";
import {ViewInflater} from "../../ViewInflater";
import {Translator} from "../../Translator";
import {ViewHelper} from "js-helper/dist/client";

export class TabFragment extends AbstractFragment {

    private tabs: Map<number, {
        name: string,
        nameIsTranslatable: boolean,
        fragment: AbstractFragment,
        button: HTMLElement,
        view: HTMLElement,
        id: number,
    }>;
    private lastTabId = 0;
    private tabViewPromise;
    private activeTab: number = null;

    private nameContainer;
    private nameButton;
    private tabContent;
    private tabSite;

    private onTabChangeListener: (newTab) => void = null;

    constructor(site, view?) {
        super(site, Helper.nonNull(view, defaultTabView));
        this.tabs = new Map<number, { id: number, name: string; nameIsTranslatable: boolean; fragment: AbstractFragment; button: HTMLElement; view: HTMLElement }>();
        this.tabViewPromise = this._viewLoadedPromise;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        this.nameContainer = this.findBy(".tab-names");
        this.nameButton = this.findBy(".tab-button-template");
        this.nameButton.classList.remove("tab-button-template");
        this.nameButton.remove();

        this.tabContent = this.findBy(".tab-content");
        this.tabSite = this.findBy(".tab-site-template");
        this.tabSite.classList.remove("tab-site-template");
        this.tabSite.remove();

        return res;
    }


    addFragment(name, fragment, nameIsTranslatable?: boolean) {
        super.addFragment(".tab-content", fragment);
        fragment._viewLoadedPromise.then(() => {
            const view = this.tabSite.cloneNode(true);
            view.appendChild(fragment._view);

            this.lastTabId++;
            const tab = {
                name: name,
                fragment: fragment,
                view: view,
                nameIsTranslatable: Helper.nonNull(nameIsTranslatable, true),
                button: null,
                id: this.lastTabId,
            };

            this.tabs.set(this.lastTabId, tab);

            this._viewLoadedPromise.then(() => {
                const nameElement = this.nameButton.cloneNode(true);
                nameElement.appendChild(tab.nameIsTranslatable ? Translator.makePersistentTranslation(name) : document.createTextNode(name));
                this.nameContainer.appendChild(nameElement);

                nameElement.addEventListener("click", () => {
                    this.showTab(tab.id);
                });
                tab.button = nameElement;

                if (Helper.isNull(this.activeTab)) {
                    this.showTab(tab.id);
                }
            })
        });
    }

    showTab(tabId: number) {
        const tab = this.tabs.get(tabId);
        if (tab && tabId !== this.activeTab) {
            let previousActiveButton = this.findBy(".tab-button.active");
            if (Helper.isNotNull(previousActiveButton)) {
                previousActiveButton.classList.remove("active");
            }

            tab.button.classList.add("active");

            ViewHelper.removeAllChildren(this.tabContent);
            this.tabContent.appendChild(tab.view);
            this.activeTab = tabId;

            if (this.onTabChangeListener) {
                this.onTabChangeListener(tab);
            }
        }
    }

    setOnTabChangeListener(listener: (newTab) => void) {
        this.onTabChangeListener = listener;
    }

    // async addTab(name, origView, nameIsTranslatable?) {
    //     nameIsTranslatable = Helper.nonNull(nameIsTranslatable, true);
    //     let tabView = {
    //         name: name,
    //         nameIsTranslatable: nameIsTranslatable,
    //         viewPromise: ViewInflater.getInstance().load(origView),
    //         view: null,
    //         button: null,
    //     };
    //     this.tabs.push(tabView);
    //     let isFirst = this._tabViews.length === 1;
    //
    //     this._tabViewPromise = this._tabViewPromise.then(() => tabView.viewPromise).then((view) => {
    //         let tabViewElement = null;
    //         if (view.classList.contains("tab-site")) {
    //             tabViewElement = origView;
    //             origView.remove();
    //         } else {
    //
    //         }
    //         tabView.view = tabViewElement;
    //         this._tabContent.appendChild(tabViewElement);
    //
    //         let nameElement = null;
    //         if (name instanceof Element) {
    //             nameElement = name;
    //             nameElement.remove();
    //         } else {
    //             nameElement = this.nameButton.cloneNode(true);
    //             nameElement.appendChild((tabView.nameIsTranslatable) ? (<Translator>Translator.getInstance()).makePersistentTranslation(name) : document.createTextNode(tabView.name));
    //         }
    //         this._nameContainer.appendChild(nameElement);
    //
    //         tabView.button = nameElement;
    //
    //         nameElement.addEventListener("click", () => {
    //             this.setActiveTab(tabView);
    //         });
    //         if (isFirst) {
    //             this.setActiveTab(tabView);
    //         }
    //     });
    //     await this._tabViewPromise;
    // }

    // setActiveTab(tabView) {
    //     let previousActive = this.findBy(".tab-site.active");
    //     if (Helper.isNotNull(previousActive)) {
    //         previousActive.classList.remove("active");
    //     }
    //     let previousActiveButton = this.findBy(".tab-button.active");
    //     if (Helper.isNotNull(previousActiveButton)) {
    //         previousActiveButton.classList.remove("active");
    //     }
    //     tabView.view.classList.add("active");
    //     tabView.button.classList.add("active");
    // }
}
