import {AbstractFragment} from "../AbstractFragment";

const defaultViewNavbar = require("../../../html/siteTemplates/navbar.html");
import {MenuAction} from "./MenuAction/MenuAction";
import {Helper} from "../../Legacy/Helper";
import {Context} from "../Context";
import {Menu} from "./Menu";
import {OpenSubmenuAction} from "./MenuAction/OpenSubmenuAction";
import {DropdownRenderer} from "./Renderer/DropdownRenderer";
import {AccordionRenderer} from "./Renderer/AccordionRenderer";
import {ColorIndicator} from "../../ColorIndicator/ColorIndicator";
import {App} from "../../App";

/**
 * Fragment, welches ein Menü in der Navbar anzeigt und hinzufügt.
 *
 * Technisch gesehen wird das gleiche Menü zwei mal gerendert und hinzugefügt. Einmal das Menü in der Navbar, welches
 * immer sichtbar ist und einmal das versteckte Menü, welches durch einen Toggle-Button angezeigt werden kann.
 * Dabei hat jede MenuAction eine Sichtbarkeitsklasse. Anhand der Sichtbarkeitsklasse und der Bildschirmgröße wird
 * entweder das eine oder das andere Element sichtbar, jedoch niemals beide.
 */
export class NavbarFragment extends AbstractFragment {

    static defaultActions: any;
    static title: string;

    _menu;
    _responsiveMenu;
    _backgroundImage;
    _menuActions;
    private _logo: string;
    private _scrollWidget: null;
    private _canGoBack: boolean;
    private _closeListenerContainer: any;
    private static queries: any = [];

    /**
     * Erstellt das Fragment
     * @param site
     * @param {string|Node|null} viewNavbar
     */
    constructor(site, viewNavbar?) {
        super(site, Helper.nonNull(viewNavbar, defaultViewNavbar));
        this._menu = null;

        this._responsiveMenu = null;
        this._backgroundImage = "";

        this._menuActions = [];
        NavbarFragment.defaultActions.forEach(action => {
            this._menuActions.push(action.copy());
        });

        this._scrollWidget = null;

        this._canGoBack = true;

        this._logo = App.getLogo();
    }

    setLogo(logo) {
        this._logo = logo;
        if (this._view) {
            if (Helper.isNotNull(this._logo)) {
                this.findBy(".logo").classList.remove("hidden");
                this.findBy(".logo-img").src = this._logo;
            } else {
                this.findBy(".logo").classList.add("hidden");
            }
        }
    }

    setCanGoBack(canGoBack) {
        this._canGoBack = canGoBack;
        if (this._view) {
            if (this._canGoBack) {
                this.findBy(".back-button").classList.remove("hidden");
            } else {
                this.findBy(".back-button").classList.add("hidden");
            }
        }
    }

    setScrollWidget(scrollWidget) {
        this._scrollWidget = scrollWidget;
        if (this._view && this._scrollWidget) {
            let nav = this.findBy(".top-bar > span");
            let background = this.findBy(".background-img");

            let listener = () => {
                let navbarElem = this.findBy("nav.top-bar");
                if (nav.getBoundingClientRect().bottom >= background.getBoundingClientRect().bottom) {
                    navbarElem.classList.add("solid");
                } else {
                    navbarElem.classList.remove("solid");
                }
            };

            background.addEventListener("load", listener);
            scrollWidget.addEventListener("scroll", listener);
            requestAnimationFrame(listener);
        }
    }

