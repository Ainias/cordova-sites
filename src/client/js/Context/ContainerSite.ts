import {TemplateSite} from "./TemplateSite";
const containerTemplate = require( "../../html/siteTemplates/container.html");

/**
 * Seite, welche das Container-Template benutzt
 */
export class ContainerSite extends TemplateSite{

    /**
     * Constructor für die ContainerSite
     *
     * @param siteManager
     * @param view
     */
    constructor(siteManager, view) {
        super(siteManager, view, containerTemplate, "#site-content");
    }
}