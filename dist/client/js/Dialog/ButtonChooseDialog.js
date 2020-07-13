"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonChooseDialog = void 0;
const Dialog_1 = require("./Dialog");
class ButtonChooseDialog extends Dialog_1.Dialog {
    constructor(content, title, values) {
        super(content, title);
        Object.keys(values).forEach(key => {
            this.addButton(values[key], key);
        });
    }
}
exports.ButtonChooseDialog = ButtonChooseDialog;
//# sourceMappingURL=ButtonChooseDialog.js.map