    setBackgroundImage(backgroundImage) {
        this._backgroundImage = backgroundImage;
        if (this._view) {
            let navbarElem = this.findBy("nav.top-bar");
            if (Helper.isNotNull(this._backgroundImage)) {
                let imgElem = this.findBy(".background-img");

                let colorIndicator = ColorIndicator.getInstance();

                // navbarElem.classList.add("color-black");
                imgElem.addEventListener("load", () => {
                    if (this._backgroundImage !== "") {
                        let color = (colorIndicator.getAverageImgColor(imgElem, undefined, 150));
                        let textColor = colorIndicator.invertColorBW(color);

                        if (textColor.r === 0 && textColor.g === 0 && textColor.b === 0) {
                            navbarElem.classList.remove("color-white");
                            navbarElem.classList.add("color-black");
                        } else {
                            navbarElem.classList.remove("color-black");
                            navbarElem.classList.add("color-white");
                        }
                    } else {
                        navbarElem.classList.remove("color-black");
                        navbarElem.classList.remove("color-white");
                    }
                });

                requestAnimationFrame(() => {
                    let heightElement = navbarElem.querySelector(".grid-container");
                    navbarElem.style = "min-height:" + heightElement.getBoundingClientRect().height + "px";
                    if ("ResizeObserver" in window) {
                        // @ts-ignore
                        const resizeObserver = new ResizeObserver(entries => {
                            entries.forEach(entry => {
                                if (entry.borderBoxSize) {
                                    navbarElem.style = "min-height:" + entry.borderBoxSize[0].blockSize + "px";
                                }
                                else if (entry.contentRect){
                                    navbarElem.style = "min-height:" + entry.contentRect.height + "px";
                                }
                                else {
                                    console.log("entry", entry)
                                }
                            })
                        });
                        resizeObserver.observe(heightElement);
                    }
                    setTimeout(() => {
                        navbarElem.style = "min-height:" + heightElement.getBoundingClientRect().height + "px";
                    }, 500);
                    setTimeout(() => {
                        navbarElem.style = "min-height:" + heightElement.getBoundingClientRect().height + "px";
                    }, 1000);
                    setTimeout(() => {
                        navbarElem.style = "min-height:" + heightElement.getBoundingClientRect().height + "px";
                    }, 1500);
                });

                imgElem.src = this._backgroundImage;
                navbarElem.classList.add("with-image");

            } else {
                navbarElem.classList.remove("with-image");
            }
        }
    }

    /**
     * Wird aufgerufen, sobald die View geladen ist
     * @returns {Promise<*>}
     */
    async onViewLoaded() {
        let res = super.onViewLoaded();

        this.setTitleElement(document.createTextNode(NavbarFragment.title));

        //Erstelle die Renderers und das Menü
        let renderers = [];
        renderers.push(new DropdownRenderer(this.findBy("#navbar-menu-visible")));
        renderers.push(new AccordionRenderer(this.findBy("#navbar-menu-hidden")));
        this._menu = new Menu(renderers, this._menuActions);
        this._closeListenerContainer = this.findBy("#navbar-close-listener-container");

        //Falls im visible-submenu eine Submenu-Action zu sehen ist
        this._menu.setOpenSubmenuListener(() => {
            this._showCloseListener();
        });

        //Falls ein Element im Menü angeklickt wird, sollte das Menü geschlossen werden,
        //außer dadurch wird ein Untermenü geöffnet/geschlossen
        let oldListener = this._menu.getOnClickListener();
        this._menu.setOnClickListener(e => {
            if (!(oldListener(e) instanceof OpenSubmenuAction)) {
                this.closeMenu();
            }
        });

        //Fügt close/open-Listener für den Toggle-Button hinzu
        this._responsiveMenu = this.findBy("#responsive-menu");
        this.findBy("#responsive-menu-toggle").onclick = () => {
            if (this._responsiveMenu.classList.contains("visible")) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        };

        //Wenn das "versteckte" Menü geöffnet ist, sollte jeder Click nicht auf das Menü dieses wieder schließen
        //Dazu gibt es den navbar-close-listener der sich vor allen (außer dem Menü) befindet. Er wird nur angezeigt,
        //wenn das Menü offen ist
        let navbarFragment = this;
        this.findBy("#navbar-close-listener").addEventListener("click", function (e) {
            if (e.target === this) {
                navbarFragment.closeMenu();
            }
        });


        //Wenn die größe des Fenster geändert wird, muss nachgeschaut werden, ob der Menü-Button für das hidden-Menü noch angezeigt werden muss
        window.addEventListener('resize', () => {
            //Reicht aus, wenn Seite im Vordergrund, da bei jedem Start (durch onStart) der toggleButton geupdatet wird
            if (this._state === Context.STATE_RUNNING) {
                this.updateToggleButton();
            }
        });

        //Rendere das Menü
        this.drawMenu();

        this.findBy(".back-button").addEventListener("click", () => {
            this.goBack();
        });

        this.setCanGoBack(this._canGoBack);
        this.setBackgroundImage(this._backgroundImage);
        this.setScrollWidget(this._scrollWidget);
        this.setLogo(this._logo);

        return res;
    }

