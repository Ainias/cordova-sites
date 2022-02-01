"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteLink = void 0;
const react_1 = __importStar(require("react"));
const Hooks_1 = require("../App/Hooks");
const SiteIdContext_1 = require("../App/SiteIdContext");
exports.SiteLink = react_1.default.memo(function SiteLink({ siteId, site, siteProps, style, children, finishCurrent = false, }) {
    const sites = Hooks_1.useSites();
    const currentSiteId = SiteIdContext_1.useSiteId();
    const onClickHandler = react_1.useCallback((e) => {
        e.preventDefault();
        if (siteId !== undefined) {
            sites === null || sites === void 0 ? void 0 : sites.showSite(siteId);
        }
        else if (site) {
            sites === null || sites === void 0 ? void 0 : sites.startSite(site, siteProps);
        }
        if (finishCurrent) {
            sites === null || sites === void 0 ? void 0 : sites.removeSite(currentSiteId);
        }
    }, [site, siteProps, siteId, sites, finishCurrent, currentSiteId]);
    if (!site && typeof siteId === 'number') {
        const data = sites === null || sites === void 0 ? void 0 : sites.getSiteDataById(siteId);
        if (typeof data !== 'undefined') {
            site = data.site;
            siteProps = data.props;
        }
    }
    if (site === undefined) {
        throw new Error(`site is undefined with id ${siteId}`);
    }
    const link = Hooks_1.useCreateDeepLink(site, siteProps);
    return (react_1.default.createElement("a", { role: "button", style: style, onClick: onClickHandler, href: link }, children));
});
//# sourceMappingURL=SiteLink.js.map