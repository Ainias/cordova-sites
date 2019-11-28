import {MenuAction} from "./MenuAction";
import {Helper} from "../../../Legacy/Helper";

/**
 * Action, welche ein Untermenü öffnet
 */
export class OpenSubmenuAction extends MenuAction {
    private _submenu: any;

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
    constructor(title, menu, showFor?, order?, icon?) {
        //Erstellt die action zum schließen/öffnen des Submenüs
        super(title, action => {
            action.getSubmenu().toggle();
            action.update();
        }, showFor, order, icon);

        this._submenu = menu;
        menu.setParentAction(this);
    }

    /**
     * Erstellt eine neue MenuAction auf grundlage dieser MenuAction. Alle Eigenschaften sind identisch, bis auf die ID
     * und das Submenu, welches ebenfalls kopiert wird
     *
     * @param action
     * @return {MenuAction}
     */
    copy(action){
        action = Helper.nonNull(action, new OpenSubmenuAction(null, this._submenu.copy()));
        action = super.copy(action);
        action._submenu.setParentAction(action);
        return action;
    }

    /**
     * Gibt das Submenu zurück
     *
     * @returns {*}
     */
    getSubmenu() {
        return this._submenu;
    }
}