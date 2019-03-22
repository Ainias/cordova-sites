import {Helper} from "../Helper";
import {AbstractSite} from "./AbstractSite";
import {ViewInflater} from "../ViewInflater";
import {Context} from "./Context";
import {Translator} from "../Translator";
import {DataManager} from "../DataManager";
import {HistoryManager} from "../HistoryManager";

/**
 * Manager-Klasse für die Seiten
 */
export class SiteManager {

    /**
     * Constructor für Manager. Fügt Listener für zurück (onpopstate) hinzu
     *
     * @param siteDivId
     * @param deepLinks
     */
    constructor(siteDivId, deepLinks) {

        this._siteDiv = null;
        this._siteStack = [];
        this._siteDiv = document.getElementById(siteDivId);

        this._titleTranslationCallbackId = null;
        this._appEndedListener = null;

        this._inversedDeepLinks = Helper.invertKeyValues(deepLinks);

        //Listener, welcher beim klicken auf Zurück oder Forward ausgeführt wird
        HistoryManager.getInstance().setOnPopStateListener((state, direction) => {
            //Falls zurück
            if (direction === HistoryManager.BACK) {
                this.goBack();
            }
            //Falls vorwärts
            else if (HistoryManager.FORWARD === direction) {
                if (this._siteStack.indexOf(state.state.site) !== -1) {
                    this.toForeground(state.state.site);
                } else {
                    this.startSite(state.state.site.constructor, state.state.parameters)
                }
            }
        });

        //Cordova-Callbacks
        document.addEventListener("pause", () => this._pauseSite(), false);
        document.addEventListener("resume", async () => await this._resumeSite(), false);

        document.addEventListener("menubutton", () => {
            let site = this.getCurrentSite();
            if (Helper.isNotNull(site)){
                site.onMenuPressed();
            }
        }, false);

        document.addEventListener("searchbutton", () => {
            let site = this.getCurrentSite();
            if (Helper.isNotNull(site)){
                site.onSearchPressed();
            }
        }, false);
    }

    setAppEndedListener(listener){
        this._appEndedListener = listener;
    }

