import { AbstractFragment } from "../AbstractFragment";
/**
 * Fragment, welches ein Menü in der Navbar anzeigt und hinzufügt.
 *
 * Technisch gesehen wird das gleiche Menü zwei mal gerendert und hinzugefügt. Einmal das Menü in der Navbar, welches
 * immer sichtbar ist und einmal das versteckte Menü, welches durch einen Toggle-Button angezeigt werden kann.
 * Dabei hat jede MenuAction eine Sichtbarkeitsklasse. Anhand der Sichtbarkeitsklasse und der Bildschirmgröße wird
 * entweder das eine oder das andere Element sichtbar, jedoch niemals beide.
 */
export declare class NavbarFragment extends AbstractFragment {
    static defaultActions: any;
    static title: string;
    _menu: any;
    _responsiveMenu: any;
    _backgroundImage: any;
    _menuActions: any;
    private _logo;
    private _scrollWidget;
    private _canGoBack;
    private _closeListenerContainer;
    private static queries;
    /**
     * Erstellt das Fragment
     * @param site
     * @param {string|Node|null} viewNavbar
     */
    constructor(site: any, viewNavbar?: any);
    setLogo(logo: any): void;
    setCanGoBack(canGoBack: any): void;
    setScrollWidget(scrollWidget: any): void;
    setBackgroundImage(backgroundImage: any): void;
    /**
     * Wird aufgerufen, sobald die View geladen ist
     * @returns {Promise<*>}
     */
    onViewLoaded(): Promise<any[]>;
    goBack(): void;
    /**
     * Jedes mal, wenn die Seite startet, update den toggleButton
     *
     * @param pauseArguments
     * @returns {Promise<void>}
     */
    onStart(pauseArguments: any): Promise<void>;
    _showCloseListener(): void;
    /**
     * Schließe das Menü
     */
    closeMenu(): void;
    /**
     * Öffne das Menü
     */
    openMenu(): void;
    /**
     * rendere das Menü
     */
    drawMenu(): void;
    /**
     * Update die Sichtbarkeit des MenüButtons für das "versteckte" Menü
     */
    updateToggleButton(): void;
    /**
     * Funktion zum hinzufügen von Actions
     * @param action
     */
    addAction(action: any): void;
    /**
     * Funktion zum hinzufügen von Actions
     * @param redraw
     */
    removeAllActions(redraw: any): void;
    /**
     * Updatet das Title-Element
     * @param titleElement
     */
    setTitleElement(titleElement: any): void;
    /**
     * Gibt die aktuelle Size zurück
     *
     * @returns {*}
     * @private
     */
    static _getCurrentSize(): any;
    /**
     * Gibt die ViewQueries zurück, triggert die Berechnung der ViewQueries, falls das noch nicht geschehen ist
     *
     * @returns {Array}
     * @private
     */
    static _getViewQueries(): any;
    /**
     * Berechnet die ViewQueries, bzw liest diese aus Foundation/CSS ein
     * Eine Veränderung der Werte in SASS, verändert daher auch hier die Werte
     *
     * @returns {*}
     * @private
     */
    static _calculateViewQueries(): any[];
}
