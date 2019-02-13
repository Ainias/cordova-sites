import {AbstractSite} from "./AbstractSite";
import {ViewInflater} from "../ViewInflater";

/**
 * Die Seite bekommt ein Template übergeben und ersetzt in diesem Template das mit dem Selector gefundene
 * Element mit der angebenen View
 */
export class TemplateSite extends AbstractSite{

    /**
     * Constructor für eine TemplateSite
     *
     * @param siteManager
     * @param view
     * @param template
     * @param selectorToReplace
     */
    constructor(siteManager, view, template, selectorToReplace) {
        super(siteManager, template);
        this._viewPromise = Promise.all([this._viewPromise, ViewInflater.getInstance().load(view)]).then(res => {
            res[0].querySelector(selectorToReplace).replaceWith(res[1]);
            ViewInflater.replaceWithChildren(res[1]);
            this._view = res[0];
            return res[0];
        }).catch(e => console.error(e));
    }
}