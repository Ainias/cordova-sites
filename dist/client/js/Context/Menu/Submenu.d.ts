import { Menu } from "./Menu";
import { OpenSubmenuAction } from "./MenuAction/OpenSubmenuAction";
/**
 * Submenü, ein untermenü
 */
export declare class Submenu extends Menu {
    private _parentAction;
    private _isOpen;
    /**
     * Constructor für ein Submenu
     *
     * Bekommt parameter für die OpenSubmenuAction übergeben und reicht diese weiter.
     * Renderer besitzt das Menü keine, da die Renderer des ParentMenus genutzt werden
     * Actions können nicht bei der Erstellung hinzugefügt werden
     *
     * @param title
     * @param showFor
     * @param order
     * @param icon
     */
    constructor(title?: any, showFor?: any, order?: any, icon?: any);
    /**
     * Erstellt ein neues Menu auf grundlage dieses Menüs. Alle Actions & Submenüs werden ebenfalls kopiert
     *
     * @param menu
     * @return {Submenu}
     */
    copy(menu: any): any;
    /**
     * Setzt die ParentAction
     *
     * @param action
     */
    setParentAction(action: any): void;
    /**
     * Gibt das ParentMenu zurück
     */
    getParentMenu(): any;
    /**
     * Erstelle keinen onClickListener, damit der Listener aus dem Obermenü aufgerufen wird
     *
     * @returns {null}
     * @private
     */
    _generateOnClickListener(): any;
    /**
     * Wird vom Obermenü aufgerufen, um die ensprechende Action zu finden
     *
     * @param actionId
     * @param event
     * @returns {boolean}
     */
    click(actionId: any, event: any): any;
    /**
     * Öffnet oder schließt das Menü
     */
    toggle(): void;
    /**
     * öffnet das Menü und updatet die Elemente
     */
    open(): void;
    openSubmenu(submenu: any): void;
    /**
     * schließt das Menü und updatet die Elemente
     */
    close(): void;
    /**
     * Gibt die ParentAction zurück
     *
     * @returns {OpenSubmenuAction}
     */
    getParentAction(): OpenSubmenuAction;
    /**
     * Updated eine Action. Da ein Submenu keine Renderer hat, muss es ans parentMenu weitergegeben werden
     * @param action
     */
    updateAction(action: any): void;
    /**
     * Gibt an, ob das Submenu offen ist oder nicht
     *
     * @returns {boolean}
     */
    isOpen(): boolean;
}
