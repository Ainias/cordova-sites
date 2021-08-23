import {Helper} from "../Legacy/Helper";
import {Translator} from "../Translator";
import {ViewInflater} from "../ViewInflater";

export class Dialog {
    protected _contentPromise: any;
    protected _resolver: any;
    protected _content: any;
    protected _backgroundElement: any;
    protected _cancelable: boolean;
    protected _title: any;
    protected _translatable: boolean;
    protected _additionalClasses: string;
    protected _buttons: any[];
    protected _result: any;
    protected _addedToDomePromise;
    protected _addedToDomePromiseResolver;

    constructor(content, title?) {
        this._resolver = null;
        this._content = null;
        this._backgroundElement = null;
        this._cancelable = true;
        this._title = Helper.nonNull(title, "");
        this._translatable = true;
        this._additionalClasses = "";
        this._buttons = [];
        this._result = null;
        this._contentPromise = null;
        this._addedToDomePromise = new Promise(r => {
            this._addedToDomePromiseResolver = r;
        })

        if (Helper.isNotNull(content)) {
            this.setContent(content);
        }
    }

    setTitle(title) {
        this._title = title;
        return this;
    }

    setTranslatable(translatable) {
        this._translatable = translatable;
    }

    setAdditionalClasses(classes) {
        this._additionalClasses = classes;
    }

    getTitle() {
        return this._title;
    }

    setCancelable(cancelable) {
        this._cancelable = (cancelable === true);
        return this;
    }

    async setContent(content) {
        if (typeof content === "string" && content.endsWith(".html")) {
            content = ViewInflater.getInstance().load(content);
        }
        this._contentPromise = Promise.resolve(content);
        this._content = await this._contentPromise;
        return this;
    }

    addButton(elementOrText, listenerOrResult, shouldClose?) {
        shouldClose = Helper.nonNull(shouldClose, true);

        let button = null;
        if (typeof elementOrText === "string") {
            button = document.createElement("button");
            button.classList.add("button");
            button.classList.add("right");
            button.appendChild(Translator.makePersistentTranslation(elementOrText));
        } else {
            button = elementOrText;
        }

        let self = this;
        if (typeof listenerOrResult !== "function") {
            let result = listenerOrResult;
            listenerOrResult = function () {
                self._result = result;
            }
        }

        let callback = null;
        if (shouldClose) {
            callback = function (e) {
                if (Helper.isNotNull(listenerOrResult)) {
                    listenerOrResult(e);
                }
                self.close();
            }
        } else {
            callback = listenerOrResult;
        }

        if (Helper.isNotNull(callback)) {
            button.addEventListener("click", callback);
        }
        this._buttons.push(button);
    }

    async show() {
        await this._contentPromise;

        this._backgroundElement = this.createModalDialogElement();
        this._backgroundElement.addEventListener("keyup", e => {
            if (e.key === "Escape" && this._cancelable){
                this.close();
            }
        })
        document.body.appendChild(this._backgroundElement);
        await (<Translator>Translator.getInstance()).updateTranslations();

        this._addedToDomePromiseResolver();

        return new Promise((resolve) => {
            this._resolver = resolve;
        });
    }

    createModalDialogElement() {
        let titleElement = document.createElement("span");
        titleElement.classList.add("title");
        if (this._translatable && this._title !== "") {
            titleElement.appendChild(Translator.makePersistentTranslation(this._title));
        } else {
            titleElement.innerHTML = this._title;
        }

        let titleBar = document.createElement("div");
        titleBar.appendChild(titleElement);

        let contentContainer = document.createElement("div");
        contentContainer.classList.add("content-container");

        let modalDialog = document.createElement("div");
        modalDialog.className = this._additionalClasses;
        modalDialog.classList.add("modal");
        modalDialog.appendChild(titleBar);
        modalDialog.appendChild(contentContainer);

        let buttonBar = document.createElement("div");
        buttonBar.classList.add("modal-button-container");

        for (let i = 0, n = this._buttons.length; i < n; i++) {
            buttonBar.appendChild(this._buttons[i]);
        }

        if (!(this._content instanceof Node)) {
            this._content = (this._translatable) ? Translator.makePersistentTranslation(this._content) : document.createTextNode(this._content);
        }
        contentContainer.appendChild(this._content);


        this._backgroundElement = document.createElement("div");
        this._backgroundElement.classList.add("background");
        this._backgroundElement.style.display = "block";

        this._backgroundElement.appendChild(modalDialog);
        this._backgroundElement.querySelector(".modal").appendChild(buttonBar);

        if (this._cancelable) {
            let closeButton = document.createElement("span");
            closeButton.classList.add("close");
            closeButton.innerHTML = "&times;";

            titleBar.appendChild(closeButton);
            closeButton.addEventListener("click", () => {
                this.close();
            });
            window.addEventListener("click", (e) => {
                if (e.target === this._backgroundElement) {
                    this.close();
                }
            });
        }
        return this._backgroundElement;
    }

    async waitForAddedToDom() {
        return this._addedToDomePromise;
    }

    close() {
        this.waitForAddedToDom().then(() => {
            if (Helper.isNotNull(this._backgroundElement)) {
                this._backgroundElement.style.display = "none";
                this._backgroundElement.remove();
                this._backgroundElement = null;
            }
        })
        if (Helper.isNotNull(this._resolver)) {
            this._resolver(this._result);
        }
    }
}

