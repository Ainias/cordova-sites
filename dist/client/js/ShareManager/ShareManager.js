"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ShareDialog_1 = require("./ShareDialog");
class ShareManager {
    share(text) {
        if (device.platform === "browser") {
            this._shareBrowser(text);
        }
        else {
            this._shareMobile(text);
        }
    }
    _shareMobile(text) {
        navigator["share"](text);
    }
    _shareBrowser(text) {
        new ShareDialog_1.ShareDialog(text).show();
    }
}
exports.ShareManager = ShareManager;
//# sourceMappingURL=ShareManager.js.map