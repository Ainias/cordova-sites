"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    // /**
    //  * Rendert eine Action
    //  *
    //  * @param action
    //  * @returns {HTMLLIElement}
    //  */
    // renderAction(action) {
    //     let linkElement = this.renderLinkElement(action);
    //     let liElement = this.renderLiElement(action);
    //
    //     liElement.insertBefore(linkElement, liElement.firstChild);
    //     return liElement;
    // }
    //
    // /**
    //  * Rendert das AnchorElement für eine Action
    //  * @param action
    //  * @returns {HTMLAnchorElement}
    //  */
    // renderLinkElement(action) {
    //     let aElement = document.createElement("a");
    //     if (typeof action.getAction() === 'string') {
    //         aElement.href = action.getAction();
    //     }
    //
    //     if (Helper.isNotNull(action.getIcon())) {
    //         let iconElement = document.createElement("img");
    //         iconElement.src = action.getIcon();
    //         iconElement.classList.add('action-image');
    //         if (action.isShouldTranslate()) {
    //             iconElement.dataset["translationTitle"] = action.getName();
    //             iconElement.classList.add(Translator.getInstance().getTranslationClass());
    //         } else {
    //             iconElement.title = action.getName();
    //         }
    //         aElement.appendChild(iconElement);
    //     }
    //     let name = action.getName();
    //     // debugger;
    //     if (action.isShouldTranslate()) {
    //         name = Translator.makePersistentTranslation(name);
    //     } else {
    //         name = document.createTextNode(name);
    //     }
    //     aElement.appendChild(name);
    //     return aElement;
    // }
    //
    // /**
    //  * Render das LI-Element für eine Action
    //  *
    //  * @param action
    //  * @returns {HTMLLIElement}
    //  */
    // renderLiElement(action) {
    //     let liElement = document.createElement("li");
    //
    //     if (action.getLiClass().trim() !== "") {
    //         liElement.classList.add(action.getLiClass());
    //     }
    //     // liElement.appendChild(aElement);
    //     liElement.dataset["id"] = action.getId();
    //
    //     if (Helper.isNotNull(action.getIcon())) {
    //         liElement.classList.add("img");
    //     }
    //
    //     if (!action.isVisible()) {
    //         liElement.classList.add("hidden");
    //     }
    //
    //     liElement.classList.add(action.getShowFor());
    //
    //     return liElement;
    // }
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