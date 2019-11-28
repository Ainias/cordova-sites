import {Helper} from "../../../Legacy/Helper";
import {OpenSubmenuAction} from "../MenuAction/OpenSubmenuAction";

/**
 * Rendert ein Menü
 */
export class MenuRenderer {
    private _parentElement: any;
    private _renderedElements: {};

    /**
     * Jeder Renderer hat ein Element, wo er die gerenderten Elemente hinzufügt
     *
     * @param parentElement
     */
    constructor(parentElement?) {

        this._parentElement = parentElement;
        this._renderedElements = {};
    }

    /**
     * Stößt das Rendern an
     * @param menu
     * @param parentElement
     */
    render(menu, parentElement) {

        let actions = menu.getActions();

        //Funktion wird auch für Submenüs genutzt. Daher muss hier ein anderes parentElement übergeben werden
        parentElement = Helper.nonNull(parentElement, this._parentElement);

        if (Helper.isNotNull(parentElement)) {
            Helper.removeAllChildren(parentElement);

            //Füge Elemente hinzu
            actions.forEach(action => {
                parentElement.appendChild(this.getElementForAction(action));
            });

            //Setze den onclick-Listener
            parentElement.onclick = (e) => {
                if (typeof menu.getOnClickListener() === 'function') {
                    menu.getOnClickListener()(e);
                }
            };
        }
    }

    /**
     * Führt das Rendern der Elemente aus und ersetzt evtl schon alte Elemente
     * Auslagern von renderAction und renderSubmenuAction zum besseren überschreiben der Funktionen.
     *
     * renderSubmenuAction und renderAction sollten nur von dieser Funktion aufgerufen werden, damit die
     * _rendererElements aktuell bleiben!
     *
     * @param action
     * @returns {HTMLElement}
     * @private
     */
    _triggerRenderAction(action) {
        let oldElement = this._renderedElements[action.getId()];
        if (action instanceof OpenSubmenuAction) {
            this._renderedElements[action.getId()] = this.renderSubmenuAction(action);
        } else {
            this._renderedElements[action.getId()] = this.renderAction(action);
        }
        this.updateAction(action);

        if (Helper.isNotNull(oldElement)) {
            oldElement.replaceWith(this._renderedElements[action.getId()]);
        }
        return this._renderedElements[action.getId()];
    }

    /**
     * Gibt das Element zur Action. Falls es noch nicht existiert, wird dieses gerendert
     * @param action
     * @returns {*}
     */
    getElementForAction(action) {
        if (Helper.isNull(this._renderedElements[action.getId()])) {
            this._triggerRenderAction(action);
        }
        return this._renderedElements[action.getId()];
    }

    /**
     * Funktion zum überladen
     * @param action
     */
    renderAction(action): Element {
        return null;
    }

    /**
     * Funktion zum überladen
     * @param action
     */
    updateAction(action){
    }

    /**
     * Rendert eine SubmenuAction, kann/sollte überladen werden
     * @param action
     * @returns {*}
     */
    renderSubmenuAction(action) {
        let actionElement = this.renderAction(action);

        action.getSubmenu().sortActions();
        let submenuParentElement = this.createSubmenuParentElement(action);
        this.render(action.getSubmenu(), submenuParentElement);

        actionElement.appendChild(submenuParentElement);

        return actionElement;
    };

    /**
     * Erstellt ein Element für ein Submenu. Sollte überladen werden
     * @param action
     * @returns {HTMLUListElement}
     */
    createSubmenuParentElement(action) {
        return document.createElement("ul");
    }
}