    goBack() {
        if (this._canGoBack) {
            this.getSite().goBack();
        }
    }

    /**
     * Jedes mal, wenn die Seite startet, update den toggleButton
     *
     * @param pauseArguments
     * @returns {Promise<void>}
     */
    async onStart(pauseArguments) {
        super.onStart(pauseArguments);
        this.updateToggleButton();
    }

    _showCloseListener() {
        if (this._closeListenerContainer) {
            this._closeListenerContainer.style.display = 'block';
        }
    }

    /**
     * Schließe das Menü
     */
    closeMenu() {
        if (Helper.isNotNull(this._responsiveMenu)) {
            this._responsiveMenu.classList.remove("visible");
        }
        if (this._closeListenerContainer) {
            this._closeListenerContainer.style.display = 'none';
        }
        if (this._menu) {
            this._menu.close();
        }
    }

    /**
     * Öffne das Menü
     */
    openMenu() {
        if (Helper.isNotNull(this._responsiveMenu)) {
            // this._responsiveMenu.style.display = 'block';
            this._responsiveMenu.classList.add("visible");
        }
        this._showCloseListener();
    }


    /**
     * rendere das Menü
     */
    drawMenu() {
        if (Helper.isNotNull(this._menu)) {
            this._menu.draw();
        }
    }

    /**
     * Update die Sichtbarkeit des MenüButtons für das "versteckte" Menü
     */
    updateToggleButton() {
        //Bekomme die aktuelle Bildschirm-größe als Foundation-Klasse
        let size = NavbarFragment._getCurrentSize();

        //schaue hier nach den enthaltenen Elementen. Evtl sollte das direkt an den MenüActions gemacht werden
        let firstParentElement = this.findBy("#navbar-menu-visible");

        if (
            //Es existieren Elemente für large und Bildschirmgröße ist kleiner large => ToggleButton muss angezeigt werden
            (size === "medium" || size === "smedium" || size === "small") &&
            firstParentElement.querySelectorAll("." + MenuAction.SHOW_FOR_LARGE + ":not(.hidden)").length > 0 ||

            //Es existieren Elemente für medium und Bildschirmgröße ist kleiner medium=> ToggleButton muss angezeigt werden
            (size === "smedium" || size === "small") &&
            firstParentElement.querySelectorAll("." + MenuAction.SHOW_FOR_MEDIUM + ":not(.hidden)").length > 0 ||

            //Es existieren Elemente für smedium und Bildschirmgröße ist kleiner medium=> ToggleButton muss angezeigt werden
            (size === "small") &&
            firstParentElement.querySelectorAll("." + MenuAction.SHOW_FOR_SMEDIUM + ":not(.hidden)").length > 0 ||

            //Es existieren Elemente, welche nie angezeigt werden sollen => ToggleButton muss angezeigt werden
            firstParentElement.querySelectorAll("." + MenuAction.SHOW_NEVER + ":not(.hidden)").length > 0) {

            document.getElementById("responsive-menu-toggle").style.display = 'block';
        } else {
            document.getElementById("responsive-menu-toggle").style.display = 'none';

            //schließe Menü, falls es offen war
            this.closeMenu();
        }
    }

