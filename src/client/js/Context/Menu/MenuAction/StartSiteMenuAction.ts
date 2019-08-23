import {MenuAction} from "./MenuAction";
import {App} from "../../../App";

export class StartSiteMenuAction extends MenuAction {
    static _app: App;

    constructor(name, site, showFor, order, icon) {
        super(name, () => {
            if (StartSiteMenuAction._app) {
                if (Array.isArray(site) && site.length >= 2) {
                    StartSiteMenuAction._app.startSite(site[0], site[1]);
                } else {
                    StartSiteMenuAction._app.startSite(site);
                }
            }
        }, showFor, order, icon);
    }
}

StartSiteMenuAction._app = null;
App.addInitialization(app => {
    StartSiteMenuAction._app = app;
});