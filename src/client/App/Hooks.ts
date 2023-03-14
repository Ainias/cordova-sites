import type { SitesType } from './Sites';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import * as React from 'react';
import type { FooterOptions, SiteContainerType, TopBarOptionsWithButtonFunctions } from '../Site/SiteContainer';
import { useSiteId } from './SiteIdContext';

export const SitesContext = React.createContext<SitesType | undefined>(undefined);
SitesContext.displayName = 'Sites';

export const SiteContainerContext = React.createContext<SiteContainerType<any> | undefined>(undefined);
SiteContainerContext.displayName = 'SiteContainer';

export function useSites() {
    return useContext(SitesContext);
}

export function useSiteContainer() {
    return useContext(SiteContainerContext);
}

export function useTopBar(options: TopBarOptionsWithButtonFunctions, dependencies?: any[]): void;
export function useTopBar(optionsGenerator: () => TopBarOptionsWithButtonFunctions, dependencies?: any[]): void;
export function useTopBar(
    optionsOrGenerator: TopBarOptionsWithButtonFunctions | (() => TopBarOptionsWithButtonFunctions),
    dependencies: any[] = []
) {
    const savedOptions = useMemo(
        typeof optionsOrGenerator === 'function' ? optionsOrGenerator : () => optionsOrGenerator,
        dependencies
    );
    const siteContainer = useSiteContainer();
    useEffect(() => {
        siteContainer?.updateTopBarOptions(savedOptions);
    }, [savedOptions, siteContainer]);
}

export function useFooter(options: FooterOptions, dependencies?: any[]): void;
export function useFooter(optionsGenerator: () => FooterOptions, dependencies?: any[]): void;
export function useFooter(optionsOrGenerator: FooterOptions | (() => FooterOptions), dependencies: any[] = []) {
    const savedOptions = useMemo(
        typeof optionsOrGenerator === 'function' ? optionsOrGenerator : () => optionsOrGenerator,
        dependencies
    );
    const sites = useSites();
    const siteId = useSiteId();
    useEffect(() => {
        sites?.updateFooterOptions(siteId, savedOptions);
    }, [savedOptions, sites, siteId]);
}

export function useToasts() {
    const sites = useSites();
    return useCallback(
        function addToast<Data>(
            text: string,
            action?: {
                name: string;
                action: (data?: Data) => void;
                actionData?: Data;
            },
            duration?: number
        ) {
            return sites?.addToast(text, action, duration);
        },
        [sites]
    );
}
