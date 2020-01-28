import { MenuAction } from "./MenuAction";
/**
 * Action, welche ein Untermenü öffnet
 */
export declare class OpenSubmenuAction extends MenuAction {
    private _submenu;
    /**
     * Bekommt ein submenu anstelle einer Action übergeben.
     * Erstellt automatisch die action zum öffnen/schließen des Menüs
     *
     * @param title
     * @param menu
     * @param showFor
     * @param order
     * @param icon
     */
    constructor(title: any, menu: any, showFor?: any, order?: any, icon?: any);
    /**
     * Erstellt eine neue MenuAction auf grundlage dieser MenuAction. Alle Eigenschaften sind identisch, bis auf die ID
     * und das Submenu, welches ebenfalls kopiert wird
     *
     * @param action
     * @return {MenuAction}
     */
    copy(action: any): any;
    /**
     * Gibt das Submenu zurück
     *
     * @returns {*}
     */
    getSubmenu(): any;
}
