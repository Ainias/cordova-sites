import { DeepLinkHandler } from './DeepLinkHandler';

export class QueryDeepLinkHandler<SiteType> implements DeepLinkHandler<SiteType> {
    private deepLinks: Map<string, SiteType> = new Map<string, SiteType>();
    private reverseDeepLinks: Map<SiteType, string> = new Map<SiteType, string>();
    private basePath = '';

    private static extractParams(query: string) {
        const params: Record<string, string | true> = {};
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

        return params;
    }

    createDeepLinkForSite(site: SiteType, params?: Record<string, string | number | boolean>): string {
        if (!this.reverseDeepLinks.has(site)) {
            return this.basePath;
        }

        let link = this.basePath;
        if (!params) {
            params = {};
        }
        params.s = this.reverseDeepLinks.get(site)!;

        const paramKeys = Object.keys(params);
        if (paramKeys.length > 0) {
            link = `${link}?${paramKeys
                .map((key) => {
                    if (params) {
                        if (typeof params[key] === 'boolean') {
                            return params[key] ? encodeURIComponent(key) : '';
                        }
                        return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
                    }
                    return '';
                })
                .join('&')}`;
        }
        return link;
    }

    calculateSite(fullLink: string) {
        const [, queryPart] = fullLink.split('?');

        if (!queryPart) {
            return undefined;
        }

        const params = QueryDeepLinkHandler.extractParams(queryPart);
        if (typeof params.s !== 'string') {
            return undefined;
        }

        const { s: link, ...realParams } = params;
        if (!this.deepLinks.has(link)) {
            return undefined;
        }

        const site = this.deepLinks.get(link)!;
        return { site, params: realParams };
    }

    has(link: string): boolean {
        return this.deepLinks.has(link);
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
