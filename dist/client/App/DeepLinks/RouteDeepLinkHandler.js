var RouteDeepLinkHandler = /** @class */ (function () {
    function RouteDeepLinkHandler() {
        this.deepLinks = new Map();
        this.reverseDeepLinks = new Map();
        this.basePath = '';
    }
    RouteDeepLinkHandler.calculateMatch = function (deepLink, linkParts) {
        var deepLinkParts = deepLink.split('/');
        if (deepLinkParts.length > linkParts.length) {
            return -1;
        }
        var matches = deepLinkParts.every(function (part, index) {
            return part.startsWith(':') || part === linkParts[index];
        });
        if (matches) {
            return linkParts.length - deepLinkParts.length;
        }
        return -1;
    };
    RouteDeepLinkHandler.extractParams = function (deepLinkParts, linkParts, query) {
        var params = {};
        if (query) {
            var queryParts = query.split('&');
            queryParts.forEach(function (queryPart) {
                var _a = queryPart.split('='), key = _a[0], value = _a[1];
                key = decodeURIComponent(key);
                if (value === undefined) {
                    params[key] = true;
                }
                else {
                    value = decodeURIComponent(value);
                    params[key] = value;
                }
            });
        }
        return deepLinkParts.reduce(function (paramObject, part, index) {
            if (part.startsWith(':')) {
                paramObject[part.substr(1)] = linkParts[index];
            }
            return paramObject;
        }, params);
    };
    RouteDeepLinkHandler.prototype.createDeepLinkForSite = function (site, params) {
        if (!this.reverseDeepLinks.has(site)) {
            return '';
        }
        var fullLink = this.reverseDeepLinks.get(site);
        if (params) {
            var parts = fullLink.split('/');
            var paramKeys_1 = Object.keys(params);
            var path = parts.reduce(function (link, part) {
                if (part.startsWith(':')) {
                    var valName = part.substr(1);
                    var keyIndex = paramKeys_1.indexOf(valName);
                    if (keyIndex !== -1) {
                        paramKeys_1.splice(keyIndex, 1);
                        return link + "/" + params[valName];
                    }
                }
                if (link !== undefined) {
                    return link + "/" + part;
                }
                return part;
            });
            if (paramKeys_1.length > 0) {
                return "" + this.basePath + path + "?" + paramKeys_1
                    .map(function (key) {
                    if (typeof params[key] === 'boolean') {
                        return params[key] ? encodeURIComponent(key) : '';
                    }
                    return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
                })
                    .join('&');
            }
            return this.basePath + path;
        }
        return this.basePath + fullLink;
    };
    RouteDeepLinkHandler.prototype.calculateSite = function (fullLink) {
        var link = fullLink;
        if (fullLink.startsWith(this.basePath)) {
            link = fullLink.substr(this.basePath.length);
        }
        var _a = link.split('?'), pathPart = _a[0], queryPart = _a[1];
        var parts = pathPart.split('/');
        var closestMatch = {
            score: Infinity,
            link: undefined,
        };
        this.deepLinks.forEach(function (_site, currentLink) {
            var linkScore = RouteDeepLinkHandler.calculateMatch(currentLink, parts);
            if (linkScore >= 0 && linkScore < closestMatch.score) {
                closestMatch.score = linkScore;
                closestMatch.link = currentLink;
            }
        });
        if (typeof closestMatch.link === 'string') {
            var site = this.deepLinks.get(closestMatch.link);
            var params = RouteDeepLinkHandler.extractParams(closestMatch.link.split('/'), parts, queryPart);
            return {
                site: site,
                params: params,
            };
        }
        return undefined;
    };
    RouteDeepLinkHandler.prototype.has = function (link) {
        var parts = link.split('/');
        return Array.from(this.deepLinks.keys()).some(function (currentLink) {
            return RouteDeepLinkHandler.calculateMatch(currentLink, parts) === 0;
        });
    };
    RouteDeepLinkHandler.prototype.set = function (link, site) {
        if (this.has(link)) {
            throw new Error("Deep Link \"" + link + "\" already exists for site \"" + site + "\"");
        }
        this.deepLinks.set(link, site);
        this.reverseDeepLinks.set(site, link);
    };
    RouteDeepLinkHandler.prototype.get = function (link) {
        return this.deepLinks.get(link);
    };
    RouteDeepLinkHandler.prototype.setBasePath = function (basePath) {
        this.basePath = basePath;
    };
    return RouteDeepLinkHandler;
}());
export { RouteDeepLinkHandler };
//# sourceMappingURL=RouteDeepLinkHandler.js.map