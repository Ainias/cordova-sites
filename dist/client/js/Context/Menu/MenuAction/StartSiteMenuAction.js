"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MenuAction_1 = require("./MenuAction");
const App_1 = require("../../../App");
class StartSiteMenuAction extends MenuAction_1.MenuAction {
    constructor(name, site, showFor, order, icon) {
        super(name, () => {
            if (StartSiteMenuAction._app) {
                if (Array.isArray(site) && site.length >= 2) {
                    StartSiteMenuAction._app.startSite(site[0], site[1]);
                }
                else {
                    StartSiteMenuAction._app.startSite(site);
                }
            }
        }, showFor, order, icon);
    }
}
exports.StartSiteMenuAction = StartSiteMenuAction;
StartSiteMenuAction._app = null;
App_1.App.addInitialization(app => {
    StartSiteMenuAction._app = app;
});
//# sourceMappingURL=StartSiteMenuAction.js.map