import { Context } from "./Context";
import { AbstractSite } from "./AbstractSite";
/**
 * Ein Fragment ist ein TeilView einer Ansicht.
 */
export declare class AbstractFragment extends Context {
    _site: AbstractFragment | AbstractSite;
    _viewQuery: any;
    _active: boolean;
    /**
     * Erstellt ein neues Fragment
     *
     * @param site
     * @param view
     */
    constructor(site: any, view: any);
    /**
     * Gibt die zugehörige Seite zurück
     *
     * @returns
     */
    getSite(): AbstractSite;
    startSite(site: any, args: any): any;
    /**
     * Gibt zurück, ob das Fragment aktiv ist. Wenn nicht, wird es in der Seite nicht angezeigt
     *
     * @returns {boolean}
     */
    isActive(): boolean;
    setViewQuery(query: any): void;
    getViewQuery(): any;
    setActive(active: any): void;
}
