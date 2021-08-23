/**
 * Manager-Klasse für die Seiten
 */
export declare class SiteManager {
    private static _instance;
    private _isInit;
    private _siteDiv;
    private _siteStack;
    private _titleTranslationCallbackId;
    private _appEndedListener;
    private _inversedDeepLinks;
    /**
     *
     * @return {SiteManager}
     */
    static getInstance(): SiteManager;
    /**
     * Constructor für Manager. Fügt Listener für zurück (onpopstate) hinzu
     */
    constructor();
    /**
     * @param siteDivId
     * @param deepLinks
     */
    init(siteDivId: any, deepLinks: any): void;
    setAppEndedListener(listener: any): void;
    goBack(): void;
    /**
     * gibt die aktuelle Seite zurück
     * @returns AbstractSite
     */
    getCurrentSite(): any;
    /**
     * Erstellt eine neue Seite und zeigt diese an. ParamsPromise kann entweder ein Promise oder ein Objekt oder null sein.
     *
     * @param siteConstructor
     * @param paramsPromise
     * @returns {Promise<any>}
     */
    startSite(siteConstructor: any, paramsPromise: any): Promise<any>;
    updateUrl(site: any, args: any): void;
    _generateUrl(site: any, args: any): string;
    /**
     * Gibt einen DeepLink zurück
     *
     * @param site
     * @return string
     */
    getDeepLinkFor(site: any): string;
    /**
     * Pausiert eine Seite
     *
     * @param site
     * @private
     */
    _pauseSite(site?: any): void;
    /**
     * Lässt eine Seite weiterlaufen
     *
     * @param site
     * @private
     */
    _resumeSite(site?: any): Promise<void>;
    /**
     * Zeigt eine Seite an
     *
     * @param site
     * @returns {Promise<*>}
     * @private
     */
    _show(site: any): Promise<any>;
    /**
     * Beendet eine Seite. Muss nicht die aktive Seite sein
     *
     * @param site
     */
    endSite(site: any): Promise<void>;
    /**
     * Stellt eine aktive Seite in den Vordergrund;
     * @param site
     * @returns {Promise<*>}
     */
    toForeground(site: any): Promise<any>;
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
    updateTitle(title: any, args?: any, titleTemplate?: any): void;
    private beforeUnload;
}
