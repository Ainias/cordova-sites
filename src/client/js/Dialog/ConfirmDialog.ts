import {Dialog} from "./Dialog";
import {Helper} from "../Legacy/Helper";

export class ConfirmDialog extends Dialog {

    private readonly confirmButtonText: string;
    private readonly cancelButtonText: string;

    constructor(content, title, confirmButtonText?, cancelButtonText?) {
        super(content, title);
        this.confirmButtonText = Helper.nonNull(confirmButtonText, "confirm-button");
        this.cancelButtonText = Helper.nonNull(cancelButtonText, "cancel-button");
    }

    async show() {
        this.addButton(this.confirmButtonText, true);
        this.addButton(this.cancelButtonText, false);

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