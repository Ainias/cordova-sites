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
exports.AbstractSite = void 0;
const Context_1 = require("./Context");
const Helper_1 = require("../Legacy/Helper");
const Translator_1 = require("../Translator");
const ViewInflater_1 = require("../ViewInflater");
const EventManager_1 = require("../Legacy/EventManager/EventManager");
/**
 * Basisklasse für eine Seite
 */
class AbstractSite extends Context_1.Context {
    /**
     * Construktor für eine Seite, sollte überladen werden und view sollte definiert werden. Seitenkonstruktoren bekommen NUR den siteManager übergebn
     * @param siteManager
     * @param view
     */
    constructor(siteManager, view) {
        super(view);
        this._isDestroying = false;
        this._isDestroying = false;
        //Promise und Resolver, welches erfüllt wird, wenn Seite beendet wird
        this._finishPromiseResolver = {
            resolve: null,
            reject: null
        };
        this._finishPromise = new Promise((resolve, reject) => {
            this._finishPromiseResolver = { resolve: resolve, reject: reject };
        });
        //Promise, welches erfüllt wird, wenn onConstruct-Promsise erfüllt wurde. Wird für onDestroy gebraucht
        this._onConstructPromise = null;
        this._parameters = {};
        this._result = null;
        this._siteManager = siteManager;
        this._title = {
            element: null,
            text: null
        };
        this._loadingSymbol = null;
        //Wird zum speichern der zugehörigen HistoryID genutzt
        this._historyId = null;
    }
    getTitle() {
        return this._title;
    }
    onConstruct(constructParameters) {
        const _super = Object.create(null, {
            onConstruct: { get: () => super.onConstruct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onConstruct.call(this, constructParameters);
            this.setParameters(Helper_1.Helper.nonNull(constructParameters, {}));
            EventManager_1.EventManager.trigger(AbstractSite.EVENT.ON_CONSTRUCT, {
                site: this, params: constructParameters
            });
            return res;
        });
    }
    onStart(pauseArguments) {
        const _super = Object.create(null, {
            onStart: { get: () => super.onStart }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.onStart.call(this, pauseArguments);
            this._updateTitle();
            this.updateUrl(this._parameters);
            EventManager_1.EventManager.trigger(AbstractSite.EVENT.ON_START, {
                site: this, params: pauseArguments
            });
        });
    }
    onViewLoaded() {
        const _super = Object.create(null, {
            onViewLoaded: { get: () => super.onViewLoaded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onViewLoaded.call(this);
            EventManager_1.EventManager.trigger(AbstractSite.EVENT.ON_VIEW_LOADED, {
                site: this
            });
            return res;
        });
    }
    onPause() {
        const _super = Object.create(null, {
            onPause: { get: () => super.onPause }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onPause.call(this);
            EventManager_1.EventManager.trigger(AbstractSite.EVENT.ON_PAUSE, {
                site: this
            });
            return res;
        });
    }
    onDestroy() {
        const _super = Object.create(null, {
            onDestroy: { get: () => super.onDestroy }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onDestroy.call(this);
            EventManager_1.EventManager.trigger(AbstractSite.EVENT.ON_DESTROY, {
                site: this
            });
            return res;
        });
    }
    /**
     * Setzt den Titel der Website
     *
     * @param titleElement
     * @param title
     */
    setTitle(titleElement, title) {
        if (typeof titleElement === "string") {
            let args = title;
            title = titleElement;
            titleElement = Translator_1.Translator.makePersistentTranslation(title, args);
        }
        title = Helper_1.Helper.nonNull(title, titleElement.textContent);
        this._title = {
            element: titleElement,
            text: title
        };
        this._updateTitle();
    }
    setParameter(name, value) {
        this._parameters[name] = value;
        this.updateUrl(this._parameters);
    }
    setParameters(parameters) {
        this._parameters = parameters;
        this.updateUrl(this._parameters);
    }
    getParameters() {
        return this._parameters;
    }
    showLoadingSymbol() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Helper_1.Helper.isNull(this._loadingSymbol)) {
                this._loadingSymbol = ViewInflater_1.ViewInflater.createLoadingSymbol("overlay");
                let view = yield this.getViewPromise();
                if (Helper_1.Helper.isNotNull(this._loadingSymbol)) {
                    view.appendChild(this._loadingSymbol);
                }
            }
        });
    }
    removeLoadingSymbol() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Helper_1.Helper.isNotNull(this._loadingSymbol)) {
                this._loadingSymbol.remove();
                this._loadingSymbol = null;
            }
        });
    }
    onBeforeUnload(e) {
        return null;
    }
    /**
     * Updatet den Title der Webseite
     * @protected
     */
    _updateTitle() {
        if (this._state === Context_1.Context.STATE_RUNNING) {
            this._siteManager.updateTitle(this._title.text);
        }
    }
    updateUrl(args) {
        if (this._state === Context_1.Context.STATE_RUNNING) {
            this._siteManager.updateUrl(this, args);
        }
    }
    /**
     * Startet eine andere Seite mit den angegebenen Parametern
     *
     * @param site
     * @param args
     * @returns {*|Promise<*>}
     */
    startSite(site, args) {
        return this._siteManager.startSite(site, args);
    }
    /**
     * Alias für
     *  this.startSite(...);
     *  this.finish(...);
     *
     * @param site
     * @param args
     * @param result
     * @returns {*|Promise<*>}
     */
    finishAndStartSite(site, args, result) {
        let res = this.startSite(site, args);
        this.finish(result);
        return res;
    }
    /**
     * Beendet die aktuelle Seite. Kann ein Ergebnis setzen
     *
     * @param result
     */
    finish(result) {
        if (!(this._isDestroying || this._state === Context_1.Context.STATE_DESTROYED)) {
            this._isDestroying = true;
            if (Helper_1.Helper.isNotNull(result)) {
                this.setResult(result);
            }
            return this._siteManager.endSite(this);
        }
    }
    goBack() {
        if (this._state === Context_1.Context.STATE_RUNNING) {
            this._siteManager.goBack();
        }
    }
    /**
     * Wird aufgerufen, falls zurück gedrückt wird. Gib false zurück, um das beenden der Seite zu verhindern
     */
    onBackPressed() {
    }
    /**
     * TODO Einbauen
     */
    onMenuPressed() {
    }
    /**
     * TODO Einbauen
     */
    onSearchPressed() {
    }
    /**
     * Gibt das FinishPromise zurück
     * @returns {Promise<any>}
     */
    getFinishPromise() {
        return this._finishPromise;
    }
    /**
     * Setzt das Resultat. Letztes Setzen gilt
     * @param result
     */
    setResult(result) {
        this._result = result;
    }
    /**
     * Gibt den FinishResolver zurück. Genutzt, um FinishPromise zu resolven order rejecten
     * @returns {*}
     */
    getFinishResolver() {
        return this._finishPromiseResolver;
    }
    addEventListener(siteEvent, listener) {
        return EventManager_1.EventManager.getInstance().addListener(siteEvent, data => {
            if (data.site && data.site instanceof this.constructor) {
                listener(data);
            }
        });
    }
    isDestroying() {
        return this._isDestroying;
    }
}
exports.AbstractSite = AbstractSite;
AbstractSite.EVENT = {
    ON_CONSTRUCT: "abstract-site-on-construct",
    ON_VIEW_LOADED: "abstract-site-on-view-loaded",
    ON_START: "abstract-site-on-start",
    ON_PAUSE: "abstract-site-on-pause",
    ON_DESTROY: "abstract-site-on-destroy"
};
//# sourceMappingURL=AbstractSite.js.map