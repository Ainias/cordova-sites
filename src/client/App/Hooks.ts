import { SiteType } from '../Site/Site';
import type { Sites } from './Sites';
import { useContext, useEffect } from 'react';
import * as React from 'react';
import type { SiteContainer, TopBarOptions } from '../Site/SiteContainer';

export const SitesContext = React.createContext<Sites | undefined>(undefined);
SitesContext.displayName = 'Sites';

export const SiteContainerContext = React.createContext<SiteContainer | undefined>(undefined);
SiteContainerContext.displayName = 'SiteContainer';

export function useSites() {
    return useContext(SitesContext);
}

export function useCreateDeepLink(site: SiteType, params?: Record<string, string | number>) {
    const app = useSites();
    return app?.getDeepLinkHandler().createDeepLinkForSite(site, params);
}

export function useSiteContainer() {
    return useContext(SiteContainerContext);
}

export function useTopBar(options: TopBarOptions) {
    const siteContainer = useSiteContainer();
    useEffect(() => {
        siteContainer?.updateTopBarOptions(options);
    }, [options, siteContainer]);
}
