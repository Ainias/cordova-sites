"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElemChooseDialog = void 0;
const Dialog_1 = require("./Dialog");
const ViewInflater_1 = require("../ViewInflater");
const view = require("../../html/Framework/Dialog/chooseDialog.html");
class ElemChooseDialog extends Dialog_1.Dialog {
    constructor(valueNames, title) {
        let viewPromise = ViewInflater_1.ViewInflater.getInstance().load(view).then(view => {
            let template = view.querySelector("#choose-value-template");
            template.remove();
            template.removeAttribute("id");
            let templateContainer = view.querySelector("#choose-container");
            for (let k in valueNames) {
                let valueElem = template.cloneNode(true);
                valueElem.querySelector(".choose-dialog-value").appendChild(valueNames[k]);
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
exports.ElemChooseDialog = ElemChooseDialog;
//# sourceMappingURL=ElemChooseDialog.js.map