"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dialog_1 = require("../Dialog/Dialog");
const ViewInflater_1 = require("../ViewInflater");
const view = require("../../html/Dialog/shareDialog.html");
class ShareDialog extends Dialog_1.Dialog {
    constructor(textToShare) {
        super(ViewInflater_1.ViewInflater.getInstance().load(view).then(view => {
            view.querySelector("#whatsapp-share").addEventListener("click", () => {
                let linkToOpen = "";
                linkToOpen = "https://web.whatsapp.com/send?text=" + encodeURIComponent(textToShare);
                window.open(linkToOpen, '_blank', "noopener");
                this.close();
            });
            view.querySelector("#telegram-share").addEventListener("click", () => {
                let linkToOpen = "https://t.me/share/url?url=" + encodeURIComponent(textToShare);
                window.open(linkToOpen, '_blank', "noopener");
                this.close();
            });
            return view;
        }), "Share");
    }
}
exports.ShareDialog = ShareDialog;
//# sourceMappingURL=ShareDialog.js.map