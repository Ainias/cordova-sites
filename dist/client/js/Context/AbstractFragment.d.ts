import { Context } from "./Context";
/**
 * Ein Fragment ist ein TeilView einer Ansicht.
 */
export declare class AbstractFragment extends Context {
    _site: any;
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
     * @returns {*}
     */
    getSite(): any;
    startSite(site: any, args: any): Promise<any>;
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
