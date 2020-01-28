/**
 * Manager, welcher sich um die Manipulation von der Historie kümmert
 */
export declare class HistoryManager {
    static BACK: any;
    static FORWARD: any;
    static CURRENT: any;
    private static _instance;
    private _lastStateId;
    private _states;
    private _stack;
    private _ignoreOnPopState;
    private _isUpdateNativeStack;
    private _currentStackIndex;
    private _onPopStateListener;
    /**
     * Constructor für den Manager. Fügt den onPopstateListener hinzu
     */
    constructor();
    /**
     * Updated den History-Stack innerhalb des Browsers
     *
     * @param url
     * @private
     */
    _updateNativeHistoryStack(url?: any): void;
    /**
     * Generiert einen neuen History-Eintrag. Gibt die ID des Eintrages zurück
     *
     * @param value
     * @param name
     * @param url
     *
     * @return {number}
     */
    pushState(value: any, name: any, url: any): number;
    /**
     * Ersetzt den Eintrag mit der gegebenen ID. Ist die ID nicht gegeben, wird der aktuelle Eintrag ersetzt
     *
     * @param value
     * @param name
     * @param url
     * @param id
     */
    replaceState(value: any, name: any, url: any, id?: any): void;
    /**
     * Verschiebt den Eintrag mit der entsprechenden ID an die aktuell aktive Stelle
     * @param id
     */
    stateToCurrentPosition(id: any): void;
    /**
     * Gehe um to in der Historie
     *
     * @param to
     * @param ignoreOnPopState
     */
    go(to: any, ignoreOnPopState?: any): void;
    /**
     * Entferne alle Einträge ab at (inklusive). Wenn at nicht gesetzt ist, wird alles über der aktuellen position abgeschnitten
     * @param at
     */
    cutStack(at: any): void;
    /**
     * Alias für this.go(-1)
     */
    back(): void;
    /**
     * Alias für this.go(1)
     */
    forward(): void;
    /**
     * Setzt den onPopStateListener
     *
     * @param listener
     */
    setOnPopStateListener(listener: any): void;
    /**
     * Singelton-Getter
     * @return {HistoryManager}
     */
    static getInstance(): HistoryManager;
}
