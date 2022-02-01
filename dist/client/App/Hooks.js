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
exports.useToasts = exports.useFooter = exports.useTopBar = exports.useSiteContainer = exports.useCreateDeepLink = exports.useSites = exports.SiteContainerContext = exports.SitesContext = void 0;
const react_1 = require("react");
const React = __importStar(require("react"));
const SiteIdContext_1 = require("./SiteIdContext");
exports.SitesContext = React.createContext(undefined);
exports.SitesContext.displayName = 'Sites';
exports.SiteContainerContext = React.createContext(undefined);
exports.SiteContainerContext.displayName = 'SiteContainer';
function useSites() {
    return react_1.useContext(exports.SitesContext);
}
exports.useSites = useSites;
function useCreateDeepLink(site, params) {
    const app = useSites();
    return app === null || app === void 0 ? void 0 : app.getDeepLinkHandler().createDeepLinkForSite(site, params);
}
exports.useCreateDeepLink = useCreateDeepLink;
function useSiteContainer() {
    return react_1.useContext(exports.SiteContainerContext);
}
exports.useSiteContainer = useSiteContainer;
function useTopBar(options) {
    const { backButton, rightButtons, leftButtons, title, visible, transparent, drawBehind } = options;
    const savedOptions = react_1.useMemo(() => {
        const newOptions = {};
        if (backButton !== undefined)
            newOptions.backButton = backButton;
        if (rightButtons !== undefined)
            newOptions.rightButtons = rightButtons;
        if (leftButtons !== undefined)
            newOptions.leftButtons = leftButtons;
        if (title !== undefined)
            newOptions.title = title;
        if (visible !== undefined)
            newOptions.visible = visible;
        if (transparent !== undefined)
            newOptions.transparent = transparent;
        if (drawBehind !== undefined)
            newOptions.drawBehind = drawBehind;
        return newOptions;
    }, [backButton, rightButtons, leftButtons, title, visible, transparent, drawBehind]);
    const siteContainer = useSiteContainer();
    react_1.useEffect(() => {
        siteContainer === null || siteContainer === void 0 ? void 0 : siteContainer.updateTopBarOptions(savedOptions);
    }, [savedOptions, siteContainer]);
}
exports.useTopBar = useTopBar;
function useFooter(options) {
    const { visible, buttons, activeTab } = options;
    const savedOptions = react_1.useMemo(() => {
        const newOptions = {};
        if (visible !== undefined)
            newOptions.visible = visible;
        if (buttons !== undefined)
            newOptions.buttons = buttons;
        if (activeTab !== undefined)
            newOptions.activeTab = activeTab;
        return newOptions;
    }, [visible, buttons, activeTab]);
    const sites = useSites();
    const siteId = SiteIdContext_1.useSiteId();
    react_1.useEffect(() => {
        sites === null || sites === void 0 ? void 0 : sites.updateFooterOptions(siteId, savedOptions);
    }, [savedOptions, sites, siteId]);
}
exports.useFooter = useFooter;
function useToasts() {
    const sites = useSites();
    return react_1.useCallback(function addToast(text, action, duration) {
        return sites === null || sites === void 0 ? void 0 : sites.addToast(text, action, duration);
    }, [sites]);
}
exports.useToasts = useToasts;
//# sourceMappingURL=Hooks.js.map