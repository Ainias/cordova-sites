"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TemplateSite_1 = require("./TemplateSite");
const defaultMenuTemplate = require("../../html/siteTemplates/menuSite.html");
const NavbarFragment_1 = require("./Menu/NavbarFragment");
const Context_1 = require("./Context");
const Helper_1 = require("../Legacy/Helper");
/**
 * Seite benutzt das menuTemplate, welches das ContainerTemplate includiert.
 *
 * Außerdem beinhaltet die MenuSite ein NavbarFragment, wo Menüelemente hinzugefügt werden können
 */
class MenuSite extends TemplateSite_1.TemplateSite {
    /**
     * Constructor für eine MenuSite
     *
     * @param siteManager
     * @param view
     * @param menuTemplate
     */
    constructor(siteManager, view, menuTemplate) {
        super(siteManager, view, Helper_1.Helper.nonNull(menuTemplate, defaultMenuTemplate), "#site-content");
        this._navbarFragment = new NavbarFragment_1.NavbarFragment(this);
        this.addFragment("#navbar-fragment", this._navbarFragment);
    }
    /**
     * Während des onConstructs werden die Menüelemente hinzugefügt => aufrufen des onCreateMenu
     *
     * @param constructParameters
     * @returns {Promise<any[]>}
     */
    onConstruct(constructParameters) {
        const _super = Object.create(null, {
            onConstruct: { get: () => super.onConstruct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield _super.onConstruct.call(this, constructParameters);
            this.onCreateMenu(this._navbarFragment);
            return res;
        });
    }
    onMenuPressed() {
        this._navbarFragment.openMenu();
    }
    onViewLoaded() {
        const _super = Object.create(null, {
            onViewLoaded: { get: () => super.onViewLoaded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onViewLoaded.call(this);
            this._navbarFragment.setScrollWidget(this.findBy("#main-content-container"));
            return res;
        });
    }
    /**
     * Überschreibt updateTtle, um Element in der Statusbar zu setzen
     *
     * @protected
     */
    _updateTitle() {
        super._updateTitle();
        if (this._title.element && this._state === Context_1.Context.STATE_RUNNING) {
            this._navbarFragment.setTitleElement(this._title.element);
        }
    }
    /**
     * Überschreiben durch Kinder-Klassen, um ein Menü zu erstellen
     *
     * @param {NavbarFragment} navbar
     */
    onCreateMenu(navbar) { }
}
exports.MenuSite = MenuSite;
//# sourceMappingURL=MenuSite.js.map