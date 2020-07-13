"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmDialog = void 0;
const Dialog_1 = require("./Dialog");
const Helper_1 = require("../Legacy/Helper");
class ConfirmDialog extends Dialog_1.Dialog {
    constructor(content, title) {
        super(content, title);
    }
    show() {
        const _super = Object.create(null, {
            show: { get: () => super.show }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.addButton("confirm-button", true);
            this.addButton("cancel-button", false);
            return _super.show.call(this);
        });
    }
    close() {
        if (Helper_1.Helper.isNull(this._result)) {
            this._result = false;
        }
        return super.close();
    }
}
exports.ConfirmDialog = ConfirmDialog;
//# sourceMappingURL=ConfirmDialog.js.map