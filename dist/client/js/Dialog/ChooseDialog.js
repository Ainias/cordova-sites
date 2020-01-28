"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dialog_1 = require("./Dialog");
const ViewInflater_1 = require("../ViewInflater");
const view = require("../../html/Framework/Dialog/chooseDialog.html");
const Translator_1 = require("../Translator");
const Helper_1 = require("js-helper/dist/shared/Helper");
class ChooseDialog extends Dialog_1.Dialog {
    constructor(valueNames, title, translateable) {
        let viewPromise = ViewInflater_1.ViewInflater.getInstance().load(view).then(view => {
            translateable = Helper_1.Helper.nonNull(translateable, true);
            let template = view.querySelector("#choose-value-template");
            template.remove();
            template.removeAttribute("id");
            let templateContainer = view.querySelector("#choose-container");
            for (let k in valueNames) {
                let valueElem = template.cloneNode(true);
                let textElem = null;
                if (translateable) {
                    textElem = Translator_1.Translator.makePersistentTranslation(valueNames[k]);
                }
                else {
                    textElem = document.createElement("span");
                    textElem.innerText = valueNames[k];
                }
                valueElem.querySelector(".choose-dialog-value").appendChild(textElem);
                valueElem["dataset"]["value"] = k;
                valueElem.addEventListener("click", () => {
                    this._result = k;
                    this.close();
                });
                templateContainer.appendChild(valueElem);
            }
            return view;
        });
        super(viewPromise, title);
    }
}
exports.ChooseDialog = ChooseDialog;
//# sourceMappingURL=ChooseDialog.js.map