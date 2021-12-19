import { Context } from "./Context";
import { AbstractSite } from "./AbstractSite";
/**
 * Ein Fragment ist ein TeilView einer Ansicht.
 */
export declare class AbstractFragment<ct extends AbstractSite> extends Context {
    _site: ct | AbstractFragment<ct>;
    _viewQuery: string;
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
    getSite(): ct;
    startSite(site: typeof AbstractSite, args: any): Promise<any>;
    /**
     * Gibt zurück, ob das Fragment aktiv ist. Wenn nicht, wird es in der Seite nicht angezeigt
     *
     * @returns {boolean}
     */
    isActive(): boolean;
    setViewQuery(query: string): void;
    getViewQuery(): string;
    setActive(active: any): void;
}
