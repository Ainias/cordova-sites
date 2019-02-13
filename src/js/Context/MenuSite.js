import {TemplateSite} from "./TemplateSite";
import menuTemplate from "../../html/siteTemplates/menuSite.html";
import {NavbarFragment} from "./Menu/NavbarFragment";
import {Context} from "./Context";

/**
 * Seite benutzt das menuTemplate, welches das ContainerTemplate includiert.
 *
 * Außerdem beinhaltet die MenuSite ein NavbarFragment, wo Menüelemente hinzugefügt werden können
 */
export class MenuSite extends TemplateSite{

    /**
     * Constructor für eine MenuSite
     *
     * @param siteManager
     * @param view
     */
    constructor(siteManager, view) {
        super(siteManager, view, menuTemplate, "#site-content");
        this._navbarFragment = new NavbarFragment(this);
        this.addFragment("#navbar-fragment", this._navbarFragment);
    }

    /**
     * Während des onConstructs werden die Menüelemente hinzugefügt => aufrufen des onCreateMenu
     *
     * @param constructParameters
     * @returns {Promise<any[]>}
     */
    async onConstruct(constructParameters) {
        let res = await super.onConstruct(constructParameters);
        this.onCreateMenu(this._navbarFragment);
        return res;
    }

    onMenuPressed() {
        this._navbarFragment.openMenu();
    }

    /**
     * Überschreibt updateTtle, um Element in der Statusbar zu setzen
     *
     * @protected
     */
    _updateTitle() {
        super._updateTitle();
        if (this._title.element && this._state === Context.STATE_RUNNING){
            this._navbarFragment.setTitleElement(this._title.element);
        }
    }

    /**
     * Überschreiben durch Kinder-Klassen, um ein Menü zu erstellen
     *
     * @param {NavbarFragment} navbar
     */
    onCreateMenu(navbar){}
}