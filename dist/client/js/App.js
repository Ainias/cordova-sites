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
/**
 * Eine Klasse, welche als Ursprung für die App genutzt wird
 */
const Helper_1 = require("./Legacy/Helper");
const SiteManager_1 = require("./Context/SiteManager");
class App {
    /**
     * Erstellt eine neue App, speichert ein internes Promise, welches resolved wird, sobald das deviceready-Event gefeuert wird
     */
    constructor() {
        this._resolver = { resolve: null, reject: null };
        this._readyPromise = new Promise(r => document.addEventListener("deviceready", r, false));
        this._deepLinks = {};
        this._siteManager = SiteManager_1.SiteManager.getInstance();
    }
    addDeepLink(link, siteConstructor) {
        this._deepLinks[link] = siteConstructor;
    }
    startSite(site, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._siteManager) {
                return this._siteManager.startSite(site, args);
            }
        });
    }
    static setLogo(logo) {
        this._logo = logo;
    }
    static getLogo() {
        return this._logo;
    }
    start(startSiteConstructor) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready();
            let initalSiteConstructor = startSiteConstructor;
            let params = App._getStartParams();
            if (Helper_1.Helper.isNotNull(params["s"])) {
                startSiteConstructor = Helper_1.Helper.nonNull(this._deepLinks[params["s"]], startSiteConstructor);
                delete params["s"];
            }
            let siteManager = this._siteManager;
            siteManager.init("site", this._deepLinks);
            Helper_1.Helper.removeAllChildren(document.getElementById("site"));
            siteManager.startSite(startSiteConstructor, params);
            siteManager.setAppEndedListener(manager => {
                manager.startSite(initalSiteConstructor);
            });
            // this._siteManager = siteManager;
        });
    }
    /**
     * Führt die Callback aus, sobald das interne Promise aufgelöst wird und App._promises fertig sind oder gibt das interne Promise zurück
     *
     * @param callback
     * @returns {Promise<*>}
     */
    ready(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = this._readyPromise.then(() => {
                App._resolver.resolve(this);
                return Promise.all(App._promises);
            });
            if (callback) {
                return promise.then(callback);
            }
            else {
                return promise;
            }
        });
    }
    static addInitialization(callbackOrPromise) {
        if (typeof callbackOrPromise === "function") {
            let promise = callbackOrPromise;
            callbackOrPromise = App._mainPromise.then((app) => {
                return promise(app);
            });
        }
        App._promises.push(callbackOrPromise);
    }
    static _getStartParams() {
        return Object.assign(App._extractParams(window.location.search.substr(1)), App._startParams);
    }
    static _extractParams(paramString) {
        if (Helper_1.Helper.isNull(paramString)) {
            return null;
        }
        let result = {}, tmp = [];
        let items = paramString.split("&");
        for (let index = 0; index < items.length; index++) {
            tmp = items[index].split("=");
            if (tmp[0].trim().length > 0) {
                result[tmp[0]] = decodeURIComponent(tmp[1]);
            }
        }
        return result;
    }
    static setStartParam(name, value) {
        this._startParams[name] = value;
    }
}
exports.App = App;
App._promises = [];
App._resolver = {
    resolve: null,
    reject: null,
};
App._mainPromise = new Promise((res, rej) => {
    App._resolver = {
        resolve: res,
        reject: rej,
    };
});
App._startParams = {};
//# sourceMappingURL=App.js.map