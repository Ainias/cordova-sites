import {Context} from "./Context";
import {Helper} from "../Legacy/Helper";
import {AbstractSite} from "./AbstractSite";

/**
 * Ein Fragment ist ein TeilView einer Ansicht.
 */
export class AbstractFragment<ct extends AbstractSite> extends Context {

    _site: ct | AbstractFragment<ct>;
    _viewQuery: string;
    _active: boolean;

    /**
     * Erstellt ein neues Fragment
     *
     * @param site
     * @param view
     */
    constructor(site, view) {
        super(view);
        this._site = site;
        this._viewQuery = null;

        this._active = true;

    }

    /**
     * Gibt die zugehörige Seite zurück
     *
     * @returns
     */
    getSite(): ct {
        if (this._site instanceof AbstractFragment) {
            return this._site.getSite();
        }
        return this._site;
    }

    async startSite(site: AbstractSite, args) {
        return this.getSite().startSite(site, args);
    }

    /**
     * Gibt zurück, ob das Fragment aktiv ist. Wenn nicht, wird es in der Seite nicht angezeigt
     *
     * @returns {boolean}
     */
    isActive() {
        return this._active;
    }

    setViewQuery(query: string) {
        this._viewQuery = query;
    }

    getViewQuery() {
        return this._viewQuery;
    }

    setActive(active) {
        this._active = active;
        if (Helper.isNotNull(this._view)) {
            if (active) {
                this._view.classList.remove("hidden");
            } else {
                this._view.classList.add("hidden");
            }
        }
    }
}
