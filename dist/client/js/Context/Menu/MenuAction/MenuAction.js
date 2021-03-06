"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuAction = void 0;
const Helper_1 = require("../../../Legacy/Helper");
/**
 * Container für verschiedene Eigenschaften
 */
class MenuAction {
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
    constructor(name, action, showFor, order, icon) {
        this._liClass = "";
        this._shouldTranslate = true;
        this._visible = true;
        this._activated = true;
        this._copies = [];
        this._menu = null;
        this._name = name;
        this._action = action;
        this._showFor = Helper_1.Helper.nonNull(showFor, MenuAction.SHOW_FOR_MEDIUM);
        this._order = Helper_1.Helper.nonNull(order, 1000);
        this._icon = icon;
        this._id = MenuAction.lastId++;
        this._liClass = "";
        this._shouldTranslate = true;
        this._visible = true;
        this._activated = true;
        this._menu = null;
        this._copies = [];
    }
    /**
     * Erstellt eine neue MenuAction auf grundlage dieser MenuAction. Alle Eigenschaften sind identisch, bis auf die ID
     *
     * @param action
     * @return {MenuAction}
     */
    copy(action) {
        let copiedAction = Helper_1.Helper.nonNull(action, new MenuAction());
        copiedAction._name = this._name;
        copiedAction._action = this._action;
        copiedAction._showFor = this._showFor;
        copiedAction._order = this._order;
        copiedAction._liClass = this._liClass;
        copiedAction._shouldTranslate = this._shouldTranslate;
        copiedAction._visible = this._visible;
        copiedAction._activated = this._activated;
        copiedAction._icon = this._icon;
        copiedAction._id = MenuAction.lastId++;
        this._copies.push(copiedAction);
        return copiedAction;
        // return new MenuActionSlave(this);
    }
    // _triggerCopies(fn, args){
    //     this._copies.forEach(copy => {
    //         copy[fn].apply(copy, args);
    //     })
    // }
    /**
     * Sorgt dafür, dass die Action neu gezeichnet wird
     */
    redraw() {
        if (Helper_1.Helper.isNotNull(this._menu)) {
            this._menu.redrawAction(this);
        }
        this._copies.forEach(copy => copy.redraw());
    }
    /**
     * Sorgt dafür, dass die ActionElemente geupdatet wird
     */
    update() {
        this._menu.updateAction(this);
        this._copies.forEach(copy => copy.update());
    }
    /**
     * Gibt die Order der MenuAction zurück. Die Order bestimmt die Reihenfolge in der die Elemente angezeigt werden.
     * Je kleiner die Order, desto weiter rechts/oben werden diese angezeigt
     *
     * @returns {*}
     */
    getOrder() {
        return this._order;
    }
    /**
     * Gibt zurück, ob die MenuAction aktiv ist
     *
     * @returns {boolean}
     */
    isActivated() {
        return this._activated;
    }
    /**
     * Gibt an, ob der Name übersetzt werden soll
     *
     * @returns {boolean}
     */
    isShouldTranslate() {
        return this._shouldTranslate;
    }
    setShouldTranslate(shouldTranslate) {
        this._shouldTranslate = (shouldTranslate === true);
        this.redraw();
    }
    setVisibility(visibility) {
        this._visible = visibility;
        this.redraw();
        this._copies.forEach(copy => copy.setVisibility(visibility));
    }
    /**
     * Gibt an, ob die MenuAction sichtbar ist
     *
     * @returns {boolean}
     */
    isVisible() {
        return this._visible;
    }
    /**
     * Gibt den Namen zurück
     *
     * @returns {*}
     */
    getName() {
        return this._name;
    }
    setName(name) {
        this._name = name;
        this.redraw();
    }
    /**
     * Gibt die Action, welche beim Click ausgeführt werden soll zurück
     * @returns {string|function}
     */
    getAction() {
        return this._action;
    }
    /**
     * Gibt die ID der MenuAction zurück
     * @returns {number}
     */
    getId() {
        return this._id;
    }
    /**
     * Gibt das Icon der MenuAction zurück
     * @returns {string|null}
     */
    getIcon() {
        return this._icon;
    }
    setIcon(icon) {
        this._icon = icon;
        this.redraw();
    }
    /**
     * Gibt die View-Klasse der Action zurück
     * @returns {string}
     */
    getShowFor() {
        return this._showFor;
    }
    /**
     * Gibt eine odder mehrere extra Klasse zurück, die dem li-Element der Action hinzugefügt werden kann
     * @returns {string}
     */
    getLiClass() {
        return this._liClass;
    }
    setLiClass(cssClass) {
        this._liClass = cssClass;
        this._copies.forEach(c => c.setLiClass(cssClass));
        this.redraw();
    }
    /**
     * Gibt das zugehörige Menu zurück
     *
     * @returns {null}
     */
    getMenu() {
        return this._menu;
    }
    /**
     * Setzt das zugehörige Menu
     *
     * @param menu
     */
    setMenu(menu) {
        this._menu = menu;
    }
}
exports.MenuAction = MenuAction;
/**
 * Letzte ID, die vergeben wurde. Wird beim Erstellen einer Acton um eins erhöht
 * @type {number}
 */
MenuAction.lastId = 0;
/**
 * Die SHOW_ALWAYS-Visibility-Klasse
 * Das Element wird bei jeder Größe in der NavBar angezeigt
 *
 * @type {string}
 */
MenuAction.SHOW_ALWAYS = "always";
/**
 * Die SHOW_FOR_SMEDIUM-Visibility-Klasse
 * Das Element wird in der NavBar angezeigt, wenn der Bildschirm mindestens die Größe "SMedium" (zwischen Small und Medium) hat
 *
 * @type {string}
 */
MenuAction.SHOW_FOR_SMEDIUM = "smedium";
/**
 * Die SHOW_FOR_MEDIUM-Visibility-Klasse
 * Das Element wird in der NavBar angezeigt, wenn der Bildschirm mindestens die Größe "Medium" hat
 *
 * @type {string}
 */
MenuAction.SHOW_FOR_MEDIUM = "medium";
/**
 * Die SHOW_FOR_LARGE-Visibility-Klasse
 * Das Element wird in der NavBar angezeigt, wenn der Bildschirm mindestens die Größe "Large" hat
 *
 * @type {string}
 */
MenuAction.SHOW_FOR_LARGE = "large";
/**
 * Die SHOW_FOR_MEDIUM-Visibility-Klasse
 * Das Element wird nie in der NavBar angezeigt, sondern immer nur im aufklapbaren Menu
 *
 * @type {string}
 */
MenuAction.SHOW_NEVER = "never";
//# sourceMappingURL=MenuAction.js.map