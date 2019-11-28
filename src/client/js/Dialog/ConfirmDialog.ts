import {Dialog} from "./Dialog";
import {Helper} from "../Legacy/Helper";

export class ConfirmDialog extends Dialog {
    constructor(content, title) {
        super(content, title);
    }

    async show() {
        this.addButton("confirm-button", true);
        this.addButton("cancel-button", false);

        return super.show();
    }


    close() {
        if (Helper.isNull(this._result))
        {
            this._result = false;
        }
        return super.close();
    }
}