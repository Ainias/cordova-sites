import {ElemChooseDialog} from "./ElemChooseDialog";

export class ImgChooseDialog extends ElemChooseDialog {

    constructor(valueNames, title) {

        let newValueNames = {};
        Object.keys(valueNames).forEach(k => {
            let elem = document.createElement("img");
            elem.src = valueNames[k];
            newValueNames[k] = elem;
        });

        super(newValueNames, title);
    }
}