import { Context } from "./Context";
import { SiteManager } from "./SiteManager";
/**
 * Basisklasse für eine Seite
 */
export declare class AbstractSite extends Context {
    static EVENT: any;
    _isDestroying: boolean;
    _finishPromiseResolver: any;
    _finishPromise: any;
    _onConstructPromise: any;
    _parameters: any;
    _result: any;
    _siteManager: SiteManager;
    _title: any;
    _loadingSymbol: any;
    _historyId: any;
    /**
     * Construktor für eine Seite, sollte überladen werden und view sollte definiert werden. Seitenkonstruktoren bekommen NUR den siteManager übergebn
     * @param siteManager
     * @param view
     */
    constructor(siteManager: any, view?: any);
    getTitle(): any;
    onConstruct(constructParameters: any): Promise<any[]>;
    onStart(pauseArguments: any): Promise<void>;
    onViewLoaded(): Promise<any[]>;
    onPause(): Promise<void>;
    onDestroy(): Promise<void>;
    /**
     * Setzt den Titel der Website
     *
     * @param titleElement
     * @param title
     */
    setTitle(titleElement: HTMLElement | string, title?: any): void;
    setParameter(name: any, value: any): void;
    setParameters(parameters: any): void;
    getParameters(): any;
    showLoadingSymbol(): Promise<void>;
    removeLoadingSymbol(): Promise<void>;
    onBeforeUnload(e: any): null | string;
    /**
     * Updatet den Title der Webseite
     * @protected
     */
    _updateTitle(): void;
    updateUrl(args: any): void;
    /**
     * Startet eine andere Seite mit den angegebenen Parametern
     *
     * @param site
     * @param args
     * @returns {*|Promise<*>}
     */
    startSite(site: typeof AbstractSite, args?: any): Promise<any>;
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
    finishAndStartSite(site: any, args?: any, result?: any): Promise<any>;
    /**
     * Beendet die aktuelle Seite. Kann ein Ergebnis setzen
     *
     * @param result
     */
    finish(result?: any): Promise<void>;
    goBack(): void;
    /**
     * Wird aufgerufen, falls zurück gedrückt wird. Gib false zurück, um das beenden der Seite zu verhindern
     */
    onBackPressed(): void;
    /**
     * TODO Einbauen
     */
    onMenuPressed(): void;
    /**
     * TODO Einbauen
     */
    onSearchPressed(): void;
    /**
     * Gibt das FinishPromise zurück
     * @returns {Promise<any>}
     */
    getFinishPromise(): any;
    /**
     * Setzt das Resultat. Letztes Setzen gilt
     * @param result
     */
    setResult(result: any): void;
    /**
     * Gibt den FinishResolver zurück. Genutzt, um FinishPromise zu resolven order rejecten
     * @returns {*}
     */
    getFinishResolver(): any;
    addEventListener(siteEvent: any, listener: any): any;
    isDestroying(): boolean;
}
