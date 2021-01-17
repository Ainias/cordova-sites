/**
 * Klasse für ein Menü, was im Prinzip nichts anderes als eine Collection für MenuActions ist
 * Ein Menü hat einen oder mehrere Renderer, die für die Anzeige zuständig sind
 */
export declare class Menu {
    protected _actions: any[];
    protected _renderers: any[];
    protected _submenus: any[];
    protected _onClickListener: (event: any) => (any | null);
    protected _openSubmenuListener: any;
    /**
     * Setzt die Renderer und die initialen Actions
     *
     * @param renderer
     * @param actions
     */
    constructor(renderer?: any, actions?: any);
    /**
     * Erstellt ein neues Menu auf grundlage dieses Menüs. Alle Actions & Submenüs werden ebenfalls kopiert
     * @param menu
     * @return {Menu}
     */
    copy(menu: any): any;
    /**
     * Schließt das Menü, hauptsächlich hier zum Schließen der Submenüs.
     * Zum öffnen wird nicht so eine Funktion gebraucht, da beim öffnen nicht die untermenüs geöffnet werden sollen
     */
    close(): void;
    /**
     * Fügt eine Action dem Menü hinzu
     *
     * @param action
     * @param redraw
     */
    addAction(action: any, redraw?: any): void;
    removeAllActions(redraw: any): void;
    /**
     * Sortiert die Actions und sagt danach den Renderern, dass diese das Menü zeuchnen sollen
     */
    draw(): void;
    /**
     * Sortiert die Actions der Order nach
     */
    sortActions(): void;
    openSubmenu(submenu: any): void;
    setOpenSubmenuListener(listener: any): void;
    /**
     * Generiert den defaultmäßigen onclick-listener.
     * @returns {Function}
     * @private
     */
    _generateOnClickListener(): (event: any) => any;
    /**
     * Setzt den OnClickListener
     *
     * @param listener
     */
    setOnClickListener(listener: any): void;
    /**
     * Gibt den OnClickListener zurück
     *
     * @returns {*}
     */
    getOnClickListener(): (event: any) => any;
    /**
     * Gibt die Actions zurück
     * @returns {Array}
     */
    getActions(): any[];
    /**
     * Triggert ein neues Rendern für eine Action. Das entsprechende ActionElement wird ausgetauscht
     * @param action
     */
    redrawAction(action: any): void;
    /**
     * Updated das entsprechende ActionElement abhängig vom Renderer. Das Element wird nicht ausgetauscht
     * @param action
     */
    updateAction(action: any): void;
    /**
     * alias für draw
     */
    redraw(): void;
}
