import {Dialog} from "../Dialog/Dialog";
import {ViewInflater} from "../ViewInflater";

const view = require("../../html/Dialog/shareDialog.html");

export class ShareDialog extends Dialog {

    constructor(textToShare) {
        super(ViewInflater.getInstance().load(view).then(view => {
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