import { DeepLinkHandler } from './DeepLinkHandler';
export declare class RouteDeepLinkHandler<SiteType> implements DeepLinkHandler<SiteType> {
    private deepLinks;
    private reverseDeepLinks;
    private basePath;
    private static calculateMatch;
    private static extractParams;
    createDeepLinkForSite(site: SiteType, params?: Record<string, string | number | boolean>): string;
    calculateSite(fullLink: string): {
        site: NonNullable<SiteType>;
        params: {};
    } | undefined;
    has(link: string): boolean;
    set(link: string, site: SiteType): void;
    get(link: string): SiteType | undefined;
    setBasePath(basePath: string): void;
}
