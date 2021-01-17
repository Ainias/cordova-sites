import {TemplateSite} from "./TemplateSite";
const defaultMenuTemplate = require("../../html/siteTemplates/menuSite.html");
import {NavbarFragment} from "./Menu/NavbarFragment";
import {Context} from "./Context";
import {Helper} from "../Legacy/Helper";

/**
 * Seite benutzt das menuTemplate, welches das ContainerTemplate includiert.
 *
 * Außerdem beinhaltet die MenuSite ein NavbarFragment, wo Menüelemente hinzugefügt werden können
 */
export class MenuSite extends TemplateSite {
    private readonly _navbarFragment: NavbarFragment;

    /**
     * Constructor für eine MenuSite
     *
     * @param siteManager
     * @param view
     * @param menuTemplate
     */
    constructor(siteManager, view, menuTemplate?) {
        super(siteManager, view, Helper.nonNull(menuTemplate, defaultMenuTemplate), "#site-content");
        this._navbarFragment = new NavbarFragment(this);
        this.addFragment("#navbar-fragment", this._navbarFragment);
    }

    getNavbarFragment(){
        return this._navbarFragment;
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


    async onViewLoaded() {
        let res = super.onViewLoaded();
        this._navbarFragment.setScrollWidget(this.findBy("#main-content-container"));
        return res;
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
