import {Helper} from "./Helper";

/**
 * Manager, welcher sich um die Manipulation von der Historie kümmert
 */
export class HistoryManager {
    static BACK: any = -1;
    static FORWARD: any = 1;
    static CURRENT: any = 0;

    private static _instance: HistoryManager;


    private _lastStateId: number;
    private _states: {};
    private _stack: any[];
    private _ignoreOnPopState: boolean;
    private _isUpdateNativeStack: boolean;
    private _currentStackIndex: number;
    private _onPopStateListener: any;

    /**
     * Constructor für den Manager. Fügt den onPopstateListener hinzu
     */
    constructor() {
        this._lastStateId = -1;
        this._states = {};

        this._stack = [];
        this._ignoreOnPopState = false;
        this._isUpdateNativeStack = false;
        this._onPopStateListener = null;
        this._currentStackIndex = -1;

        window.onpopstate = (e) => {
            //Wenn nativeStack geupdated wird, mache nichts
            if (this._isUpdateNativeStack) {
                this._isUpdateNativeStack = false;
                return;
            }

            let direction = e.state["type"];
            this._currentStackIndex += direction;
            this._updateNativeHistoryStack();

            //Wenn popState ignoriert werden soll, mache ebenfalls nichts außer Stack updaten
            if (this._ignoreOnPopState) {
                this._ignoreOnPopState = false;
                return;
            }

            //Wenn Listener gesetzt, hole daten und führe Listener aus
            if (typeof this._onPopStateListener === 'function') {
                let data = {};
                if (this._stack.length > this._currentStackIndex && this._currentStackIndex >= 0) {
                    data = this._states[this._stack[this._currentStackIndex]];
                }

                this._onPopStateListener(data, direction, e);
            }
        };

        this._updateNativeHistoryStack();
    }

    /**
     * Updated den History-Stack innerhalb des Browsers
     *
     * @param url
     * @private
     */
    _updateNativeHistoryStack(url?) {

        url = Helper.nonNull(url, window.location.href);

        //setze das weitere zurückgehen
        if (this._currentStackIndex >= 0) {
            history.pushState({
                "type": HistoryManager.BACK,
            }, "back", url);
        }

        history.pushState({
            "type": HistoryManager.CURRENT,
        }, "current", url);

        if (this._currentStackIndex < this._stack.length - 1) {
            history.pushState({
                "type": HistoryManager.FORWARD,
            }, "forward", url);

            this._isUpdateNativeStack = true;
            history.go(-1);
        }
    }

    /**
     * Generiert einen neuen History-Eintrag. Gibt die ID des Eintrages zurück
     *
     * @param value
     * @param name
     * @param url
     *
     * @return {number}
     */
    pushState(value, name, url) {
        let newState = {
            state: value,
            title: name,
            url: url
        };
        this._lastStateId++;
        this._states[this._lastStateId] = newState;

        this._currentStackIndex++;
        this._stack.splice(this._currentStackIndex, this._stack.length, this._lastStateId);
        this._updateNativeHistoryStack(url);
        return this._lastStateId;
    }

    /**
     * Ersetzt den Eintrag mit der gegebenen ID. Ist die ID nicht gegeben, wird der aktuelle Eintrag ersetzt
     *
     * @param value
     * @param name
     * @param url
     * @param id
     */
    replaceState(value, name, url, id?) {
        id = Helper.nonNull(id, this._stack[this._currentStackIndex]);
        if (this._stack.length > this._currentStackIndex && this._currentStackIndex >= 0) {
            this._states[id] = {
                state: value,
                title: name,
                url: url
            };
            this._updateNativeHistoryStack(url);
        }
    }

    /**
     * Verschiebt den Eintrag mit der entsprechenden ID an die aktuell aktive Stelle
     * @param id
     */
    stateToCurrentPosition(id) {
        if (Helper.isNotNull(this._states[id])) {
            let oldStackPosition = this._stack.indexOf(id);
            if (oldStackPosition !== -1) {
                this._stack.splice(oldStackPosition, 1);
                this._stack.splice(this._currentStackIndex + ((oldStackPosition <= this._currentStackIndex) ? -1 : 0), 0, id);
            }
        }
    }

    /**
     * Gehe um to in der Historie
     *
     * @param to
     * @param ignoreOnPopState
     */
    go(to, ignoreOnPopState?) {
        this._ignoreOnPopState = (Helper.nonNull(ignoreOnPopState, false) === true);
        history.go(to);
    }

    /**
     * Entferne alle Einträge ab at (inklusive). Wenn at nicht gesetzt ist, wird alles über der aktuellen position abgeschnitten
     * @param at
     */
    cutStack(at) {
        at = Helper.nonNull(at, this._currentStackIndex + 1);
        this._stack.splice(at);
        this._currentStackIndex = Math.min(this._currentStackIndex, this._stack.length - 1);
        this._updateNativeHistoryStack();
    }

    /**
     * Alias für this.go(-1)
     */
    back() {
        this.go(-1);
    }

    /**
     * Alias für this.go(1)
     */
    forward() {
        this.go(+1);
    }

    /**
     * Setzt den onPopStateListener
     *
     * @param listener
     */
    setOnPopStateListener(listener) {
        this._onPopStateListener = listener;
    }

    /**
     * Singelton-Getter
     * @return {HistoryManager}
     */
    static getInstance() {
        if (Helper.isNull(HistoryManager._instance)) {
            HistoryManager._instance = new HistoryManager();
        }
        return HistoryManager._instance;
    }
}
