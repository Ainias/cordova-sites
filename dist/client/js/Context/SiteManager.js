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
exports.SiteManager = void 0;
const Helper_1 = require("../Legacy/Helper");
const AbstractSite_1 = require("./AbstractSite");
const ViewInflater_1 = require("../ViewInflater");
const Context_1 = require("./Context");
const Translator_1 = require("../Translator");
const DataManager_1 = require("../DataManager");
const HistoryManager_1 = require("../HistoryManager");
const EventManager_1 = require("../Legacy/EventManager/EventManager");
/**
 * Manager-Klasse für die Seiten
 */
class SiteManager {
    /**
     * Constructor für Manager. Fügt Listener für zurück (onpopstate) hinzu
     */
    constructor() {
        this._isInit = false;
    }
    /**
     *
     * @return {SiteManager}
     */
    static getInstance() {
        if (!this._instance) {
            this._instance = new SiteManager();
        }
        return this._instance;
    }
    /**
     * @param siteDivId
     * @param deepLinks
     */
    init(siteDivId, deepLinks) {
        this._siteDiv = null;
        this._siteStack = [];
        this._siteDiv = document.getElementById(siteDivId);
        this._titleTranslationCallbackId = null;
        this._appEndedListener = null;
        this._inversedDeepLinks = Helper_1.Helper.invertKeyValues(deepLinks);
        //Listener, welcher beim klicken auf Zurück oder Forward ausgeführt wird
        HistoryManager_1.HistoryManager.getInstance().setOnPopStateListener((state, direction) => {
            //Falls zurück
            if (direction === HistoryManager_1.HistoryManager.BACK) {
                this.goBack();
            }
            //Falls vorwärts
            else if (HistoryManager_1.HistoryManager.FORWARD === direction) {
                if (this._siteStack.indexOf(state.state.site) !== -1) {
                    this.toForeground(state.state.site);
                }
                else {
                    this.startSite(state.state.site.constructor, state.state.parameters);
                }
            }
        });
        //Cordova-Callbacks
        document.addEventListener("pause", () => this._pauseSite(), false);
        document.addEventListener("resume", () => __awaiter(this, void 0, void 0, function* () { return yield this._resumeSite(); }), false);
        document.addEventListener("menubutton", () => {
            let site = this.getCurrentSite();
            if (Helper_1.Helper.isNotNull(site)) {
                site.onMenuPressed();
            }
        }, false);
        document.addEventListener("searchbutton", () => {
            let site = this.getCurrentSite();
            if (Helper_1.Helper.isNotNull(site)) {
                site.onSearchPressed();
            }
        }, false);
        this._isInit = true;
    }
    setAppEndedListener(listener) {
        this._appEndedListener = listener;
    }
    goBack() {
        if (this._siteStack.length >= 1) {
            let site = this.getCurrentSite();
            if (site && site.onBackPressed() !== false) {
                this.endSite(site);
            }
        }
    }
    /**
     * gibt die aktuelle Seite zurück
     * @returns AbstractSite
     */
    getCurrentSite() {
        if (this._siteStack.length >= 1) {
            return this._siteStack[this._siteStack.length - 1];
        }
        return null;
    }
    /**
     * Erstellt eine neue Seite und zeigt diese an. ParamsPromise kann entweder ein Promise oder ein Objekt oder null sein.
     *
     * @param siteConstructor
     * @param paramsPromise
     * @returns {Promise<any>}
     */
    startSite(siteConstructor, paramsPromise) {
        return __awaiter(this, void 0, void 0, function* () {
            //Testen, ob der Constructor vom richtigen Typen ist
            if (!(siteConstructor.prototype instanceof AbstractSite_1.AbstractSite)) {
                throw {
                    "error": "wrong class given! Expected AbstractSite, given " + siteConstructor.name
                };
            }
            EventManager_1.EventManager.trigger("site-manager-start-site", {
                site: siteConstructor, paramPromise: paramsPromise
            });
            //Loading-Symbol, falls ViewParameters noch länger brauchen
            let loadingSymbol = ViewInflater_1.ViewInflater.createLoadingSymbol("overlay");
            this._siteDiv.appendChild(loadingSymbol);
            //create Site
            let site = new siteConstructor(this);
            this._siteStack.unshift(site);
            //Wartet auf onConstruct, viewPromise, onViewLoaded und zeigt dann Seite
            Promise.resolve(paramsPromise).then((params) => __awaiter(this, void 0, void 0, function* () {
                site._onConstructPromise = site.onConstruct(Helper_1.Helper.nonNull(params, {}));
                yield Promise.all([site._onConstructPromise, site.getViewPromise()]);
                //If site is ended inside onConstruct, don't do anything
                if (site._state !== Context_1.Context.STATE_DESTROYED && site._state !== Context_1.Context.STATE_DESTROYING) {
                    yield site.onViewLoaded();
                    site._viewLoadedPromise.resolve();
                    return this._show(site);
                }
                loadingSymbol.remove();
            })).catch((e) => {
                console.error("site start error for site ", siteConstructor.name, e);
                site.getFinishResolver().reject(e);
                loadingSymbol.remove();
                //Zeige alte Seite im Fehlerfall wieder an
                for (let i = this._siteStack.length - 1; i >= 0; i--) {
                    if (this._siteStack[i] !== site) {
                        return this._show(this._siteStack[i]);
                    }
                }
                site._viewLoadedPromise.reject();
            });
            //Gebe Site-Promise zurück
            return site.getFinishPromise();
        });
    }
    updateUrl(site, args) {
        let url = this._generateUrl(site, args);
        HistoryManager_1.HistoryManager.getInstance().replaceState({
            'site': site,
            'parameters': args
        }, site.constructor.name, url);
    }
    _generateUrl(site, args) {
        let deepLink = this.getDeepLinkFor(site);
        let url = [location.protocol, '//', location.host, location.pathname].join('');
        if (Helper_1.Helper.isNotNull(deepLink)) {
            args["s"] = deepLink;
            url = [url, DataManager_1.DataManager.buildQuery(args)].join('');
        }
        return url;
    }
    /**
     * Gibt einen DeepLink zurück
     *
     * @param site
     * @return string
     */
    getDeepLinkFor(site) {
        return this._inversedDeepLinks[site.constructor];
    }
    /**
     * Pausiert eine Seite
     *
     * @param site
     * @private
     */
    _pauseSite(site) {
        site = Helper_1.Helper.nonNull(site, this.getCurrentSite());
        if (Helper_1.Helper.isNotNull(site) && site._state === Context_1.Context.STATE_RUNNING) {
            site._pauseParameters = site.onPause();
            Helper_1.Helper.removeAllChildren(this._siteDiv).appendChild(ViewInflater_1.ViewInflater.createLoadingSymbol());
        }
    }
    /**
     * Lässt eine Seite weiterlaufen
     *
     * @param site
     * @private
     */
    _resumeSite(site) {
        return __awaiter(this, void 0, void 0, function* () {
            site = Helper_1.Helper.nonNull(site, this.getCurrentSite());
            if (Helper_1.Helper.isNotNull(site) && (site._state === Context_1.Context.STATE_PAUSED || site._state === Context_1.Context.STATE_CONSTRUCTED)) {
                yield site.getViewPromise();
                Helper_1.Helper.removeAllChildren(this._siteDiv).appendChild(site._view);
                yield Translator_1.Translator.getInstance().updateTranslations();
                if (Helper_1.Helper.isNull(site._historyId)) {
                    site._historyId = HistoryManager_1.HistoryManager.getInstance().pushState({
                        'site': site,
                        'parameters': site.getParameters()
                    }, site.constructor.name, this._generateUrl(site, site.getParameters()));
                }
                else {
                    HistoryManager_1.HistoryManager.getInstance().stateToCurrentPosition(site._historyId);
                }
                yield site.onStart(site._pauseParameters);
            }
        });
    }
    /**
     * Zeigt eine Seite an
     *
     * @param site
     * @returns {Promise<*>}
     * @private
     */
    _show(site) {
        return __awaiter(this, void 0, void 0, function* () {
            //check if site is ended
            if (site._state === Context_1.Context.STATE_DESTROYING || site._state === Context_1.Context.STATE_DESTROYED) {
                return;
            }
            //Mache nichts, wenn Seite bereits angezeigt wird
            if (site._state === Context_1.Context.STATE_RUNNING && this.getCurrentSite() === site) {
                return;
            }
            //Speichere alte Seite
            this._pauseSite();
            //Zeige Ladesymbol
            Helper_1.Helper.removeAllChildren(this._siteDiv).appendChild(ViewInflater_1.ViewInflater.createLoadingSymbol());
            //Hinzufügen/Updaten zum SiteStack
            let currentSiteIndex = this._siteStack.indexOf(site);
            if (-1 !== currentSiteIndex) {
                this._siteStack.splice(currentSiteIndex, 1);
            }
            this._siteStack.push(site);
            //Anzeigen der Seite. Stelle sicher, dass die View wirklich geladen ist!
            return site.getViewPromise().then(() => __awaiter(this, void 0, void 0, function* () {
                //Stelle sicher, dass in der Zwischenzeit keine andere Seite gestartet wurde
                if (this.getCurrentSite() === site) {
                    yield this._resumeSite(site);
                }
            }));
        });
    }
    /**
     * Beendet eine Seite. Muss nicht die aktive Seite sein
     *
     * @param site
     */
    endSite(site) {
        return __awaiter(this, void 0, void 0, function* () {
            // return site._onConstructPromise.then(async () => {
            //Aus Index entfernen
            let index = this._siteStack.indexOf(site);
            this._siteStack.splice(index, 1);
            //Seite war/ist die aktive Seite
            if (index === this._siteStack.length) {
                this._pauseSite(site);
                //Seite ist aktiv, zeige Ladesymbol
                this._siteDiv.appendChild(ViewInflater_1.ViewInflater.createLoadingSymbol('overlay'));
                site.getFinishPromise().then(() => {
                    let newSiteToShow = this.getCurrentSite();
                    if (Helper_1.Helper.isNotNull(newSiteToShow)) {
                        this.toForeground(newSiteToShow);
                    }
                });
            }
            if (this._siteStack.length <= 0) {
                console.log("stack is empty, starting normal site!");
                HistoryManager_1.HistoryManager.getInstance().cutStack(0);
                HistoryManager_1.HistoryManager.getInstance().go(-1 * history.length, true);
                Helper_1.Helper.removeAllChildren(this._siteDiv).appendChild(document.createTextNode("App ist beendet"));
                if (typeof this._appEndedListener === "function") {
                    this._appEndedListener(this);
                }
            }
            site._context = Context_1.Context.STATE_DESTROYING;
            yield site.onDestroy();
            site._context = Context_1.Context.STATE_DESTROYED;
            site.getFinishResolver().resolve(site._result);
        });
    }
    /**
     * Stellt eine aktive Seite in den Vordergrund;
     * @param site
     * @returns {Promise<*>}
     */
    toForeground(site) {
        return this._show(site);
    }
    /**
     * Updated den Seitentitel. Dafür gibt es im translation-file den Key document-title (document-title-empty, falls title null),
     * der als Parameter in der Übersetzung den übergebenen Title übergeben bekommt.
     *
     * Der übergebene title wird mit den angebenenen argumenten zuerst übersetz, bevor der gesamte document-Title überstzt wird
     *
     * Wenn args === false, dann wird title nicht übersetzt
     *
     * Durch das argument titleTemplate kann der key im translation-file von document-title individuell abweichen
     *
     * @param title
     * @param args
     * @param titleTemplate
     */
    updateTitle(title, args, titleTemplate) {
        titleTemplate = Helper_1.Helper.nonNull(titleTemplate, Helper_1.Helper.isNull(title) ? "document-title-empty" : "document-title");
        if (Helper_1.Helper.isNotNull(this._titleTranslationCallbackId)) {
            Translator_1.Translator.removeTranslationCallback(this._titleTranslationCallbackId);
        }
        this._titleTranslationCallbackId = Translator_1.Translator.addTranslationCallback(() => {
            if (args !== false) {
                title = Translator_1.Translator.translate(title, args);
            }
            document.title = Translator_1.Translator.translate(titleTemplate, [title]);
        });
    }
}
exports.SiteManager = SiteManager;
SiteManager._instance = null;
//# sourceMappingURL=SiteManager.js.map