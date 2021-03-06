"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Submenu = void 0;
const Menu_1 = require("./Menu");
const Helper_1 = require("../../Legacy/Helper");
const OpenSubmenuAction_1 = require("./MenuAction/OpenSubmenuAction");
/**
 * Submenü, ein untermenü
 */
class Submenu extends Menu_1.Menu {
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
     * @param renderers
     */
    constructor(title, showFor, order, icon, renderers) {
        super(Helper_1.Helper.nonNull(renderers, []));
        this._parentAction = new OpenSubmenuAction_1.OpenSubmenuAction(title, this, showFor, order, icon);
        this._isOpen = false;
    }
    /**
     * Erstellt ein neues Menu auf grundlage dieses Menüs. Alle Actions & Submenüs werden ebenfalls kopiert
     *
     * @param menu
     * @return {Submenu}
     */
    copy(menu) {
        menu = Helper_1.Helper.nonNull(menu, new Submenu());
        menu = super.copy(menu);
        menu._isOpen = this._isOpen;
        return menu;
    }
    /**
     * Setzt die ParentAction
     *
     * @param action
     */
    setParentAction(action) {
        this._parentAction = action;
    }
    /**
     * Gibt das ParentMenu zurück
     */
    getParentMenu() {
        return this._parentAction.getMenu();
    }
    /**
     * Erstelle keinen onClickListener, damit der Listener aus dem Obermenü aufgerufen wird
     *
     * @returns {null}
     * @private
     */
    _generateOnClickListener() {
        return null;
    }
    /**
     * Wird vom Obermenü aufgerufen, um die ensprechende Action zu finden
     *
     * @param actionId
     * @param event
     * @returns {boolean}
     */
    click(actionId, event) {
        for (let i = 0, n = this._actions.length; i < n; i++) {
            if (this._actions[i].getId() === actionId) {
                if (typeof this._actions[i].getAction() === 'function' && this._actions[i].isActivated()) {
                    this._actions[i].getAction()(this._actions[i], event);
                    event.preventDefault();
                }
                if (!(this._actions[i] instanceof OpenSubmenuAction_1.OpenSubmenuAction)) {
                    this.close();
                }
                return this._actions[i];
            }
        }
        //Falls action nicht gefunden (da noch nicht beendet), suche in den submenüs nach der Action
        for (let i = 0, n = this._submenus.length; i < n; i++) {
            let action = this._submenus[i].click(actionId, event);
            if (action) {
                return action;
            }
        }
        return null;
    }
    /**
     * Öffnet oder schließt das Menü
     */
    toggle() {
        if (this._isOpen) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * öffnet das Menü und updatet die Elemente
     */
    open() {
        this._isOpen = true;
        this.openSubmenu(this);
        if (Helper_1.Helper.isNotNull(this._parentAction)) {
            this._parentAction.update();
        }
    }
    openSubmenu(submenu) {
        this.getParentMenu().openSubmenu(submenu);
    }
    /**
     * schließt das Menü und updatet die Elemente
     */
    close() {
        this._isOpen = false;
        super.close();
        if (Helper_1.Helper.isNotNull(this._parentAction)) {
            this._parentAction.update();
        }
    }
    /**
     * Gibt die ParentAction zurück
     *
     * @returns {OpenSubmenuAction}
     */
    getParentAction() {
        return this._parentAction;
    }
    /**
     * Updated eine Action. Da ein Submenu keine Renderer hat, muss es ans parentMenu weitergegeben werden
     * @param action
     */
    updateAction(action) {
        const parentMenu = this.getParentMenu();
        if (parentMenu) {
            parentMenu.updateAction(action);
        }
    }
    redrawAction(action) {
        const parentMenu = this.getParentMenu();
        if (parentMenu) {
            parentMenu.redrawAction(action);
        }
    }
    /**
     * Gibt an, ob das Submenu offen ist oder nicht
     *
     * @returns {boolean}
     */
    isOpen() {
        return this._isOpen;
    }
}
exports.Submenu = Submenu;
//# sourceMappingURL=Submenu.js.map