import { useContext, useEffect } from 'react';
import * as React from 'react';
export var SitesContext = React.createContext(undefined);
SitesContext.displayName = 'Sites';
export var SiteContainerContext = React.createContext(undefined);
SiteContainerContext.displayName = 'SiteContainer';
export function useSites() {
    return useContext(SitesContext);
}
export function useCreateDeepLink(site, params) {
    var app = useSites();
    return app === null || app === void 0 ? void 0 : app.getDeepLinkHandler().createDeepLinkForSite(site, params);
}
export function useSiteContainer() {
    return useContext(SiteContainerContext);
}
export function useTopBar(options) {
    var siteContainer = useSiteContainer();
    useEffect(function () {
        siteContainer === null || siteContainer === void 0 ? void 0 : siteContainer.updateTopBarOptions(options);
    }, [options, siteContainer]);
}
//# sourceMappingURL=Hooks.js.map