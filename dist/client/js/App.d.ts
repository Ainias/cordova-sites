export declare class App {
    private _resolver;
    private _readyPromise;
    private _deepLinks;
    private _siteManager;
    private startingSite;
    private startingSiteParameters;
    private static _logo;
    static _resolver: {
        resolve: any;
        reject: any;
    };
    private static _promises;
    static _mainPromise: any;
    static _startParams: {};
    /**
     * Erstellt eine neue App, speichert ein internes Promise, welches resolved wird, sobald das deviceready-Event gefeuert wird
     */
    constructor();
    addDeepLink(link: any, siteConstructor: any): void;
    startSite(site: any, args?: any): Promise<any>;
    static setLogo(logo: any): void;
    static getLogo(): string;
    start(startSiteConstructor: any): Promise<void>;
    /**
     * Startet die erste Seite
     */
    startStartingSite(): Promise<any>;
    /**
     * Führt die Callback aus, sobald das interne Promise aufgelöst wird und App._promises fertig sind oder gibt das interne Promise zurück
     *
     * @param callback
     * @returns {Promise<*>}
     */
    ready(callback?: any): Promise<any[]>;
    static addInitialization(callbackOrPromise: any): void;
    static _getStartParams(): {};
    static _extractParams(paramString: any): {};
    static setStartParam(name: any, value: any): void;
}
