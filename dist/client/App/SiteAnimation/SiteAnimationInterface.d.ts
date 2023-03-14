export interface SiteAnimationInterface {
    animateSiteStart(fromSite: HTMLDivElement, toSite: HTMLDivElement): Promise<void>;
    animateSiteEnd(fromSite: HTMLDivElement, toSite: HTMLDivElement): Promise<void>;
    animateSitePopToFront(fromSite: HTMLDivElement, toSite: HTMLDivElement): Promise<void>;
}
