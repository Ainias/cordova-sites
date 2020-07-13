"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerSite = void 0;
const TemplateSite_1 = require("./TemplateSite");
const containerTemplate = require("../../html/siteTemplates/container.html");
/**
 * Seite, welche das Container-Template benutzt
 */
class ContainerSite extends TemplateSite_1.TemplateSite {
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
exports.ContainerSite = ContainerSite;
//# sourceMappingURL=ContainerSite.js.map