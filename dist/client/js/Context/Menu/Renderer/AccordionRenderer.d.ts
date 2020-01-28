import { MenuRenderer } from "./MenuRenderer";
/**
 * Leitet von DropdownRenderer ab, da Funktionalität fast gleich ist
 */
export declare class AccordionRenderer extends MenuRenderer {
    /**
     * Rendert eine Action
     *
     * @param action
     * @returns {HTMLLIElement}
     */
    renderAction(action: any): HTMLLIElement;
    /**
     * Rendert das AnchorElement für eine Action
     * @param action
     * @returns {HTMLAnchorElement}
     */
    renderLinkElement(action: any): HTMLAnchorElement;
    /**
     * Render das LI-Element für eine Action
     *
     * @param action
     * @returns {HTMLLIElement}
     */
    renderLiElement(action: any): HTMLLIElement;
    /**
     * Da abgeleitet von DropdownRenderer, muss eine Klasse wieder entfernt werden
     *
     * @param action
     * @returns {*}
     */
    renderSubmenuAction(action: any): Element;
    /**
     * erstellt ein SubmenuParent für Accordion
     * @param action
     * @returns {HTMLUListElement}
     */
    createSubmenuParentElement(action: any): HTMLUListElement;
    /**
     * Updatet ein ActionElement
     * @param action
     */
    updateAction(action: any): void;
}
