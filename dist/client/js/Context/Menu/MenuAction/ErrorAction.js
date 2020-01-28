"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MenuAction_1 = require("./MenuAction");
const Dialog_1 = require("../../../Dialog/Dialog");
const Translator_1 = require("../../../Translator");
const errorIcon = require("../../../../img/errorIcon.png");
class ErrorAction extends MenuAction_1.MenuAction {
    constructor() {
        super("", () => {
            let d = new Dialog_1.Dialog(ErrorAction._errors.join("<br/>"), Translator_1.Translator.makePersistentTranslation("error"));
            d.setTranslatable(false);
            d.show();
        }, MenuAction_1.MenuAction.SHOW_ALWAYS, -1000, ErrorAction.ERROR_ICON);
        this._visible = (ErrorAction._errors.length > 0);
        this._shouldTranslate = false;
        console.log("icon: ", ErrorAction.ERROR_ICON);
    }
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
}
exports.ErrorAction = ErrorAction;
ErrorAction.ERROR_ICON = errorIcon;
ErrorAction._instance = null;
ErrorAction._errors = [];
//# sourceMappingURL=ErrorAction.js.map