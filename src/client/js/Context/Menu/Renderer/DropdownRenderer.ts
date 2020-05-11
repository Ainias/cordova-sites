import {Helper} from "../../../Legacy/Helper";
import {Translator} from "../../../Translator";
import {OpenSubmenuAction} from "../MenuAction/OpenSubmenuAction";
import {AccordionRenderer} from "./AccordionRenderer";
import {Submenu} from "../Submenu";

/**
 * Erstellt ein Dropdown-Menu
 */
export class DropdownRenderer extends AccordionRenderer {
    private _accordionMenuRenderer: AccordionRenderer;

    constructor(parentElement) {
        super(parentElement);
        this._accordionMenuRenderer = new AccordionRenderer();
    }

    /**
     * Rendert die SubmenuAction
     *
     * @param action
     * @returns {*}
     */
    renderSubmenuAction(action) {
        if (action.getMenu() instanceof Submenu){
            return super.renderSubmenuAction(action);
        }

        let submenuActionElement = super.renderSubmenuAction(action);
        submenuActionElement.classList.add('is-dropdown-submenu-parent');
        submenuActionElement.classList.add('opens-right');

        return submenuActionElement;
    }

    /**
     * Erstellt ein SubmenuParent
     *
     * @param action
     * @returns {HTMLUListElement}
     */
    createSubmenuParentElement(action) {
        if (action.getMenu() instanceof Submenu){
            return super.createSubmenuParentElement(action);
        }

        let menuElement = document.createElement("ul");
        menuElement.classList.add("menu");
        menuElement.classList.add("vertical");
        menuElement.classList.add("submenu");
        menuElement.classList.add("accordion-menu");
        menuElement.classList.add("is-dropdown-submenu");
        menuElement.classList.add("first-sub");

        return menuElement;
    }

    /**
     * Updatet das Element für eine Action
     * @param action
     */
    updateAction(action) {
        if (action.getMenu() instanceof Submenu){
            return super.updateAction(action);
        }

        if (action instanceof OpenSubmenuAction){
            let submenuElement = this.getElementForAction(action).querySelector(".submenu");
            if (action.getSubmenu().isOpen()) {
                submenuElement.classList.add("js-dropdown-active");
            }
            else{
                submenuElement.classList.remove("js-dropdown-active");
            }
        }
    }
}