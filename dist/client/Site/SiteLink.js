import React, { useCallback } from 'react';
import { useCreateDeepLink, useSites } from '../App/Hooks';
import { useSiteId } from '../App/SiteIdContext';
function createSiteLinkFunc() {
    var SiteLink = React.memo(function (_a) {
        var siteId = _a.siteId, site = _a.site, siteProps = _a.siteProps, style = _a.style, children = _a.children, _b = _a.finishCurrent, finishCurrent = _b === void 0 ? false : _b;
        var sites = useSites();
        var currentSiteId = useSiteId();
        var onClickHandler = useCallback(function (e) {
            e.preventDefault();
            if (siteId !== undefined) {
                sites === null || sites === void 0 ? void 0 : sites.showSite(siteId);
            }
            else if (site) {
                sites === null || sites === void 0 ? void 0 : sites.startSite(site, siteProps);
            }
            if (finishCurrent) {
                sites === null || sites === void 0 ? void 0 : sites.removeSite(currentSiteId);
            }
        }, [site, siteProps, siteId, sites, finishCurrent, currentSiteId]);
        if (!site && typeof siteId === 'number') {
            var data = sites === null || sites === void 0 ? void 0 : sites.getSiteDataById(siteId);
            if (typeof data !== 'undefined') {
                site = data.site;
                siteProps = data.props;
            }
        }
        if (site === undefined) {
            throw new Error("site is undefined with id " + siteId);
        }
        var link = useCreateDeepLink(site, siteProps);
        return (React.createElement("a", { role: "button", style: style, onClick: onClickHandler, href: link }, children));
    });
    return SiteLink;
}
export var SiteLink = createSiteLinkFunc();
//# sourceMappingURL=SiteLink.js.map