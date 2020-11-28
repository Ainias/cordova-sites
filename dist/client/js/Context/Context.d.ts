/**
 * Basis-Klasse für Seiten und Fragmente
 */
export declare class Context {
    static readonly STATE_CREATED = 0;
    static readonly STATE_CONSTRUCTED = 1;
    static readonly STATE_VIEW_LOADED = 2;
    static readonly STATE_RUNNING = 3;
    static readonly STATE_PAUSED = 4;
    static readonly STATE_DESTROYING = 5;
    static readonly STATE_DESTROYED = 6;
    protected _pauseParameters: any;
    protected _view: any;
    protected _fragments: any;
    protected _state: any;
    protected _viewLoadedPromise: Promise<any>;
    protected _viewPromise: Promise<any>;
    protected constructParameters: any;
    private onViewLoadedCalled;
    /**
     * Erstellt einen neuen Context. Erwartet den Link zu einem HTML-File, welches vom ViewInflater geladen werden kann.
     * Im Constructor sollten fragmente hinzugefügt werden (nachdem super.constructor(<>) aufgerufen wurde)
     *
     * @param view
     */
    constructor(view: any);
    getState(): any;
    /**
     * Wird von SiteManager aufgerufen, wenn Klasse erstellt wird. Das ViewPromise ist noch nicht zwangsweise geladen!
     * Gibt ein Promise zurück. onViewLoaded wird erst aufgerufen, wenn onConstruct-Promise und view-Promise fullfilled sind.
     *
     * @param constructParameters, Object|Null
     * @returns {Promise<any[]>}
     */
    onConstruct(constructParameters: any): Promise<any[]>;
    callOnViewLoaded(): Promise<any>;
    /**
     * Methode wird aufgerufen, sobald onConstruct-Promise und view-Promise fullfilled sind.
     * View ist hier noch nicht im Dokument hinzugefügt.
     *
     * Benutze diese Methode, um die View beim starten zu manipulieren.
     */
    onViewLoaded(): Promise<any[]>;
    /**
     * onViewLoaded-Promise ist erfüllt => View wird dem Document hinzugefügt => onStart wird aufgerufen
     *
     * Seite wird pausiert => onPause wird aufgerufen => View wird aus dem Document entfernt => - etwas passiert -
     * => Seite wird fortgesetzt => View wird dem Document hinzugefügt => onStart wird mit dem Rückgabewert von onPause ausgeführt
     *
     * Zurückgegebenes Promise wird ignoriert!
     * @param pauseArguments, Object|NULL
     */
    onStart(pauseArguments: any): Promise<void>;
    /**
     * Seite wird pausiet => onPause wird ausgeführt => View wird aus dem Document entfernt
     * Seite wird beendet => onPause wird ausgeführt (falls State === running) => View wird aus dem Document entfernt
     * => onDestroy wird ausgeführt
     *
     * Rückgabe-Promise wird als Pause-Parameter gespeichert und wird beim Fortsetzen der Seite ausgeführt
     * @returns {Promise<void>}
     */
    onPause(...args: any[]): Promise<void>;
    /**
     * Seite wird beendet => onPause wird ausgeführt (falls State === running) => View wird aus dem Document entfernt
     * => onDestroy wird ausgeführt
     *
     * Rückgabe-Promise wird ignoriert
     */
    onDestroy(...args: any[]): Promise<void>;
    isShowing(): boolean;
    /**
     * Fügt ein neues Fragment hinzu.
     *
     * @param viewQuery
     * @param fragment
     */
    addFragment(viewQuery: any, fragment: any): void;
    /**
     * Findet ein Element anhand eines Selectors
     *
     * Wenn all = true, werden alle gefundenen Elemente zurückgegeben
     *
     * Wenn asPromise = true, wird das Ergebnis als Promise zurückgegeben. Hier wird gewartet, bis das _viewPromise fullfilled ist
     * Nutze das, um die View in onConstruct zu manipulieren. Evtl entfernen
     *
     * @param query
     * @param all
     * @param asPromise
     * @returns {*}
     */
    findBy(query: any, all?: any, asPromise?: any): any;
    /**
     * Setzt die PauseParameters
     * @param pauseParameters
     */
    setPauseParameters(pauseParameters: any): void;
    /**
     * Gibt das ViewPromise zurück
     * @returns {*}
     */
    getViewPromise(): Promise<any>;
}
