import {Context} from "./Context";
import {Helper} from "../Helper";
import {Translator} from "../Translator";
import {ViewInflater} from "../ViewInflater";

/**
 * Basisklasse für eine Seite
 */
export class AbstractSite extends Context {

    /**
     * Construktor für eine Seite, sollte überladen werden und view sollte definiert werden. Seitenkonstruktoren bekommen NUR den siteManager übergebn
     * @param siteManager
     * @param view
     */
    constructor(siteManager, view) {
        super(view);

        //Promise und Resolver, welches erfüllt wird, wenn Seite beendet wird
        this._finishPromiseResolver = {
            resolve: null,
            reject: null
        };
        this._finishPromise = new Promise((resolve, reject) => {
            this._finishPromiseResolver = {resolve: resolve, reject: reject};
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

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);
        this.setParameters(Helper.nonNull(constructParameters, {}));
        return res;
    }

    async onStart(pauseArguments) {
        await super.onStart(pauseArguments);
        this._updateTitle();
        this.updateUrl(this._parameters);
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
            titleElement = Translator.makePersistentTranslation(title, args);
        }
        title = Helper.nonNull(title, titleElement.textContent);

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

    async showLoadingSymbol() {
        if (Helper.isNull(this._loadingSymbol) && this._state >= Context.STATE_PAUSED) {
            this._loadingSymbol = ViewInflater.createLoadingSymbol();
            let view = await this.getViewPromise();
            if (Helper.isNotNull(this._loadingSymbol)) {
                view.appendChild(this._loadingSymbol);
            }
        }
    }

    async removeLoadingSymbol() {
        if (Helper.isNotNull(this._loadingSymbol)) {
            this._loadingSymbol.remove();
            this._loadingSymbol = null;
        }
    }

    /**
     * Updatet den Title der Webseite
     * @protected
     */
    _updateTitle() {
        if (this._state === Context.STATE_RUNNING) {
            this._siteManager.updateTitle(this._title.text);
        }
    }

    updateUrl(args) {
        if (this._state === Context.STATE_RUNNING) {
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
        if (!(this._state === Context.STATE_DESTROYING || this._state === Context.STATE_DESTROYED)) {
            this._state = Context.STATE_DESTROYING;
            if (Helper.isNotNull(result)) {
                this.setResult(result);
            }
            this._siteManager.endSite(this);
        }
    }

    goBack() {
        if (this._state === Context.STATE_RUNNING) {
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
}