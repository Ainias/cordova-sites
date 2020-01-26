import {Dialog} from "./Dialog";
import {ViewInflater} from "../ViewInflater";

const view = require("../../html/Framework/Dialog/chooseDialog.html");
import {Translator} from "../Translator";
import {Helper} from "js-helper/dist/shared/Helper";

export class ChooseDialog extends Dialog {

    constructor(valueNames, title, translateable) {
        let viewPromise = ViewInflater.getInstance().load(view).then(view => {
            translateable = Helper.nonNull(translateable, true);
            let template = view.querySelector("#choose-value-template");
            template.remove();
            template.removeAttribute("id");

            let templateContainer = view.querySelector("#choose-container");

            for(let k in valueNames){
                let valueElem = template.cloneNode(true);

                let textElem = null;
                if (translateable){
                    textElem = Translator.makePersistentTranslation(valueNames[k]);
                }
                else {
                    textElem = document.createElement("span");
                    textElem.innerText = valueNames[k];
                }
                valueElem.querySelector(".choose-dialog-value").appendChild(textElem);
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