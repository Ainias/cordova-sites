import { AccordionRenderer } from "./AccordionRenderer";
/**
 * Erstellt ein Dropdown-Menu
 */
export declare class DropdownRenderer extends AccordionRenderer {
    private _accordionMenuRenderer;
    constructor(parentElement: any);
    /**
     * Rendert die SubmenuAction
     *
     * @param action
     * @returns {*}
     */
    renderSubmenuAction(action: any): Element;
    /**
     * Erstellt ein SubmenuParent
     *
     * @param action
     * @returns {HTMLUListElement}
     */
    createSubmenuParentElement(action: any): HTMLUListElement;
    /**
     * Updatet das Element für eine Action
     * @param action
     */
    updateAction(action: any): void;
}
