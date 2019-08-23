/**
 * Eine Klasse, welche als Ursprung für die App genutzt wird
 */
import {Helper} from "./Helper";
import {SiteManager} from "./Context/SiteManager";


export class App {
    private _resolver: { resolve: null; reject: null };
    private _readyPromise: Promise<unknown>;
    private _deepLinks: {};
    private _siteManager: any;
    public static _resolver: { resolve: any; reject: any };
    private static _promises: Promise<any>[] = [];
    public static _mainPromise;
    static _startParams: {};

    /**
     * Erstellt eine neue App, speichert ein internes Promise, welches resolved wird, sobald das deviceready-Event gefeuert wird
     */
    constructor() {
        this._resolver = {resolve: null, reject: null};
        this._readyPromise = new Promise(r => document.addEventListener("deviceready", r, false));

        this._deepLinks = {};
        this._siteManager = SiteManager.getInstance();
    }

    addDeepLink(link, siteConstructor) {
        this._deepLinks[link] = siteConstructor;
    }

    async startSite(site, args?){
        if (this._siteManager){
            return this._siteManager.startSite(site, args);
        }
    }

    async start(startSiteConstructor) {
        await this.ready();
        let initalSiteConstructor = startSiteConstructor;

        let params = App._getStartParams();

        if (Helper.isNotNull(params["s"])) {
            startSiteConstructor = Helper.nonNull(this._deepLinks[params["s"]], startSiteConstructor);
            delete params["s"];
        }

        let siteManager = this._siteManager;
        siteManager.init("site", this._deepLinks);
        Helper.removeAllChildren(document.getElementById("site"));
        siteManager.startSite(startSiteConstructor, params);
        siteManager.setAppEndedListener(manager => {
            manager.startSite(initalSiteConstructor);
        });

        // this._siteManager = siteManager;
    }

    /**
     * Führt die Callback aus, sobald das interne Promise aufgelöst wird und App._promises fertig sind oder gibt das interne Promise zurück
     *
     * @param callback
     * @returns {Promise<*>}
     */
    async ready(callback?) {
        let promise = this._readyPromise.then(() => {
            App._resolver.resolve(this);
            return Promise.all(App._promises);
        });

        if (callback) {
            return promise.then(callback);
        } else {
            return promise;
        }
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
        if (Helper.isNull(paramString)) {
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

    static setStartParam(name, value){
        this._startParams[name] = value;
    }
}

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