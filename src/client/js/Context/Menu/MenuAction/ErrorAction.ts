import {MenuAction} from "./MenuAction";
import {Dialog} from "../../../Dialog/Dialog";
import {Translator} from "../../../Translator";

const errorIcon = require("../../../../img/errorIcon.png");

export class ErrorAction extends MenuAction {

    static ERROR_ICON = errorIcon;

    private static _instance = null;

    private static _errors = [];

    static addError(errorMessage) {
        if (this._errors.indexOf(errorMessage) === -1) {
            this._errors.push(errorMessage);
            this.getInstance().setVisibility((this._errors.length > 0));
        }
    }

    static removeError(errorMessage) {
        let index = this._errors.indexOf(errorMessage);
        if (index >= 0) {
            this._errors.splice(index, 1);
            this.getInstance().setVisibility((this._errors.length > 0));
        }
    }

    /**
     * @return ErrorAction;
     */
    static getInstance() {
        if (this._instance === null) {
            this._instance = new ErrorAction();
        }
        return this._instance;
    }

    constructor() {
        super("", () => {
            let d = new Dialog(ErrorAction._errors.join("<br/>"), Translator.translate("error"));
            d.setTranslatable(false);
            d.show();
        }, MenuAction.SHOW_ALWAYS, -1000, ErrorAction.ERROR_ICON);
        this._visible = (ErrorAction._errors.length > 0);
        this._shouldTranslate = false;

        console.log("icon: ", ErrorAction.ERROR_ICON);
    }
}