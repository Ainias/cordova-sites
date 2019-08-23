import {Helper} from "../Helper";
import {ViewInflater} from "../ViewInflater";

/**
 * Basis-Klasse für Seiten und Fragmente
 */
export class Context {

    static STATE_CREATED = 0;
    static STATE_CONSTRUCTED = 1;
    static STATE_RUNNING = 2;
    static STATE_PAUSED = 3;
    static STATE_DESTROYING = 4;
    static STATE_DESTROYED = 5;

    protected _pauseParameters;
    protected _view;
    protected _fragments;
    protected _state;
    protected _viewLoadedPromise;
    protected _viewPromise;

    /**
     * Erstellt einen neuen Context. Erwartet den Link zu einem HTML-File, welches vom ViewInflater geladen werden kann.
     * Im Constructor sollten fragmente hinzugefügt werden (nachdem super.constructor(<>) aufgerufen wurde)
     *
     * @param view
     */
    constructor(view) {
        this._pauseParameters = [];

        this._view = null;
        this._fragments = [];
        this._state = Context.STATE_CREATED;
        this._viewLoadedPromise = Helper.newPromiseWithResolve();

        this._viewPromise = ViewInflater.getInstance().load(view).then((siteContent) => {
            this._view = siteContent;
            return siteContent;
        }).catch(e => {
            this._viewLoadedPromise.reject(e);
        });
    }

    getState(){
        return this._state;
    }

    /**
     * Wird von SiteManager aufgerufen, wenn Klasse erstellt wird. Das ViewPromise ist noch nicht zwangsweise geladen!
     * Gibt ein Promise zurück. onViewLoaded wird erst aufgerufen, wenn onConstruct-Promise und view-Promise fullfilled sind.
     *
     * @param constructParameters, Object|Null
     * @returns {Promise<any[]>}
     */
    async onConstruct(constructParameters) {
        this._state = Context.STATE_CONSTRUCTED;

        let onConstructPromises = [];
        for (let k in this._fragments) {
            onConstructPromises.push(this._fragments[k].onConstruct.apply(this._fragments[k], [constructParameters]));
            onConstructPromises.push(this._fragments[k]._viewPromise);
        }
        return Promise.all(onConstructPromises);
    }

    /**
     * Methode wird aufgerufen, sobald onConstruct-Promise und view-Promise fullfilled sind.
     * View ist hier noch nicht im Dokument hinzugefügt.
     *
     * Benutze diese Methode, um die View beim starten zu manipulieren.
     */
    async onViewLoaded() {
        this._state = Context.STATE_CONSTRUCTED;

        let onViewLoadedPromises = [];
        for (let k in this._fragments) {
            onViewLoadedPromises.push(this._fragments[k]._viewPromise.then(() => this._fragments[k].onViewLoaded()).then(
                () => this._fragments[k]._viewLoadedPromise.resolve()
            ));
        }
        return Promise.all(onViewLoadedPromises);
    }

    /**
     * onViewLoaded-Promise ist erfüllt => View wird dem Document hinzugefügt => onStart wird aufgerufen
     *
     * Seite wird pausiert => onPause wird aufgerufen => View wird aus dem Document entfernt => - etwas passiert -
     * => Seite wird fortgesetzt => View wird dem Document hinzugefügt => onStart wird mit dem Rückgabewert von onPause ausgeführt
     *
     * Zurückgegebenes Promise wird ignoriert!
     * @param pauseArguments, Object|NULL
     */
    async onStart(pauseArguments) {
        this._state = Context.STATE_RUNNING;

        for (let k in this._fragments) {
            let fragment = this._fragments[k];
            fragment.onStart.apply(this._fragments[k], [await this._fragments[k]._pauseParameters]);
            this._fragments[k]._viewPromise.then(function (fragmentView) {
                if (fragment.isActive()) {
                    fragmentView.classList.remove("hidden");
                } else {
                    fragmentView.classList.add("hidden");
                }
            });
        }
    }

    /**
     * Seite wird pausiet => onPause wird ausgeführt => View wird aus dem Document entfernt
     * Seite wird beendet => onPause wird ausgeführt (falls State === running) => View wird aus dem Document entfernt
     * => onDestroy wird ausgeführt
     *
     * Rückgabe-Promise wird als Pause-Parameter gespeichert und wird beim Fortsetzen der Seite ausgeführt
     * @returns {Promise<void>}
     */
    async onPause(...args) {
        this._state = Context.STATE_PAUSED;
        for (let k in this._fragments) {
            let pauseParameters = this._fragments[k].onPause.apply(this._fragments[k], args);
            this._fragments[k].setPauseParameters(pauseParameters);
        }
    }

    /**
     * Seite wird beendet => onPause wird ausgeführt (falls State === running) => View wird aus dem Document entfernt
     * => onDestroy wird ausgeführt
     *
     * Rückgabe-Promise wird ignoriert
     */
    async onDestroy(...args) {
        this._state = Context.STATE_DESTROYED;
        for (let k in this._fragments) {
            this._fragments[k].onDestroy.apply(this._fragments[k], args);
        }
    }

    /**
     * Fügt ein neues Fragment hinzu.
     *
     * @param viewQuery
     * @param fragment
     */
    addFragment(viewQuery, fragment) {
        this._fragments.push(fragment);
        fragment.setViewQuery(viewQuery);
        this._viewPromise = Promise.all([this._viewPromise, fragment._viewPromise]).then(res => {
            res[0].querySelector(viewQuery).appendChild(res[1]);
            return res[0];
        }).catch(e => console.error(e));
    }

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
    findBy(query, all?, asPromise?) {
        all = Helper.nonNull(all, false);
        asPromise = Helper.nonNull(asPromise, false);

        let getVal = function (root) {
            let res = null;
            if (all) {
                res = root.querySelectorAll(query);
                if (root.matches(query)) {
                    res.push(root);
                }
            } else {
                if (root.matches(query)) {
                    res = root;
                } else {
                    res = root.querySelector(query);
                }
            }
            return res;
        };

        if (asPromise) {
            return this._viewPromise.then(function (rootView) {
                return getVal(rootView);
            });
        }
        return getVal(this._view);
    }

    /**
     * Setzt die PauseParameters
     * @param pauseParameters
     */
    setPauseParameters(pauseParameters) {
        this._pauseParameters = pauseParameters;
    }

    /**
     * Gibt das ViewPromise zurück
     * @returns {*}
     */
    getViewPromise(){
        return this._viewPromise;
    }
}

// Die States für den Context
Context.STATE_CREATED = 0;
Context.STATE_CONSTRUCTED = 1;
Context.STATE_RUNNING = 2;
Context.STATE_PAUSED = 3;
Context.STATE_DESTROYING = 4;
Context.STATE_DESTROYED = 5;