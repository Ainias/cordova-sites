import type { Sites, SiteType } from './Sites';
import * as React from 'react';
import type { FooterOptions, SiteContainer, TopBarOptionsWithButtonFunctions } from '../Site/SiteContainer';
export declare const SitesContext: React.Context<Sites | undefined>;
export declare const SiteContainerContext: React.Context<SiteContainer<any> | undefined>;
export declare function useSites(): Sites | undefined;
export declare function useCreateDeepLink<PropTypes extends Record<string, string | number>>(site: SiteType<PropTypes>, params?: PropTypes): string | undefined;
export declare function useSiteContainer(): SiteContainer<any> | undefined;
export declare function useTopBar(options: TopBarOptionsWithButtonFunctions): void;
export declare function useFooter(options: FooterOptions): void;
export declare function useToasts(): <Data>(text: string, action?: {
    name: string;
    action: (data?: Data | undefined) => void;
    actionData?: Data | undefined;
} | undefined, duration?: number | undefined) => void | undefined;
