import { DeepLinkHandler } from './DeepLinkHandler';

export class RouteDeepLinkHandler<SiteType> implements DeepLinkHandler<SiteType> {
    private deepLinks: Map<string, SiteType> = new Map<string, SiteType>();
    private reverseDeepLinks: Map<SiteType, string> = new Map<SiteType, string>();
    private basePath = '';

    private static calculateMatch(deepLink: string, linkParts: string[]) {
        const deepLinkParts = deepLink.split('/');
        if (deepLinkParts.length > linkParts.length) {
            return -1;
        }
        const matches = deepLinkParts.every((part, index) => {
            return part.startsWith(':') || part === linkParts[index];
        });
        if (matches) {
            return linkParts.length - deepLinkParts.length;
        }
        return -1;
    }

    private static extractParams(deepLinkParts: string[], linkParts: string[], query: string | undefined) {
        const params = {};
        if (query) {
            const queryParts = query.split('&');
            queryParts.forEach((queryPart) => {
                let [key, value] = queryPart.split('=');
                key = decodeURIComponent(key);
                if (value === undefined) {
                    params[key] = true;
                } else {
                    value = decodeURIComponent(value);
                    params[key] = value;
                }
            });
        }

        return deepLinkParts.reduce((paramObject, part, index) => {
            if (part.startsWith(':')) {
                paramObject[part.substr(1)] = linkParts[index];
            }
            return paramObject;
        }, params);
    }

    createDeepLinkForSite(site: SiteType, params?: Record<string, string | number | boolean>): string {
        if (!this.reverseDeepLinks.has(site)) {
            return '';
        }
        const fullLink = this.reverseDeepLinks.get(site)!;
        if (params) {
            const parts = fullLink.split('/');
            const paramKeys = Object.keys(params);
            const path = parts.reduce((link, part) => {
                if (part.startsWith(':')) {
                    const valName = part.substr(1);
                    const keyIndex = paramKeys.indexOf(valName);
                    if (keyIndex !== -1) {
                        paramKeys.splice(keyIndex, 1);
                        return `${link}/${params[valName]}`;
                    }
                }
                if (link !== undefined) {
                    return `${link}/${part}`;
                }
                return part;
            });
            if (paramKeys.length > 0) {
                return `${this.basePath}${path}?${paramKeys
                    .map((key) => {
                        if (typeof params[key] === 'boolean') {
                            return params[key] ? encodeURIComponent(key) : '';
                        }
                        return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
                    })
                    .join('&')}`;
            }

            return this.basePath + path;
        }
        return this.basePath + fullLink;
    }

    calculateSite(fullLink: string) {
        let link = fullLink;
        if (fullLink.startsWith(this.basePath)) {
            link = fullLink.substr(this.basePath.length);
        }

        const [pathPart, queryPart] = link.split('?');
        const parts = pathPart.split('/');
        const closestMatch: { score: number; link: string | undefined } = {
            score: Infinity,
            link: undefined,
        };

        this.deepLinks.forEach((_site, currentLink) => {
            const linkScore = RouteDeepLinkHandler.calculateMatch(currentLink, parts);
            if (linkScore >= 0 && linkScore < closestMatch.score) {
                closestMatch.score = linkScore;
                closestMatch.link = currentLink;
            }
        });

        if (typeof closestMatch.link === 'string') {
            const site = this.deepLinks.get(closestMatch.link)!;
            const params = RouteDeepLinkHandler.extractParams(closestMatch.link.split('/'), parts, queryPart);
            return {
                site,
                params,
            };
        }

        return undefined;
    }

    has(link: string): boolean {
        const parts = link.split('/');
        return Array.from(this.deepLinks.keys()).some((currentLink) => {
            return RouteDeepLinkHandler.calculateMatch(currentLink, parts) === 0;
        });
    }

    set(link: string, site: SiteType) {
        if (this.has(link)) {
            throw new Error(`Deep Link "${link}" already exists for site "${site}"`);
        }
        this.deepLinks.set(link, site);
        this.reverseDeepLinks.set(site, link);
    }

    get(link: string): SiteType | undefined {
        return this.deepLinks.get(link);
    }

    setBasePath(basePath: string): void {
        this.basePath = basePath;
    }
}