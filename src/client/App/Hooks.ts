import type { Sites, SiteType } from './Sites';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import * as React from 'react';
import type {
    FooterOptions,
    SiteContainer,
    TopBarOptions,
    TopBarOptionsWithButtonFunctions,
} from '../Site/SiteContainer';
import { useSiteId } from './SiteIdContext';

export const SitesContext = React.createContext<Sites | undefined>(undefined);
SitesContext.displayName = 'Sites';

export const SiteContainerContext = React.createContext<SiteContainer<any> | undefined>(undefined);
SiteContainerContext.displayName = 'SiteContainer';

export function useSites() {
    return useContext(SitesContext);
}

export function useCreateDeepLink<PropTypes extends Record<string, string | number>>(
    site: SiteType<PropTypes>,
    params?: PropTypes
) {
    const app = useSites();
    return app?.getDeepLinkHandler().createDeepLinkForSite(site, params);
}

export function useSiteContainer() {
    return useContext(SiteContainerContext);
}

export function useTopBar(options: TopBarOptionsWithButtonFunctions) {
    const { backButton, rightButtons, leftButtons, title, visible, transparent, drawBehind } = options;
    const savedOptions = useMemo(() => {
        const newOptions: TopBarOptionsWithButtonFunctions = {};

        if (backButton !== undefined) newOptions.backButton = backButton;
        if (rightButtons !== undefined) newOptions.rightButtons = rightButtons;
        if (leftButtons !== undefined) newOptions.leftButtons = leftButtons;
        if (title !== undefined) newOptions.title = title;
        if (visible !== undefined) newOptions.visible = visible;
        if (transparent !== undefined) newOptions.transparent = transparent;
        if (drawBehind !== undefined) newOptions.drawBehind = drawBehind;

        return newOptions;
    }, [backButton, rightButtons, leftButtons, title, visible, transparent, drawBehind]);

    const siteContainer = useSiteContainer();
    useEffect(() => {
        siteContainer?.updateTopBarOptions(savedOptions);
    }, [savedOptions, siteContainer]);
}

export function useFooter(options: FooterOptions) {
    const { visible, buttons, activeTab } = options;
    const savedOptions = useMemo(() => {
        const newOptions: FooterOptions = {};

        if (visible !== undefined) newOptions.visible = visible;
        if (buttons !== undefined) newOptions.buttons = buttons;
        if (activeTab !== undefined) newOptions.activeTab = activeTab;

        return newOptions;
    }, [visible, buttons, activeTab]);

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
