import { SiteAnimationInterface } from './SiteAnimationInterface';
import { Helper } from 'js-helper';

type Option = {
    hideClass: string;
    showClass: string;
    duration: number;
    removeClasses?: boolean;
};

export class ClassSiteAnimation implements SiteAnimationInterface {
    private readonly siteStartClass: string;
    private readonly siteEndClass: string;
    private readonly duration: number;
    private readonly removeClasses: boolean;

    constructor(siteStartClass: string, siteEndClass: string, duration: number, removeClasses = true) {
        this.siteStartClass = siteStartClass;
        this.siteEndClass = siteEndClass;
        this.duration = duration;
        this.removeClasses = removeClasses;
    }

    async animateSiteEnd(fromSite: HTMLDivElement): Promise<void> {
        fromSite.classList.add(this.siteEndClass);

        await Helper.delay(this.duration);
        if (this.removeClasses) {
            fromSite.classList.remove(this.siteEndClass);
        }
    }

    animateSitePopToFront(fromSite: HTMLDivElement, toSite: HTMLDivElement): Promise<void> {
        return this.animateSiteStart(fromSite, toSite);
    }

    async animateSiteStart(_fromSite: HTMLDivElement, toSite: HTMLDivElement): Promise<void> {
        toSite.classList.add(this.siteStartClass);

        await Helper.delay(this.duration);
        if (this.removeClasses) {
            toSite.classList.remove(this.siteStartClass);
        }
    }
}
