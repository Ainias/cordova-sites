import { MasterSite } from "./Delegate/MasterSite";
/**
 * Die Seite bekommt ein Template übergeben und ersetzt in diesem Template das mit dem Selector gefundene
 * Element mit der angebenen View
 */
export declare class TemplateSite extends MasterSite {
    /**
     * Constructor für eine TemplateSite
     *
     * @param siteManager
     * @param view
     * @param template
     * @param selectorToReplace
     */
    constructor(siteManager: any, view: any, template: any, selectorToReplace: any);
}
