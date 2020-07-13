"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateSite = void 0;
const ViewInflater_1 = require("../ViewInflater");
const MasterSite_1 = require("./Delegate/MasterSite");
/**
 * Die Seite bekommt ein Template übergeben und ersetzt in diesem Template das mit dem Selector gefundene
 * Element mit der angebenen View
 */
class TemplateSite extends MasterSite_1.MasterSite {
    /**
     * Constructor für eine TemplateSite
     *
     * @param siteManager
     * @param view
     * @param template
     * @param selectorToReplace
     */
    constructor(siteManager, view, template, selectorToReplace) {
        super(siteManager, template);
        this._viewPromise = Promise.all([this._viewPromise, ViewInflater_1.ViewInflater.getInstance().load(view)]).then(res => {
            res[0].querySelector(selectorToReplace).replaceWith(res[1]);
            ViewInflater_1.ViewInflater.replaceWithChildren(res[1]);
            this._view = res[0];
            return res[0];
        }).catch(e => console.error(e));
    }
}
exports.TemplateSite = TemplateSite;
//# sourceMappingURL=TemplateSite.js.map