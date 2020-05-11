import {Dialog} from "./Dialog";
import {ViewInflater} from "../ViewInflater";

const view = require("../../html/Framework/Dialog/chooseDialog.html");

export class ElemChooseDialog extends Dialog {
    constructor(valueNames, title) {
        let viewPromise = ViewInflater.getInstance().load(view).then(view => {
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
                    this.close()
                });
                templateContainer.appendChild(valueElem);
            }
            return view;
        });

        super(viewPromise, title);
    }
}