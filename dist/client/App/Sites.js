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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sites = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const SiteContainer_1 = require("../Site/SiteContainer");
const js_helper_1 = require("js-helper");
const DefaultSiteAnimation_1 = require("./SiteAnimation/DefaultSiteAnimation");
const Hooks_1 = require("./Hooks");
const Footer_1 = require("../Site/Footer/Footer");
const react_bootstrap_mobile_1 = require("react-bootstrap-mobile");
const QueryDeepLinkHandler_1 = require("./DeepLinks/QueryDeepLinkHandler");
const initialState = {
    isInitialized: false,
    visibleSite: -1,
    sites: [],
    animation: null,
    defaultTopBarOptions: SiteContainer_1.initialTopBarOptions,
    defaultFooterOptions: SiteContainer_1.initialFooterOptions,
    footerOptions: {},
    toasts: [],
};
class Sites extends react_1.PureComponent {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.lastSiteId = 0;
        this.sites = new Map();
        this.singleInstanceSites = new Map();
        this.order = [];
        this.initializationPromise = new js_helper_1.PromiseWithHandlers();
        this.lastToastId = 0;
        this.toasts = new Map();
        this.title = 'Test';
        this.url = '';
        this.dismissedToast = (toast) => {
            if (toast && this.toasts.has(toast.id)) {
                this.toasts.delete(toast.id);
                this.setState({ toasts: Array.from(this.toasts.values()) });
            }
        };
        this.setContainerForSite = (id, containerRef) => {
            if (this.sites.has(id)) {
                this.sites.get(id).containerRefPromise.resolve(containerRef);
            }
        };
        if (Sites.instance) {
            throw Error('there can only be one instance of this class! If react unmounts previous instance, check your code. This should not be happening!');
        }
        if (props.deepLinkHandler) {
            this.deepLinkHandler = props.deepLinkHandler;
        }
        else {
            // this.deepLinkHandler = new RouteDeepLinkHandler<SiteType<any>>();
            this.deepLinkHandler = new QueryDeepLinkHandler_1.QueryDeepLinkHandler();
        }
        if (props.animationHandler) {
            this.animationHandler = props.animationHandler;
        }
        else {
            this.animationHandler = new DefaultSiteAnimation_1.DefaultSiteAnimation();
        }
        this.basePath = js_helper_1.Helper.nonNull(props.basePath, '');
        this.deepLinkHandler.setBasePath(this.basePath);
        this.url = window.location.pathname + window.location.search + window.location.hash;
        Sites.instance = this;
        // Push state in order to allow backward navigation
        window.onpopstate = (e) => this.onPopState(e);
        window.history.pushState(null, this.title, this.url);
        this.startFirstSite();
        this.resolveInitialisationPromise();
    }
    static getInstance() {
        return this.instance;
    }
    static addInitialization(initializationFuncOrPromise) {
        if (typeof initializationFuncOrPromise === 'function') {
            this.initialisationPromises.push(this.appCreatedPromise.then(initializationFuncOrPromise));
        }
        else {
            this.initialisationPromises.push(initializationFuncOrPromise);
        }
    }
    componentDidUpdate(_prevProps, prevState) {
        var _a, _b;
        const { visibleSite, animation } = this.state;
        if (prevState.visibleSite !== visibleSite) {
            this.updateUrl();
            if (animation !== null) {
                // Handle animation
                Promise.all([
                    (_a = this.sites.get(animation.leavingSite)) === null || _a === void 0 ? void 0 : _a.containerRefPromise,
                    (_b = this.sites.get(visibleSite)) === null || _b === void 0 ? void 0 : _b.containerRefPromise,
                ]).then(([oldElementRef, newElementRef]) => __awaiter(this, void 0, void 0, function* () {
                    const oldElement = oldElementRef === null || oldElementRef === void 0 ? void 0 : oldElementRef.current;
                    const newElement = newElementRef === null || newElementRef === void 0 ? void 0 : newElementRef.current;
                    if (oldElement && newElement) {
                        switch (animation.type) {
                            case 'start': {
                                yield this.animationHandler.animateSiteStart(oldElement, newElement);
                                break;
                            }
                            case 'pop-to-front': {
                                yield this.animationHandler.animateSitePopToFront(oldElement, newElement);
                                break;
                            }
                            case 'end': {
                                yield this.animationHandler.animateSiteEnd(oldElement, newElement);
                                this.sites.delete(animation.leavingSite);
                                if (this.sites.size === 0) {
                                    // TODO app ended listener
                                    // Go back 2, because first one is own pushed state
                                    console.log('ending site');
                                    window.history.go(-2);
                                    return;
                                }
                                break;
                            }
                        }
                        const { animation: newAnimation } = this.state;
                        const activeSite = this.sites.get(visibleSite);
                        this.setState({
                            animation: animation === newAnimation ? null : newAnimation,
                            sites: Array.from(this.sites.values()),
                            footerOptions: activeSite.footerOptions,
                        });
                    }
                }));
            }
        }
    }
    render() {
        const { isInitialized, sites, visibleSite, animation, defaultFooterOptions, defaultTopBarOptions, footerOptions, toasts, } = this.state;
        const { style, className, siteContainerClass, contentWrapper } = this.props;
        if (!isInitialized) {
            return null;
        }
        const content = (React.createElement(Hooks_1.SitesContext.Provider, { value: this },
            React.createElement("div", { className: "sites" },
                React.createElement("div", { style: style, className: className || 'siteContainer' }, sites.map((data) => {
                    return (React.createElement(SiteContainer_1.SiteContainer, { visible: data.id === visibleSite || data.id === (animation === null || animation === void 0 ? void 0 : animation.leavingSite), leaving: data.id === (animation === null || animation === void 0 ? void 0 : animation.leavingSite), siteComponent: data.site, key: data.id, id: data.id, siteProps: data.props, siteContainerClass: siteContainerClass, onContainerListener: this.setContainerForSite, defaultTopBarOptions: defaultTopBarOptions }));
                })),
                React.createElement(Footer_1.Footer, Object.assign({}, defaultFooterOptions, footerOptions)),
                React.createElement(react_bootstrap_mobile_1.ToastContainer, null, toasts.map((toast) => {
                    return (React.createElement(react_bootstrap_mobile_1.Toast, Object.assign({}, toast, { key: toast.id, timeToShow: toast.duration, onDismissed: this.dismissedToast, onDismissedData: toast }), toast.text));
                })))));
        if (contentWrapper) {
            const Wrapper = contentWrapper;
            return React.createElement(Wrapper, null, content);
        }
        return content;
    }
    addToast(text, action, duration = 2500) {
        this.lastToastId++;
        const id = this.lastToastId;
        let toast = {
            id,
            text,
            duration,
        };
        if (action) {
            toast = Object.assign(Object.assign({}, toast), { actionName: action.name, onClick: action.action, onClickData: action.actionData });
        }
        this.toasts.set(id, toast);
        this.setState({ toasts: Array.from(this.toasts.values()) });
    }
    registerSingleInstanceSite(site) {
        if (!this.singleInstanceSites.has(site)) {
            this.singleInstanceSites.set(site, undefined);
        }
    }
    updateSiteProps(siteId, newProps) {
        const { visibleSite } = this.state;
        const site = this.sites.get(siteId);
        if (site) {
            site.props = newProps;
            if (visibleSite === siteId) {
                this.updateUrl();
            }
        }
    }
    updateUrl() {
        const { visibleSite } = this.state;
        const siteContainer = this.sites.get(visibleSite);
        if (siteContainer) {
            this.url = this.deepLinkHandler.createDeepLinkForSite(siteContainer.site, siteContainer.props);
        }
        else {
            this.url = this.basePath;
        }
        window.history.replaceState(null, this.title, this.url);
    }
    startFirstSite() {
        return __awaiter(this, void 0, void 0, function* () {
            const { startSite } = this.props;
            yield this.initializationPromise;
            const urlPath = window.location.pathname + window.location.search + window.location.hash;
            const deepLinkSiteData = this.deepLinkHandler.calculateSite(urlPath);
            if (typeof deepLinkSiteData !== 'undefined') {
                this.startSite(deepLinkSiteData.site, deepLinkSiteData.params);
            }
            else {
                this.startSite(startSite);
            }
        });
    }
    resolveInitialisationPromise() {
        return __awaiter(this, void 0, void 0, function* () {
            document.addEventListener('deviceready', () => __awaiter(this, void 0, void 0, function* () {
                Sites.appCreatedPromise.resolve(this);
                yield Promise.all(Sites.initialisationPromises);
                this.initializationPromise.resolve();
            }), true);
            yield this.initializationPromise;
            this.setState({ isInitialized: true });
        });
    }
    onPopState(e) {
        e.preventDefault();
        // pushState so that you can go back again
        window.history.pushState(null, this.title, this.url);
        this.goBack();
    }
    canGoBack() {
        return this.order.length > 1;
    }
    goBack(callOnBackListener = true) {
        var _a;
        const currentSiteId = this.order[this.order.length - 1];
        if (callOnBackListener) {
            const listener = (_a = this.sites.get(currentSiteId)) === null || _a === void 0 ? void 0 : _a.onBackListener;
            if (listener && listener()) {
                return;
            }
        }
        this.removeSite(currentSiteId);
    }
    getDeepLinkHandler() {
        return this.deepLinkHandler;
    }
    addDeepLink(link, site) {
        this.deepLinkHandler.set(link, site);
    }
    startSite(site, props) {
        const { visibleSite } = this.state;
        const singleInstanceSiteId = this.singleInstanceSites.get(site);
        if (singleInstanceSiteId) {
            this.showSite(singleInstanceSiteId);
            return;
        }
        const nextId = ++this.lastSiteId;
        this.sites.set(nextId, {
            site,
            props,
            id: nextId,
            containerRefPromise: new js_helper_1.PromiseWithHandlers(),
            footerOptions: {},
        });
        this.order.push(nextId);
        this.setState({
            visibleSite: nextId,
            animation: {
                leavingSite: visibleSite,
                type: 'start',
            },
            sites: Array.from(this.sites.values()),
            footerOptions: {},
        });
        if (this.singleInstanceSites.has(site)) {
            this.singleInstanceSites.set(site, nextId);
        }
    }
    showSite(siteId) {
        if (this.sites.has(siteId)) {
            const activeSite = this.sites.get(siteId);
            const { visibleSite } = this.state;
            const orderIndex = this.order.indexOf(siteId);
            if (orderIndex !== this.order.length - 1) {
                if (orderIndex !== -1)
                    this.order.splice(orderIndex, 1);
            }
            this.order.push(siteId);
            this.setState({
                visibleSite: siteId,
                animation: {
                    leavingSite: visibleSite,
                    type: 'pop-to-front',
                },
                footerOptions: activeSite.footerOptions,
            });
        }
    }
    removeSite(siteId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.sites.has(siteId)) {
                const siteToRemove = this.sites.get(siteId);
                let visibleSiteIndex = this.order.length - 1;
                const orderIndex = this.order.indexOf(siteId);
                if (orderIndex !== -1) {
                    this.order.splice(orderIndex, 1);
                }
                if (orderIndex === visibleSiteIndex) {
                    visibleSiteIndex--;
                    const visibleSiteId = visibleSiteIndex >= 0 ? this.order[visibleSiteIndex] : -1;
                    const activeSite = this.sites.get(visibleSiteId);
                    const footerOptions = (_a = activeSite === null || activeSite === void 0 ? void 0 : activeSite.footerOptions) !== null && _a !== void 0 ? _a : {};
                    yield this.setState({
                        visibleSite: visibleSiteId,
                        animation: {
                            type: 'end',
                            leavingSite: siteId,
                        },
                        footerOptions,
                    });
                }
                else {
                    this.sites.delete(siteId);
                    this.setState({ sites: Array.from(this.sites.values()) });
                }
                if (this.singleInstanceSites.has(siteToRemove.site)) {
                    this.singleInstanceSites.delete(siteToRemove.site);
                }
            }
        });
    }
    getSiteDataById(siteId) {
        return this.sites.get(siteId);
    }
    setOnBackListener(siteId, listener) {
        const siteContainer = this.sites.get(siteId);
        if (siteContainer) {
            siteContainer.onBackListener = listener;
        }
    }
    updateDefaultTopBarOptions(newOptions) {
        var _a, _b;
        const { defaultTopBarOptions } = this.state;
        if (typeof newOptions.rightButtons === 'function') {
            newOptions.rightButtons = newOptions.rightButtons((_a = defaultTopBarOptions.rightButtons) !== null && _a !== void 0 ? _a : []);
        }
        if (typeof newOptions.leftButtons === 'function') {
            newOptions.leftButtons = newOptions.leftButtons((_b = defaultTopBarOptions.leftButtons) !== null && _b !== void 0 ? _b : []);
        }
        this.setState({
            defaultTopBarOptions: Object.assign(Object.assign({}, defaultTopBarOptions), newOptions),
        });
    }
    updateDefaultFooterOptions(newOptions) {
        const { defaultFooterOptions } = this.state;
        this.setState({
            defaultFooterOptions: Object.assign(Object.assign({}, defaultFooterOptions), newOptions),
        });
    }
    updateFooterOptions(siteId, newOptions) {
        const site = this.sites.get(siteId);
        const { visibleSite } = this.state;
        if (!site) {
            return;
        }
        site.footerOptions = Object.assign(Object.assign({}, site.footerOptions), newOptions);
        if (visibleSite === siteId) {
            this.setState({ footerOptions: site.footerOptions });
        }
    }
}
exports.Sites = Sites;
Sites.initialisationPromises = [];
Sites.appCreatedPromise = new js_helper_1.PromiseWithHandlers();
//# sourceMappingURL=Sites.js.map