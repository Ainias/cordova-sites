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
exports.Context = void 0;
const Helper_1 = require("../Legacy/Helper");
const ViewInflater_1 = require("../ViewInflater");
/**
 * Basis-Klasse für Seiten und Fragmente
 */
class Context {
    /**
     * Erstellt einen neuen Context. Erwartet den Link zu einem HTML-File, welches vom ViewInflater geladen werden kann.
     * Im Constructor sollten fragmente hinzugefügt werden (nachdem super.constructor(<>) aufgerufen wurde)
     *
     * @param view
     */
    constructor(view) {
        this.onViewLoadedCalled = false;
        this._pauseParameters = [];
        this._view = null;
        this._fragments = [];
        this._state = Context.STATE_CREATED;
        this._viewLoadedPromise = Helper_1.Helper.newPromiseWithResolve();
        this._viewPromise = ViewInflater_1.ViewInflater.getInstance().load(view).then((siteContent) => {
            this._view = siteContent;
            return siteContent;
        }).catch(e => {
            // @ts-ignore
            this._viewLoadedPromise.reject(e);
        });
    }
    getState() {
        return this._state;
    }
    /**
     * Wird von SiteManager aufgerufen, wenn Klasse erstellt wird. Das ViewPromise ist noch nicht zwangsweise geladen!
     * Gibt ein Promise zurück. onViewLoaded wird erst aufgerufen, wenn onConstruct-Promise und view-Promise fullfilled sind.
     *
     * @param constructParameters, Object|Null
     * @returns {Promise<any[]>}
     */
    onConstruct(constructParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            this._state = Context.STATE_CONSTRUCTED;
            this.constructParameters = constructParameters;
            let onConstructPromises = [];
            for (let k in this._fragments) {
                onConstructPromises.push(this._fragments[k].onConstruct.apply(this._fragments[k], [constructParameters]));
                onConstructPromises.push(this._fragments[k]._viewPromise);
            }
            return Promise.all(onConstructPromises);
        });
    }
    callOnViewLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.onViewLoadedCalled) {
                this.onViewLoadedCalled = true;
                const res = yield this.onViewLoaded();
                // @ts-ignore
                this._viewLoadedPromise.resolve(res);
            }
            return this._viewLoadedPromise;
        });
    }
    /**
     * Methode wird aufgerufen, sobald onConstruct-Promise und view-Promise fullfilled sind.
     * View ist hier noch nicht im Dokument hinzugefügt.
     *
     * Benutze diese Methode, um die View beim starten zu manipulieren.
     */
    onViewLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            this._state = Context.STATE_VIEW_LOADED;
            let onViewLoadedPromises = [];
            for (let k in this._fragments) {
                onViewLoadedPromises.push(this._fragments[k]._viewPromise.then(() => this._fragments[k].callOnViewLoaded()).then(() => this._fragments[k]._viewLoadedPromise.resolve()));
            }
            return Promise.all(onViewLoadedPromises);
        });
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
    onStart(pauseArguments) {
        return __awaiter(this, void 0, void 0, function* () {
            this._state = Context.STATE_RUNNING;
            for (let k in this._fragments) {
                let fragment = this._fragments[k];
                fragment.onStart.apply(this._fragments[k], [yield this._fragments[k]._pauseParameters]);
                this._fragments[k]._viewPromise.then(function (fragmentView) {
                    if (fragment.isActive()) {
                        fragmentView.classList.remove("hidden");
                    }
                    else {
                        fragmentView.classList.add("hidden");
                    }
                });
            }
        });
    }
    /**
     * Seite wird pausiet => onPause wird ausgeführt => View wird aus dem Document entfernt
     * Seite wird beendet => onPause wird ausgeführt (falls State === running) => View wird aus dem Document entfernt
     * => onDestroy wird ausgeführt
     *
     * Rückgabe-Promise wird als Pause-Parameter gespeichert und wird beim Fortsetzen der Seite ausgeführt
     * @returns {Promise<void>}
     */
    onPause(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            this._state = Context.STATE_PAUSED;
            for (let k in this._fragments) {
                let pauseParameters = this._fragments[k].onPause.apply(this._fragments[k], args);
                this._fragments[k].setPauseParameters(pauseParameters);
            }
        });
    }
    /**
     * Seite wird beendet => onPause wird ausgeführt (falls State === running) => View wird aus dem Document entfernt
     * => onDestroy wird ausgeführt
     *
     * Rückgabe-Promise wird ignoriert
     */
    onDestroy(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            this._state = Context.STATE_DESTROYED;
            for (let k in this._fragments) {
                this._fragments[k].onDestroy.apply(this._fragments[k], args);
            }
        });
    }
    isShowing() {
        return this._state === Context.STATE_RUNNING;
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
        if (this._state >= Context.STATE_CONSTRUCTED) {
            fragment.onConstruct(this.constructParameters);
        }
        if (this._state >= Context.STATE_VIEW_LOADED) {
            Promise.all([this._viewLoadedPromise, fragment.getViewPromise()]).then(() => fragment.callOnViewLoaded());
        }
        if (this._state >= Context.STATE_RUNNING) {
            fragment._viewLoadedPromise.then(() => {
                if (this._state >= Context.STATE_RUNNING) {
                    fragment.onStart();
                }
            });
        }
    }
    /**
     * Entfernt ein Fragment.
     *
     * @param fragment
     */
    removeFragment(fragment) {
        const index = this._fragments.indexOf(fragment);
        if (index !== -1) {
            this._fragments.splice(index, 1);
        }
        fragment._viewPromise.then(res => res.remove());
        this._fragments.push(fragment);
        if (this._state < Context.STATE_PAUSED) {
            fragment.onPause();
        }
        if (this._state < Context.STATE_DESTROYING) {
            fragment.onDestroy();
        }
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
    findBy(query, all, asPromise) {
        all = Helper_1.Helper.nonNull(all, false);
        asPromise = Helper_1.Helper.nonNull(asPromise, false);
        let getVal = function (root) {
            let res = null;
            if (all) {
                res = root.querySelectorAll(query);
                if (root.matches(query)) {
                    res.push(root);
                }
            }
            else {
                if (root.matches(query)) {
                    res = root;
                }
                else {
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
    getViewPromise() {
        return this._viewPromise;
    }
}
exports.Context = Context;
Context.STATE_CREATED = 0;
Context.STATE_CONSTRUCTED = 1;
Context.STATE_VIEW_LOADED = 2;
Context.STATE_RUNNING = 3;
Context.STATE_PAUSED = 4;
Context.STATE_DESTROYING = 5;
Context.STATE_DESTROYED = 6;
//# sourceMappingURL=Context.js.map