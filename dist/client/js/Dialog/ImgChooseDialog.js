"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImgChooseDialog = void 0;
const ElemChooseDialog_1 = require("./ElemChooseDialog");
class ImgChooseDialog extends ElemChooseDialog_1.ElemChooseDialog {
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
exports.ImgChooseDialog = ImgChooseDialog;
//# sourceMappingURL=ImgChooseDialog.js.map