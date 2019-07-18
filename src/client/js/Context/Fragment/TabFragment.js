import {AbstractFragment} from "../AbstractFragment";

import defaultTabView from "../../../html/Framework/Fragment/tabFragment.html";
import {Helper} from "../../Helper";
import {ViewInflater} from "../../ViewInflater";
import {Translator} from "../../Translator";

export class TabFragment extends AbstractFragment {

    constructor(site, view) {
        super(site, Helper.nonNull(view, defaultTabView));
        this._tabViews = [];
        this._tabViewPromise = this._viewLoadedPromise;
        if (Helper.isNotNull(view)) {
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

    async onViewLoaded() {
        let res = super.onViewLoaded();

        this._nameContainer = this.findBy(".tab-names");
        this._nameButton = this.findBy(".tab-button-template");
        this._nameButton.classList.remove("tab-button-template");
        this._nameButton.remove();

        this._tabContent = this.findBy(".tab-content");
        this._tabSite = this.findBy(".tab-site-template");
        this._tabSite.classList.remove("tab-site-template");
        this._tabSite.remove();

        return res;
    }

    async addTab(name, origView, nameIsTranslatable) {
        nameIsTranslatable = Helper.nonNull(nameIsTranslatable, true);
        let tabView = {
            name: name,
            nameIsTranslatable: nameIsTranslatable,
            viewPromise: ViewInflater.getInstance().load(origView),
        };
        this._tabViews.push(tabView);
        let isFirst = this._tabViews.length === 1;

        this._tabViewPromise = this._tabViewPromise.then(() => tabView.viewPromise).then((view) => {
            let tabViewElement = null;
            if (view.classList.contains("tab-site")) {
                tabViewElement = origView;
                origView.remove();
            } else {
                tabViewElement = this._tabSite.cloneNode(true);
                tabViewElement.appendChild(view);
            }
            tabView.view = tabViewElement;
            this._tabContent.appendChild(tabViewElement);

            let nameElement = null;
            if (name instanceof Element) {
                nameElement = name;
                nameElement.remove();
            } else {
                let nameElement = this._nameButton.cloneNode(true);
                nameElement.appendChild((tabView.nameIsTranslatable) ? Translator.getInstance().makePersistentTranslation(name) : document.createTextNode(tabView.name));
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
        await this._tabViewPromise;
    }

    setActiveTab(tabView) {
        let previousActive = this.findBy(".tab-site.active");
        if (Helper.isNotNull(previousActive)) {
            previousActive.classList.remove("active");
        }
        let previousActiveButton = this.findBy(".tab-button.active");
        if (Helper.isNotNull(previousActiveButton)) {
            previousActiveButton.classList.remove("active");
        }
        tabView.view.classList.add("active");
        tabView.button.classList.add("active");
    }
}