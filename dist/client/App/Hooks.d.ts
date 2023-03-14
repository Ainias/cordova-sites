import type { SitesType } from './Sites';
import * as React from 'react';
import type { FooterOptions, SiteContainerType, TopBarOptionsWithButtonFunctions } from '../Site/SiteContainer';
export declare const SitesContext: React.Context<SitesType | undefined>;
export declare const SiteContainerContext: React.Context<SiteContainerType<any> | undefined>;
export declare function useSites(): SitesType | undefined;
export declare function useSiteContainer(): SiteContainerType<any> | undefined;
export declare function useTopBar(options: TopBarOptionsWithButtonFunctions, dependencies?: any[]): void;
export declare function useTopBar(optionsGenerator: () => TopBarOptionsWithButtonFunctions, dependencies?: any[]): void;
export declare function useFooter(options: FooterOptions, dependencies?: any[]): void;
export declare function useFooter(optionsGenerator: () => FooterOptions, dependencies?: any[]): void;
export declare function useToasts(): <Data>(text: string, action?: {
    name: string;
    action: (data?: Data | undefined) => void;
    actionData?: Data | undefined;
} | undefined, duration?: number) => void | undefined;
