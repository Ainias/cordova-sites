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
const Helper_1 = require("../Legacy/Helper");
const Translator_1 = require("../Translator");
const ViewInflater_1 = require("../ViewInflater");
class Dialog {
    constructor(content, title) {
        this._resolver = null;
        this._content = null;
        this._backgroundElement = null;
        this._cancelable = true;
        this._title = Helper_1.Helper.nonNull(title, "");
        this._translatable = true;
        this._additionalClasses = "";
        this._buttons = [];
        this._result = null;
        this._contentPromise = null;
        if (Helper_1.Helper.isNotNull(content)) {
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
    setContent(content) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof content === "string" && content.endsWith(".html")) {
                content = ViewInflater_1.ViewInflater.getInstance().load(content);
            }
            this._contentPromise = Promise.resolve(content);
            this._content = yield this._contentPromise;
            return this;
        });
    }
    addButton(elementOrText, listenerOrResult, shouldClose) {
        shouldClose = Helper_1.Helper.nonNull(shouldClose, true);
        let button = null;
        if (typeof elementOrText === "string") {
            button = document.createElement("button");
            button.classList.add("button");
            button.classList.add("right");
            button.appendChild(Translator_1.Translator.makePersistentTranslation(elementOrText));
        }
        else {
            button = elementOrText;
        }
        let self = this;
        if (typeof listenerOrResult !== "function") {
            let result = listenerOrResult;
            listenerOrResult = function () {
                self._result = result;
            };
        }
        let callback = null;
        if (shouldClose) {
            callback = function (e) {
                if (Helper_1.Helper.isNotNull(listenerOrResult)) {
                    listenerOrResult(e);
                }
                self.close();
            };
        }
        else {
            callback = listenerOrResult;
        }
        if (Helper_1.Helper.isNotNull(callback)) {
            button.addEventListener("click", callback);
        }
        this._buttons.push(button);
    }
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            let titleElement = document.createElement("span");
            titleElement.classList.add("title");
            if (this._translatable && this._title !== "") {
                titleElement.appendChild(Translator_1.Translator.makePersistentTranslation(this._title));
            }
            else {
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
            yield this._contentPromise;
            if (!(this._content instanceof Node)) {
                this._content = (this._translatable) ? Translator_1.Translator.makePersistentTranslation(this._content) : document.createTextNode(this._content);
            }
            contentContainer.appendChild(this._content);
            this._backgroundElement = document.createElement("div");
            this._backgroundElement.classList.add("background");
            this._backgroundElement.appendChild(modalDialog);
            this._backgroundElement.querySelector(".modal").appendChild(buttonBar);
            this._backgroundElement.style.display = "block";
            let self = this;
            if (this._cancelable) {
                let closeButton = document.createElement("span");
                closeButton.classList.add("close");
                closeButton.innerHTML = "&times;";
                titleBar.appendChild(closeButton);
                closeButton.addEventListener("click", function () {
                    self.close();
                });
                window.addEventListener("click", function (e) {
                    if (e.target === self._backgroundElement) {
                        self.close();
                    }
                });
            }
            document.body.appendChild(this._backgroundElement);
            yield Translator_1.Translator.getInstance().updateTranslations();
            return new Promise(function (resolve) {
                self._resolver = resolve;
            });
        });
    }
    close() {
        if (Helper_1.Helper.isNotNull(this._backgroundElement)) {
            this._backgroundElement.style.display = "none";
            this._backgroundElement.remove();
            this._backgroundElement = null;
        }
        if (Helper_1.Helper.isNotNull(this._resolver)) {
            this._resolver(this._result);
        }
    }
}
exports.Dialog = Dialog;
//# sourceMappingURL=Dialog.js.map