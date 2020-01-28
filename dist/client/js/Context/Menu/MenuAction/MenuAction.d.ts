/**
 * Container für verschiedene Eigenschaften
 */
export declare class MenuAction {
    _name: any;
    _action: any;
    _showFor: any;
    _order: any;
    _icon: any;
    _id: any;
    _liClass: string;
    _shouldTranslate: boolean;
    _visible: boolean;
    _activated: boolean;
    _copies: any[];
    _menu: any;
    /**
     * Letzte ID, die vergeben wurde. Wird beim Erstellen einer Acton um eins erhöht
     * @type {number}
     */
    private static lastId;
    static SHOW_ALWAYS: string;
    static SHOW_NEVER: string;
    static SHOW_FOR_SMEDIUM: string;
    static SHOW_FOR_MEDIUM: string;
    static SHOW_FOR_LARGE: string;
    /**
     * Erstellt eine MenuAction.
     * Außer name und action ist alles mit Default-werten vorbelegt
     *
     * @param name
     * @param action
     * @param showFor
     * @param order
     * @param icon
     */
    constructor(name?: any, action?: any, showFor?: any, order?: any, icon?: any);
    /**
     * Erstellt eine neue MenuAction auf grundlage dieser MenuAction. Alle Eigenschaften sind identisch, bis auf die ID
     *
     * @param action
     * @return {MenuAction}
     */
    copy(action: any): any;
    /**
     * Sorgt dafür, dass die Action neu gezeichnet wird
     */
    redraw(): void;
    /**
     * Sorgt dafür, dass die ActionElemente geupdatet wird
     */
    update(): void;
    /**
     * Gibt die Order der MenuAction zurück. Die Order bestimmt die Reihenfolge in der die Elemente angezeigt werden.
     * Je kleiner die Order, desto weiter rechts/oben werden diese angezeigt
     *
     * @returns {*}
     */
    getOrder(): any;
    /**
     * Gibt zurück, ob die MenuAction aktiv ist
     *
     * @returns {boolean}
     */
    isActivated(): boolean;
    /**
     * Gibt an, ob der Name übersetzt werden soll
     *
     * @returns {boolean}
     */
    isShouldTranslate(): boolean;
    setVisibility(visibility: any): void;
    /**
     * Gibt an, ob die MenuAction sichtbar ist
     *
     * @returns {boolean}
     */
    isVisible(): boolean;
    /**
     * Gibt den Namen zurück
     *
     * @returns {*}
     */
    getName(): any;
    /**
     * Gibt die Action, welche beim Click ausgeführt werden soll zurück
     * @returns {string|function}
     */
    getAction(): any;
    /**
     * Gibt die ID der MenuAction zurück
     * @returns {number}
     */
    getId(): any;
    /**
     * Gibt das Icon der MenuAction zurück
     * @returns {string|null}
     */
    getIcon(): any;
    /**
     * Gibt die View-Klasse der Action zurück
     * @returns {string}
     */
    getShowFor(): any;
    /**
     * Gibt eine odder mehrere extra Klasse zurück, die dem li-Element der Action hinzugefügt werden kann
     * @returns {string}
     */
    getLiClass(): string;
    /**
     * Gibt das zugehörige Menu zurück
     *
     * @returns {null}
     */
    getMenu(): any;
    /**
     * Setzt das zugehörige Menu
     *
     * @param menu
     */
    setMenu(menu: any): void;
}
