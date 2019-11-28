import {Helper} from "../../Legacy/Helper";
import {MenuAction} from "./MenuAction/MenuAction";
import {OpenSubmenuAction} from "./MenuAction/OpenSubmenuAction";

/**
 * Klasse für ein Menü, was im Prinzip nichts anderes als eine Collection für MenuActions ist
 * Ein Menü hat einen oder mehrere Renderer, die für die Anzeige zuständig sind
 */
export class Menu {
    protected _actions: any[];
    protected _renderers: any[];
    protected _submenus: any[];
    protected _onClickListener: (event) => (any | null);
    protected _openSubmenuListener: any;

    /**
     * Setzt die Renderer und die initialen Actions
     *
     * @param renderer
     * @param actions
     */
    constructor(renderer?, actions?) {
        this._actions = [];
        this._renderers = [];
        this._submenus = [];

        if (Array.isArray(renderer)) {
            this._renderers = renderer;
        } else {
            this._renderers = [renderer];
        }

        //Initialisiert onClickListener
        this._onClickListener = this._generateOnClickListener();

        //Setze die Actions so, um einzelne Actions noch zu überprüfen
        Helper.nonNull(actions, []).forEach(action => {
            this.addAction(action, false);
        });

        this._openSubmenuListener = null;
    }

    /**
     * Erstellt ein neues Menu auf grundlage dieses Menüs. Alle Actions & Submenüs werden ebenfalls kopiert
     * @param menu
     * @return {Menu}
     */
    copy(menu) {
        menu = Helper.nonNull(menu, new Menu());
        menu._actions = [];
        this._actions.forEach(action => {
            menu.addAction(action.copy());
        });
        menu._renderers = this._renderers;
        menu._onClickListener = this._onClickListener;

        return menu;
    }

    /**
     * Schließt das Menü, hauptsächlich hier zum Schließen der Submenüs.
     * Zum öffnen wird nicht so eine Funktion gebraucht, da beim öffnen nicht die untermenüs geöffnet werden sollen
     */
    close() {
        this._submenus.forEach(submenu => {
            submenu.close();
        })
    }

    /**
     * Fügt eine Action dem Menü hinzu
     *
     * @param action
     * @param redraw
     */
    addAction(action, redraw) {
        //Überprüfung, ob es die richtige Klasse ist und ob die Action nicht schon hinzugefügt wurde
        if (action instanceof MenuAction && this._actions.indexOf(action) === -1) {

            //Falls es sich um ein Submenu handelt, füge dieses hinzu
            if (action instanceof OpenSubmenuAction) {
                this._submenus.push(action.getSubmenu());
            }

            this._actions.push(action);
            action.setMenu(this);

            //Falls redraw true (oder nicht angegeben, redraw)
            if (Helper.nonNull(redraw, true)) {
                this.redraw();
            }
        }
    }

    /**
     * Sortiert die Actions und sagt danach den Renderern, dass diese das Menü zeuchnen sollen
     */
    draw() {
        try {
            this.sortActions();
            this._renderers.forEach(renderer => {
                renderer.render(this);
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Sortiert die Actions der Order nach
     */
    sortActions() {
        this._actions = this._actions.sort(function (first, second) {
            return first.getOrder() - second.getOrder();
        });
    }

    openSubmenu(submenu) {
        if (this._openSubmenuListener) {
            this._openSubmenuListener(submenu);
        }
    }

    setOpenSubmenuListener(listener) {
        this._openSubmenuListener = listener;
    }

    /**
     * Generiert den defaultmäßigen onclick-listener.
     * @returns {Function}
     * @private
     */
    _generateOnClickListener() {
        return (event) => {
            let _element = event.target;

            //Falls es eine Action oder ein Unterlement einer Action war...
            if (_element.matches('li') || _element.matches('li *')) {
                //...finde das zugehörige Element und lese ID aus
                _element = _element.closest("li");
                let actionId = parseInt(_element.dataset["id"]);

                //Schaue nach, welche Action angeklickt wurde
                for (let i = 0, n = this._actions.length; i < n; i++) {
                    if (this._actions[i].getId() === actionId) {
                        //Falls action eine Funktion (und kein Link), sowie aktiv ist, führe action aus
                        if (typeof this._actions[i].getAction() === 'function' && this._actions[i].isActivated()) {
                            this._actions[i].getAction()(this._actions[i], event);
                            event.preventDefault();
                        }
                        //Gebe gefundene Action zurück
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
            }
            return null;
        };
    }

    /**
     * Setzt den OnClickListener
     *
     * @param listener
     */
    setOnClickListener(listener) {
        this._onClickListener = listener;
    }

    /**
     * Gibt den OnClickListener zurück
     *
     * @returns {*}
     */
    getOnClickListener() {
        return this._onClickListener;
    }

    /**
     * Gibt die Actions zurück
     * @returns {Array}
     */
    getActions() {
        return this._actions;
    }

    /**
     * Triggert ein neues Rendern für eine Action. Das entsprechende ActionElement wird ausgetauscht
     * @param action
     */
    redrawAction(action) {
        this._renderers.forEach(renderer => {
            renderer._triggerRenderAction(action);
        });
    }

    /**
     * Updated das entsprechende ActionElement abhängig vom Renderer. Das Element wird nicht ausgetauscht
     * @param action
     */
    updateAction(action) {
        this._renderers.forEach(renderer => {
            renderer.updateAction(action);
        });
    }

    /**
     * alias für draw
     */
    redraw() {
        this.draw();
    }
}