import { SiteAnimationInterface } from './SiteAnimationInterface';
export declare class ClassSiteAnimation implements SiteAnimationInterface {
    private readonly siteStartClass;
    private readonly siteEndClass;
    private readonly duration;
    private readonly removeClasses;
    constructor(siteStartClass: string, siteEndClass: string, duration: number, removeClasses?: boolean);
    animateSiteEnd(fromSite: HTMLDivElement): Promise<void>;
    animateSitePopToFront(fromSite: HTMLDivElement, toSite: HTMLDivElement): Promise<void>;
    animateSiteStart(_fromSite: HTMLDivElement, toSite: HTMLDivElement): Promise<void>;
}
