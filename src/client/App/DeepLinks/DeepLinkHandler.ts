export type DeepLinkData<SiteType> = {
    site: SiteType;
    params: Record<string, string | number>;
};

export interface DeepLinkHandler<SiteType> {
    has(link: string): boolean;
    set(link: string, site: SiteType): void;
    get(link: string): SiteType | undefined;
    setBasePath(link: string): void;
    calculateSite(link: string): DeepLinkData<SiteType> | undefined;
    createDeepLinkForSite(site: SiteType, params?: Record<string, string | number>): string;
}
