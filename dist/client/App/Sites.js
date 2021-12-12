var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as React from 'react';
import { PureComponent } from 'react';
import { SiteContainer } from '../Site/SiteContainer';
import { Helper, PromiseWithHandlers } from 'js-helper';
import { RouteDeepLinkHandler } from './DeepLinks/RouteDeepLinkHandler';
import { DefaultSiteAnimation } from './SiteAnimation/DefaultSiteAnimation';
import { SitesContext } from './Hooks';
var initialState = {
    isInitialized: false,
    visibleSite: -1,
    sites: [],
    animation: null,
};
var Sites = /** @class */ (function (_super) {
    __extends(Sites, _super);
    function Sites(props) {
        var _this = _super.call(this, props) || this;
        _this.state = initialState;
        _this.sites = new Map();
        _this.lastSiteId = 0;
        _this.order = [];
        _this.initializationPromise = new PromiseWithHandlers();
        _this.title = 'Test';
        _this.url = '';
        _this.setContainerForSite = function (id, containerRef) {
            if (_this.sites.has(id)) {
                _this.sites.get(id).containerRefPromise.resolve(containerRef);
            }
        };
        if (Sites.instance) {
            throw Error('there can only be one instance of this class! If react unmounts previous instance, check your code. This should not be happening!');
        }
        if (props.deepLinkHandler) {
            _this.deepLinkHandler = props.deepLinkHandler;
        }
        else {
            _this.deepLinkHandler = new RouteDeepLinkHandler();
        }
        if (props.animationHandler) {
            _this.animationHandler = props.animationHandler;
        }
        else {
            _this.animationHandler = new DefaultSiteAnimation();
        }
        _this.basePath = Helper.nonNull(props.basePath, '');
        _this.deepLinkHandler.setBasePath(_this.basePath);
        _this.url = _this.basePath;
        Sites.instance = _this;
        // Push state in order to allow backward navigation
        window.onpopstate = function (e) { return _this.onPopState(e); };
        window.history.pushState(null, _this.title, _this.url);
        _this.startFirstSite();
        _this.resolveInitialisationPromise();
        return _this;
    }
    Sites.getInstance = function () {
        return this.instance;
    };
    Sites.addInitialization = function (initializationFuncOrPromise) {
        if (typeof initializationFuncOrPromise === 'function') {
            this.initialisationPromises.push(this.appCreatedPromise.then(initializationFuncOrPromise));
        }
        else {
            this.initialisationPromises.push(initializationFuncOrPromise);
        }
    };
    Sites.prototype.componentDidUpdate = function (_prevProps, prevState) {
        var _this = this;
        var _a, _b;
        var _c = this.state, visibleSite = _c.visibleSite, animation = _c.animation;
        if (prevState.visibleSite !== visibleSite) {
            var siteContainer = this.sites.get(visibleSite);
            if (siteContainer) {
                this.url = this.deepLinkHandler.createDeepLinkForSite(siteContainer.site, siteContainer.props);
            }
            else {
                this.url = this.basePath;
            }
            window.history.replaceState(null, this.title, this.url);
            if (animation !== null) {
                // Handle animation
                Promise.all([
                    (_a = this.sites.get(animation.leavingSite)) === null || _a === void 0 ? void 0 : _a.containerRefPromise,
                    (_b = this.sites.get(visibleSite)) === null || _b === void 0 ? void 0 : _b.containerRefPromise,
                ]).then(function (_a) {
                    var oldElementRef = _a[0], newElementRef = _a[1];
                    return __awaiter(_this, void 0, void 0, function () {
                        var oldElement, newElement, _b, newAnimation;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    oldElement = oldElementRef === null || oldElementRef === void 0 ? void 0 : oldElementRef.current;
                                    newElement = newElementRef === null || newElementRef === void 0 ? void 0 : newElementRef.current;
                                    if (!(oldElement && newElement)) return [3 /*break*/, 8];
                                    _b = animation.type;
                                    switch (_b) {
                                        case 'start': return [3 /*break*/, 1];
                                        case 'pop-to-front': return [3 /*break*/, 3];
                                        case 'end': return [3 /*break*/, 5];
                                    }
                                    return [3 /*break*/, 7];
                                case 1: return [4 /*yield*/, this.animationHandler.animateSiteStart(oldElement, newElement)];
                                case 2:
                                    _c.sent();
                                    return [3 /*break*/, 7];
                                case 3: return [4 /*yield*/, this.animationHandler.animateSitePopToFront(oldElement, newElement)];
                                case 4:
                                    _c.sent();
                                    return [3 /*break*/, 7];
                                case 5: return [4 /*yield*/, this.animationHandler.animateSiteEnd(oldElement, newElement)];
                                case 6:
                                    _c.sent();
                                    this.sites.delete(animation.leavingSite);
                                    if (this.sites.size === 0) {
                                        // TODO app ended listener
                                        // Go back 2, because first one is own pushed state
                                        console.log('ending site');
                                        window.history.go(-2);
                                        return [2 /*return*/];
                                    }
                                    return [3 /*break*/, 7];
                                case 7:
                                    newAnimation = this.state.animation;
                                    this.setState({
                                        animation: animation === newAnimation ? null : newAnimation,
                                        sites: Array.from(this.sites.values()),
                                    });
                                    _c.label = 8;
                                case 8: return [2 /*return*/];
                            }
                        });
                    });
                });
            }
        }
    };
    Sites.prototype.render = function () {
        var _this = this;
        var _a = this.state, isInitialized = _a.isInitialized, sites = _a.sites, visibleSite = _a.visibleSite, animation = _a.animation;
        var _b = this.props, style = _b.style, className = _b.className, siteContainerClass = _b.siteContainerClass, contentWrapper = _b.contentWrapper;
        if (!isInitialized) {
            return null;
        }
        var content = (React.createElement("div", { style: style, className: className || 'siteContainer' },
            React.createElement(SitesContext.Provider, { value: this }, sites.map(function (data) {
                return (React.createElement(SiteContainer, { visible: data.id === visibleSite || data.id === (animation === null || animation === void 0 ? void 0 : animation.leavingSite), leaving: data.id === (animation === null || animation === void 0 ? void 0 : animation.leavingSite), siteComponent: data.site, key: data.id, id: data.id, siteProps: data.props, siteContainerClass: siteContainerClass, onContainerListener: _this.setContainerForSite }));
            }))));
        if (contentWrapper) {
            var Wrapper = contentWrapper;
            return React.createElement(Wrapper, null, content);
        }
        return content;
    };
    Sites.prototype.startFirstSite = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startSite, urlPath, deepLinkSiteData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startSite = this.props.startSite;
                        return [4 /*yield*/, this.initializationPromise];
                    case 1:
                        _a.sent();
                        urlPath = window.location.pathname + window.location.search + window.location.hash;
                        deepLinkSiteData = this.deepLinkHandler.calculateSite(urlPath);
                        if (typeof deepLinkSiteData !== 'undefined') {
                            this.startSite(deepLinkSiteData.site, deepLinkSiteData.params);
                        }
                        else {
                            this.startSite(startSite);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Sites.prototype.resolveInitialisationPromise = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        document.addEventListener('deviceready', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        Sites.appCreatedPromise.resolve(this);
                                        return [4 /*yield*/, Promise.all(Sites.initialisationPromises)];
                                    case 1:
                                        _a.sent();
                                        this.initializationPromise.resolve();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, true);
                        return [4 /*yield*/, this.initializationPromise];
                    case 1:
                        _a.sent();
                        this.setState({ isInitialized: true });
                        return [2 /*return*/];
                }
            });
        });
    };
    Sites.prototype.onPopState = function (e) {
        console.log('popState fired');
        e.preventDefault();
        // pushState so that you can go back again
        window.history.pushState(null, this.title, this.url);
        this.goBack();
    };
    Sites.prototype.canGoBack = function () {
        return this.order.length > 1;
    };
    Sites.prototype.goBack = function (callOnBackListener) {
        var _a;
        if (callOnBackListener === void 0) { callOnBackListener = true; }
        var currentSiteId = this.order[this.order.length - 1];
        if (callOnBackListener) {
            var listener = (_a = this.sites.get(currentSiteId)) === null || _a === void 0 ? void 0 : _a.onBackListener;
            if (listener && listener() === true) {
                return;
            }
        }
        this.removeSite(currentSiteId);
    };
    Sites.prototype.getDeepLinkHandler = function () {
        return this.deepLinkHandler;
    };
    Sites.prototype.addDeepLink = function (link, site) {
        this.deepLinkHandler.set(link, site);
    };
    Sites.prototype.startSite = function (site, props) {
        var visibleSite = this.state.visibleSite;
        var nextId = ++this.lastSiteId;
        this.sites.set(nextId, {
            site: site,
            props: props,
            id: nextId,
            containerRefPromise: new PromiseWithHandlers(),
        });
        this.order.push(nextId);
        this.setState({
            visibleSite: nextId,
            animation: {
                leavingSite: visibleSite,
                type: 'start',
            },
            sites: Array.from(this.sites.values()),
        });
    };
    Sites.prototype.showSite = function (siteId) {
        if (this.sites.has(siteId)) {
            var visibleSite = this.state.visibleSite;
            var orderIndex = this.order.indexOf(siteId);
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
            });
        }
    };
    Sites.prototype.removeSite = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var orderIndex, visibleSiteIndex, visibleSiteId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.sites.has(siteId)) return [3 /*break*/, 3];
                        orderIndex = this.order.indexOf(siteId);
                        visibleSiteIndex = this.order.length - 1;
                        if (orderIndex !== -1) {
                            this.order.splice(orderIndex, 1);
                        }
                        if (!(orderIndex === visibleSiteIndex)) return [3 /*break*/, 2];
                        visibleSiteIndex--;
                        visibleSiteId = visibleSiteIndex >= 0 ? this.order[visibleSiteIndex] : -1;
                        return [4 /*yield*/, this.setState({
                                visibleSite: visibleSiteId,
                                animation: {
                                    type: 'end',
                                    leavingSite: siteId,
                                },
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.sites.delete(siteId);
                        this.setState({ sites: Array.from(this.sites.values()) });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Sites.prototype.getSiteDataById = function (siteId) {
        return this.sites.get(siteId);
    };
    Sites.prototype.setOnBackListener = function (siteId, listener) {
        var siteContainer = this.sites.get(siteId);
        if (siteContainer) {
            siteContainer.onBackListener = listener;
        }
    };
    Sites.initialisationPromises = [];
    Sites.appCreatedPromise = new PromiseWithHandlers();
    return Sites;
}(PureComponent));
export { Sites };
//# sourceMappingURL=Sites.js.map