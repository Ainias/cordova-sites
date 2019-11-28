import {OpenSubmenuAction} from "../MenuAction/OpenSubmenuAction";
import {MenuRenderer} from "./MenuRenderer";
import {Helper} from "../../../Legacy/Helper";
import {Translator} from "../../../Translator";

/**
 * Leitet von DropdownRenderer ab, da Funktionalität fast gleich ist
 */
export class AccordionRenderer extends MenuRenderer{

    /**
     * Rendert eine Action
     *
     * @param action
     * @returns {HTMLLIElement}
     */
    renderAction(action) {
        let linkElement = this.renderLinkElement(action);
        let liElement = this.renderLiElement(action);

        liElement.insertBefore(linkElement, liElement.firstChild);
        return liElement;
    }

    /**
     * Rendert das AnchorElement für eine Action
     * @param action
     * @returns {HTMLAnchorElement}
     */
    renderLinkElement(action) {
        let aElement = document.createElement("a");
        if (typeof action.getAction() === 'string') {
            aElement.href = action.getAction();
        }

        if (Helper.isNotNull(action.getIcon())) {
            let iconElement = document.createElement("img");
            iconElement.src = action.getIcon();
            iconElement.classList.add('action-image');
            if (action.isShouldTranslate()) {
                iconElement.dataset["translationTitle"] = action.getName();
                iconElement.classList.add((<Translator>Translator.getInstance()).getTranslationClass());
            } else {
                iconElement.title = action.getName();
            }
            aElement.appendChild(iconElement);
        }
        let name = action.getName();
        // debugger;
        if (action.isShouldTranslate()) {
            name = Translator.makePersistentTranslation(name);
        } else {
            name = document.createTextNode(name);
        }
        aElement.appendChild(name);
        return aElement;
    }

    /**
     * Render das LI-Element für eine Action
     *
     * @param action
     * @returns {HTMLLIElement}
     */
    renderLiElement(action) {
        let liElement = document.createElement("li");

        if (action.getLiClass().trim() !== "") {
            liElement.classList.add(action.getLiClass());
        }
        // liElement.appendChild(aElement);
        liElement.dataset["id"] = action.getId();

        if (Helper.isNotNull(action.getIcon())) {
            liElement.classList.add("img");
        }

        if (!action.isVisible()) {
            liElement.classList.add("hidden");
        }

        liElement.classList.add(action.getShowFor());

        return liElement;
    }

    /**
     * Da abgeleitet von DropdownRenderer, muss eine Klasse wieder entfernt werden
     *
     * @param action
     * @returns {*}
     */
    renderSubmenuAction(action) {
        let submenuActionElement = super.renderSubmenuAction(action);
        submenuActionElement.classList.remove('is-dropdown-submenu-parent');
        submenuActionElement.classList.add('is-accordion-submenu-parent');
        return submenuActionElement;
    }

    /**
     * erstellt ein SubmenuParent für Accordion
     * @param action
     * @returns {HTMLUListElement}
     */
    createSubmenuParentElement(action) {
        let menuElement = document.createElement("ul");
        menuElement.classList.add("menu");
        menuElement.classList.add("vertical");
        menuElement.classList.add("submenu");
        menuElement.classList.add("accordion-menu");
        menuElement.classList.add("is-accordion-submenu");
        menuElement.classList.add("first-sub");

        return menuElement;
    }

    /**
     * Updatet ein ActionElement
     * @param action
     */
    updateAction(action) {
        if (action instanceof OpenSubmenuAction){
            let submenuElement = this.getElementForAction(action).querySelector(".submenu");
            if (action.getSubmenu().isOpen()) {
                this.getElementForAction(action).setAttribute("aria-expanded", true);
                submenuElement.classList.add("js-active");
                submenuElement.style="";
            }
            else{
                this.getElementForAction(action).removeAttribute("aria-expanded");
                submenuElement.classList.remove("js-activ");
                submenuElement.style="display:none;";
            }
        }
    }
}