    /**
     * Funktion zum hinzufügen von Actions
     * @param action
     */
    addAction(action) {
        this._menuActions.push(action);

        //Falls Menü schon existiert, füge Elemente hinzu
        if (Helper.isNotNull(this._menu)) {
            this._menu.addAction(action);
        }
    }

    /**
     * Funktion zum hinzufügen von Actions
     * @param redraw
     */
    removeAllActions(redraw) {
        this._menuActions = [];

        //Falls Menü schon existiert, füge Elemente hinzu
        if (Helper.isNotNull(this._menu)) {
            this._menu.removeAllActions(redraw);
        }
    }

    /**
     * Updatet das Title-Element
     * @param titleElement
     */
    setTitleElement(titleElement) {
        Helper.removeAllChildren(this.findBy("#title-element-container")).appendChild(titleElement);
    }

    /**
     * Gibt die aktuelle Size zurück
     *
     * @returns {*}
     * @private
     */
    static _getCurrentSize() {
        let matched;

        //Queries sind paare von css-selektoren auf die Mindest-Breite und Namen
        //Queries sind so geordnet, dass größter zum schluss kommt
        let queries = NavbarFragment._getViewQueries();

        for (let i = 0; i < queries.length; i++) {
            let query = queries[i];

            //Letzter sollte matchen, daher noch nicht breaken
            if (matchMedia(query._value).matches) {
                matched = query;
            }
        }

        if (typeof matched === 'object') {
            return matched._name;
        } else {
            return matched;
        }
    }

    /**
     * Gibt die ViewQueries zurück, triggert die Berechnung der ViewQueries, falls das noch nicht geschehen ist
     *
     * @returns {Array}
     * @private
     */
    static _getViewQueries() {
        if (NavbarFragment.queries.length === 0) {
            NavbarFragment.queries = NavbarFragment._calculateViewQueries();
        }
        return NavbarFragment.queries;
    }

    /**
     * Berechnet die ViewQueries, bzw liest diese aus Foundation/CSS ein
     * Eine Veränderung der Werte in SASS, verändert daher auch hier die Werte
     *
     * @returns {*}
     * @private
     */
    static _calculateViewQueries() {

        //Hilfs-Funktion zum Parsen der Bildschirmgröße
        function parseStyleToObject(str) {
            let styleObject = {};

            if (typeof str !== 'string') {
                return styleObject;
            }

            str = str.trim().slice(1, -1); // browsers re-quote string style values

            if (!str) {
                return styleObject;
            }

            styleObject = str.split('&').reduce(function (ret, param) {
                const parts = param.replace(/\+/g, ' ').split('=');
                let key = parts[0];
                let val = parts[1];
                key = decodeURIComponent(key);

                // missing `=` should be `null`:
                // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
                val = val === undefined ? null : decodeURIComponent(val);

                if (!ret.hasOwnProperty(key)) {
                    ret[key] = val;
                } else if (Array.isArray(ret[key])) {
                    ret[key].push(val);
                } else {
                    ret[key] = [ret[key], val];
                }
                return ret;
            }, {});

            return styleObject;
        }

        //die Font-Family ist reiner Text. Daher übergibt Foundation die Bildchirmgröße mit den dazugehörigen Namen als
        // Font-Family in einem Element im Head
        let cssStyle = document.getElementsByClassName('foundation-mq');
        if (cssStyle.length === 0) {
            return;
        }

        let queries = [];

        //Lade Bildschirmgrößen und speichere diese als Query in einem Array
        let cssStyleElements = parseStyleToObject(window.getComputedStyle(cssStyle[0]).getPropertyValue('font-family'));
        for (let key in cssStyleElements) {
            if (cssStyleElements.hasOwnProperty(key)) {
                //Erstelle aus der Bildschirmgröße die Queries
                queries.push({
                    _name: key,
                    _value: 'only screen and (min-width: ' + cssStyleElements[key] + ')'
                });
            }
        }
        return queries;
    }
}

NavbarFragment.title = "MeinBerufBau";
NavbarFragment.defaultActions = [];
