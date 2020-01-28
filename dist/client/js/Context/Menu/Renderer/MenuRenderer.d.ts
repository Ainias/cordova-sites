/**
 * Rendert ein Menü
 */
export declare class MenuRenderer {
    private _parentElement;
    private _renderedElements;
    /**
     * Jeder Renderer hat ein Element, wo er die gerenderten Elemente hinzufügt
     *
     * @param parentElement
     */
    constructor(parentElement?: any);
    /**
     * Stößt das Rendern an
     * @param menu
     * @param parentElement
     */
    render(menu: any, parentElement: any): void;
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
    _triggerRenderAction(action: any): any;
    /**
     * Gibt das Element zur Action. Falls es noch nicht existiert, wird dieses gerendert
     * @param action
     * @returns {*}
     */
    getElementForAction(action: any): any;
    /**
     * Funktion zum überladen
     * @param action
     */
    renderAction(action: any): Element;
    /**
     * Funktion zum überladen
     * @param action
     */
    updateAction(action: any): void;
    /**
     * Rendert eine SubmenuAction, kann/sollte überladen werden
     * @param action
     * @returns {*}
     */
    renderSubmenuAction(action: any): Element;
    /**
     * Erstellt ein Element für ein Submenu. Sollte überladen werden
     * @param action
     * @returns {HTMLUListElement}
     */
    createSubmenuParentElement(action: any): HTMLUListElement;
}
