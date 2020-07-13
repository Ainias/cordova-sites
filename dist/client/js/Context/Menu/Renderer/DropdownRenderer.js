"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownRenderer = void 0;
const OpenSubmenuAction_1 = require("../MenuAction/OpenSubmenuAction");
const AccordionRenderer_1 = require("./AccordionRenderer");
const Submenu_1 = require("../Submenu");
/**
 * Erstellt ein Dropdown-Menu
 */
class DropdownRenderer extends AccordionRenderer_1.AccordionRenderer {
    constructor(parentElement) {
        super(parentElement);
        this._accordionMenuRenderer = new AccordionRenderer_1.AccordionRenderer();
    }
    /**
     * Rendert die SubmenuAction
     *
     * @param action
     * @returns {*}
     */
    renderSubmenuAction(action) {
        if (action.getMenu() instanceof Submenu_1.Submenu) {
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
        if (action.getMenu() instanceof Submenu_1.Submenu) {
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
        if (action.getMenu() instanceof Submenu_1.Submenu) {
            return super.updateAction(action);
        }
        if (action instanceof OpenSubmenuAction_1.OpenSubmenuAction) {
            let submenuElement = this.getElementForAction(action).querySelector(".submenu");
            if (action.getSubmenu().isOpen()) {
                submenuElement.classList.add("js-dropdown-active");
            }
            else {
                submenuElement.classList.remove("js-dropdown-active");
            }
        }
    }
}
exports.DropdownRenderer = DropdownRenderer;
//# sourceMappingURL=DropdownRenderer.js.map