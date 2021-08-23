import { TemplateSite } from "./TemplateSite";
import { NavbarFragment } from "./Menu/NavbarFragment";
/**
 * Seite benutzt das menuTemplate, welches das ContainerTemplate includiert.
 *
 * Außerdem beinhaltet die MenuSite ein NavbarFragment, wo Menüelemente hinzugefügt werden können
 */
export declare class MenuSite extends TemplateSite {
    private readonly _navbarFragment;
    /**
     * Constructor für eine MenuSite
     *
     * @param siteManager
     * @param view
     * @param menuTemplate
     */
    constructor(siteManager: any, view: any, menuTemplate?: any);
    getNavbarFragment(): NavbarFragment<MenuSite>;
    /**
     * Während des onConstructs werden die Menüelemente hinzugefügt => aufrufen des onCreateMenu
     *
     * @param constructParameters
     * @returns {Promise<any[]>}
     */
    onConstruct(constructParameters: any): Promise<any[]>;
    onMenuPressed(): void;
    onViewLoaded(): Promise<any[]>;
    /**
     * Überschreibt updateTtle, um Element in der Statusbar zu setzen
     *
     * @protected
     */
    _updateTitle(): void;
    /**
     * Überschreiben durch Kinder-Klassen, um ein Menü zu erstellen
     *
     * @param {NavbarFragment} navbar
     */
    onCreateMenu(navbar: any): void;
}