    goBack(){
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
    async startSite(siteConstructor, paramsPromise) {
        //Testen, ob der Constructor vom richtigen Typen ist
        if (!(siteConstructor.prototype instanceof AbstractSite)) {
            throw {
                "error": "wrong class given! Expected AbstractSite, given " + siteConstructor.name
            };
        }

        //Loading-Symbol, falls ViewParameters noch länger brauchen
        this._siteDiv.appendChild(ViewInflater.createLoadingSymbol("overlay"));

        //create Site
        let site = new siteConstructor(this);

        this._siteStack.unshift(site);

        //Wartet auf onConstruct, viewPromise, onViewLoaded und zeigt dann Seite
        Promise.resolve(paramsPromise).then(async (params) => {
            site._onConstructPromise = site.onConstruct(params);
            await Promise.all([site._onConstructPromise, site.getViewPromise()]);
            await site.onViewLoaded();
            site._viewLoadedPromise.resolve();

            return this._show(site);
        }).catch((e) => {
            console.error("site start error for site ", siteConstructor.name, e);
            site.getFinishResolver().reject(e);

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
    }

    updateUrl(site, args) {
        let url = this._generateUrl(site, args);
        HistoryManager.getInstance().replaceState({
            'site': site,
            'parameters': args
        }, site.constructor.name, url);
    }

    _generateUrl(site, args) {
        let deepLink = this.getDeepLinkFor(site);
        let url = [location.protocol, '//', location.host, location.pathname].join('');
        if (Helper.isNotNull(deepLink)) {
            args["s"] = deepLink;
            url = [url, DataManager.buildQuery(args)].join('');
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
        return this._inversedDeepLinks[site.constructor]
    }

    /**
     * Pausiert eine Seite
     *
     * @param site
     * @private
     */
    _pauseSite(site) {
        site = Helper.nonNull(site, this.getCurrentSite());
        if (Helper.isNotNull(site) && site._state === Context.STATE_RUNNING) {
            site._pauseParameters = site.onPause();
            Helper.removeAllChildren(this._siteDiv).appendChild(ViewInflater.createLoadingSymbol());
        }
    }

    /**
     * Lässt eine Seite weiterlaufen
     *
     * @param site
     * @private
     */
    async _resumeSite(site) {
        site = Helper.nonNull(site, this.getCurrentSite());
        if (Helper.isNotNull(site) && (site._state === Context.STATE_PAUSED || site._state === Context.STATE_CONSTRUCTED)) {
            await site.getViewPromise();

            Helper.removeAllChildren(this._siteDiv).appendChild(site._view);
            Translator.getInstance().updateTranslations();

            if (Helper.isNull(site._historyId)) {
                site._historyId = HistoryManager.getInstance().pushState({
                    'site': site,
                    'parameters': site.getParameters()
                }, site.constructor.name, this._generateUrl(site, site.getParameters()));
            } else {
                HistoryManager.getInstance().stateToCurrentPosition(site._historyId);
            }
            await site.onStart(site._pauseParameters);
        }
    }

    /**
     * Zeigt eine Seite an
     *
     * @param site
     * @returns {Promise<*>}
     * @private
     */
    async _show(site) {
        //Mache nichts, wenn Seite bereits angezeigt wird
        if (site._state === Context.STATE_RUNNING && this.getCurrentSite() === site) {
            return;
        }

        //Speichere alte Seite
        this._pauseSite();

        //Zeige Ladesymbol
        Helper.removeAllChildren(this._siteDiv).appendChild(ViewInflater.createLoadingSymbol());

        //Hinzufügen/Updaten zum SiteStack
        let currentSiteIndex = this._siteStack.indexOf(site);
        if (-1 !== currentSiteIndex) {
            this._siteStack.splice(currentSiteIndex, 1);
        }
        this._siteStack.push(site);

        //Anzeigen der Seite. Stelle sicher, dass die View wirklich geladen ist!
        return site.getViewPromise().then(async () => {

            //Stelle sicher, dass in der Zwischenzeit keine andere Seite gestartet wurde
            if (this.getCurrentSite() === site) {

                await this._resumeSite(site);
            }
        });
    }

    /**
     * Beendet eine Seite. Muss nicht die aktive Seite sein
     *
     * @param site
     */
    endSite(site) {
        return site._onConstructPromise.then(async () => {
            //Aus Index entfernen
            let index = this._siteStack.indexOf(site);
            this._siteStack.splice(index, 1);

            //Seite war/ist die aktive Seite
            if (index === this._siteStack.length) {
                this._pauseSite(site);
                //Seite ist aktiv, zeige Ladesymbol
                this._siteDiv.appendChild(ViewInflater.createLoadingSymbol('overlay'));
                site.getFinishPromise().then(() => {
                    let newSiteToShow = this.getCurrentSite();
                    if (Helper.isNotNull(newSiteToShow)) {
                        this.toForeground(newSiteToShow);
                    }
                });
            }

            if (this._siteStack.length <= 0) {
                console.log("stack is empty, starting normal site!");
                HistoryManager.getInstance().cutStack(0);
                HistoryManager.getInstance().go(-1 * history.length, true);
                Helper.removeAllChildren(this._siteDiv).appendChild(document.createTextNode("App ist beendet"));
                if (typeof this._appEndedListener === "function"){
                    this._appEndedListener(this);
                }
            }

            await site.onDestroy();
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
        titleTemplate = Helper.nonNull(titleTemplate, Helper.isNull(title) ? "document-title-empty" : "document-title");
        if (Helper.isNotNull(this._titleTranslationCallbackId)) {
            Translator.removeTranslationCallback(this._titleTranslationCallbackId);
        }

        this._titleTranslationCallbackId = Translator.addTranslationCallback(() => {
            if (args !== false) {
                title = Translator.translate(title, args);
            }

            document.title = Translator.translate(titleTemplate, [title]);
        });
    }
}
