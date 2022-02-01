import * as React from 'react';
import { ComponentType, CSSProperties, PureComponent } from 'react';
import {
    FooterOptions,
    initialFooterOptions,
    initialTopBarOptions,
    SiteContainer,
    TopBarOptions,
    TopBarOptionsWithButtonFunctions,
} from '../Site/SiteContainer';
import { Helper, PromiseWithHandlers } from 'js-helper';
import { DeepLinkHandler } from './DeepLinks/DeepLinkHandler';
import { RouteDeepLinkHandler } from './DeepLinks/RouteDeepLinkHandler';
import { SiteAnimationInterface } from './SiteAnimation/SiteAnimationInterface';
import { DefaultSiteAnimation } from './SiteAnimation/DefaultSiteAnimation';
import { SitesContext } from './Hooks';
import { Footer } from '../Site/Footer/Footer';
import { OnClickProps, Toast, ToastContainer } from 'react-bootstrap-mobile';
import { QueryDeepLinkHandler } from './DeepLinks/QueryDeepLinkHandler';

export type SiteType<PropsType> = ComponentType<PropsType>;

type ToastData =
    | {
          id: number;
          text: string;
          duration: number;
      }
    | ({
          id: number;
          text: string;
          actionName: string;
          duration: number;
      } & OnClickProps<any>);

export interface SiteData<PropsType> {
    site: SiteType<PropsType>;
    id: number;
    props: PropsType;
    onBackListener?: () => boolean | void;
    containerRefPromise: PromiseWithHandlers<React.RefObject<HTMLDivElement>>;
    footerOptions: FooterOptions;
}

const initialState = {
    isInitialized: false,
    visibleSite: -1,
    sites: [] as SiteData<any>[],
    animation: null as null | {
        type: 'start' | 'end' | 'pop-to-front';
        leavingSite: number;
    },
    defaultTopBarOptions: initialTopBarOptions,
    defaultFooterOptions: initialFooterOptions,
    footerOptions: {} as FooterOptions,
    toasts: [] as ToastData[],
};

type State = Readonly<typeof initialState>;
type Props = {
    startSite: SiteType<any>;
    style?: CSSProperties;
    className?: string;
    deepLinkHandler?: DeepLinkHandler<SiteType<any>>;
    animationHandler?: SiteAnimationInterface;
    basePath?: string;
    siteContainerClass?: string;
    contentWrapper?: ComponentType;
};

export class Sites extends PureComponent<Props, State> {
    private static instance: Sites;
    private static initialisationPromises: Promise<void>[] = [];
    private static appCreatedPromise: PromiseWithHandlers<Sites> = new PromiseWithHandlers<Sites>();

    readonly state: State = initialState;
    private lastSiteId = 0;
    private sites = new Map<number, SiteData<any>>();
    private singleInstanceSites = new Map<ComponentType<any>, number | undefined>();
    private order: number[] = [];
    private initializationPromise = new PromiseWithHandlers<void>();

    private lastToastId = 0;
    private toasts = new Map<number, ToastData>();

    private title = 'Test';
    private url = '';

    private readonly basePath: string;
    private readonly deepLinkHandler: DeepLinkHandler<SiteType<any>>;
    private readonly animationHandler: SiteAnimationInterface;

    static getInstance() {
        return this.instance;
    }

    static addInitialization(initializationFuncOrPromise: ((app: Sites) => Promise<void> | void) | Promise<void>) {
        if (typeof initializationFuncOrPromise === 'function') {
            this.initialisationPromises.push(this.appCreatedPromise.then(initializationFuncOrPromise));
        } else {
            this.initialisationPromises.push(initializationFuncOrPromise);
        }
    }

    constructor(props: Props) {
        super(props);

        if (Sites.instance) {
            throw Error(
                'there can only be one instance of this class! If react unmounts previous instance, check your code. This should not be happening!'
            );
        }

        if (props.deepLinkHandler) {
            this.deepLinkHandler = props.deepLinkHandler;
        } else {
            // this.deepLinkHandler = new RouteDeepLinkHandler<SiteType<any>>();
            this.deepLinkHandler = new QueryDeepLinkHandler<SiteType<any>>();
        }

        if (props.animationHandler) {
            this.animationHandler = props.animationHandler;
        } else {
            this.animationHandler = new DefaultSiteAnimation();
        }

        this.basePath = Helper.nonNull(props.basePath, '');
        this.deepLinkHandler.setBasePath(this.basePath);
        this.url = window.location.pathname + window.location.search + window.location.hash;
        Sites.instance = this;

        // Push state in order to allow backward navigation
        window.onpopstate = (e) => this.onPopState(e);
        window.history.pushState(null, this.title, this.url);

        this.startFirstSite();
        this.resolveInitialisationPromise();
    }

    componentDidUpdate(_prevProps: Readonly<Props>, prevState: Readonly<State>) {
        const { visibleSite, animation } = this.state;

        if (prevState.visibleSite !== visibleSite) {
            this.updateUrl();

            if (animation !== null) {
                // Handle animation
                Promise.all([
                    this.sites.get(animation.leavingSite)?.containerRefPromise,
                    this.sites.get(visibleSite)?.containerRefPromise,
                ]).then(async ([oldElementRef, newElementRef]) => {
                    const oldElement = oldElementRef?.current;
                    const newElement = newElementRef?.current;

                    if (oldElement && newElement) {
                        switch (animation.type) {
                            case 'start': {
                                await this.animationHandler.animateSiteStart(oldElement, newElement);
                                break;
                            }
                            case 'pop-to-front': {
                                await this.animationHandler.animateSitePopToFront(oldElement, newElement);
                                break;
                            }
                            case 'end': {
                                await this.animationHandler.animateSiteEnd(oldElement, newElement);
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
                        const activeSite = this.sites.get(visibleSite)!;
                        this.setState({
                            animation: animation === newAnimation ? null : newAnimation,
                            sites: Array.from(this.sites.values()),
                            footerOptions: activeSite.footerOptions,
                        });
                    }
                });
            }
        }
    }

    render() {
        const {
            isInitialized,
            sites,
            visibleSite,
            animation,
            defaultFooterOptions,
            defaultTopBarOptions,
            footerOptions,
            toasts,
        } = this.state;
        const { style, className, siteContainerClass, contentWrapper } = this.props;

        if (!isInitialized) {
            return null;
        }

        const content = (
            <SitesContext.Provider value={this}>
                <div className="sites">
                    <div style={style} className={className || 'siteContainer'}>
                        {sites.map((data) => {
                            return (
                                <SiteContainer
                                    visible={data.id === visibleSite || data.id === animation?.leavingSite}
                                    leaving={data.id === animation?.leavingSite}
                                    siteComponent={data.site}
                                    key={data.id}
                                    id={data.id}
                                    siteProps={data.props}
                                    siteContainerClass={siteContainerClass}
                                    onContainerListener={this.setContainerForSite}
                                    defaultTopBarOptions={defaultTopBarOptions}
                                />
                            );
                        })}
                    </div>
                    <Footer {...defaultFooterOptions} {...footerOptions} />
                    <ToastContainer>
                        {toasts.map((toast) => {
                            return (
                                <Toast
                                    {...toast}
                                    key={toast.id}
                                    timeToShow={toast.duration}
                                    onDismissed={this.dismissedToast}
                                    onDismissedData={toast}
                                >
                                    {toast.text}
                                </Toast>
                            );
                        })}
                    </ToastContainer>
                </div>
            </SitesContext.Provider>
        );

        if (contentWrapper) {
            const Wrapper = contentWrapper;
            return <Wrapper>{content}</Wrapper>;
        }
        return content;
    }

    dismissedToast = (toast?: ToastData) => {
        if (toast && this.toasts.has(toast.id)) {
            this.toasts.delete(toast.id);
            this.setState({ toasts: Array.from(this.toasts.values()) });
        }
    };

    addToast<Data>(
        text: string,
        action?: {
            name: string;
            action: (data?: Data) => void;
            actionData?: Data;
        },
        duration = 2500
    ) {
        this.lastToastId++;
        const id = this.lastToastId;
        let toast: ToastData = {
            id,
            text,
            duration,
        };
        if (action) {
            toast = { ...toast, actionName: action.name, onClick: action.action, onClickData: action.actionData };
        }

        this.toasts.set(id, toast);
        this.setState({ toasts: Array.from(this.toasts.values()) });
    }

    setContainerForSite = (id: number, containerRef: React.RefObject<HTMLDivElement>) => {
        if (this.sites.has(id)) {
            this.sites.get(id)!.containerRefPromise.resolve(containerRef);
        }
    };

    registerSingleInstanceSite(site: ComponentType) {
        if (!this.singleInstanceSites.has(site)) {
            this.singleInstanceSites.set(site, undefined);
        }
    }

    updateSiteProps(siteId: number, newProps: any) {
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
        } else {
            this.url = this.basePath;
        }

        window.history.replaceState(null, this.title, this.url);
    }

    private async startFirstSite() {
        const { startSite } = this.props;
        await this.initializationPromise;

        const urlPath = window.location.pathname + window.location.search + window.location.hash;

        const deepLinkSiteData = this.deepLinkHandler.calculateSite(urlPath);
        if (typeof deepLinkSiteData !== 'undefined') {
            this.startSite(deepLinkSiteData.site, deepLinkSiteData.params);
        } else {
            this.startSite(startSite);
        }
    }

    private async resolveInitialisationPromise() {
        document.addEventListener(
            'deviceready',
            async () => {
                Sites.appCreatedPromise.resolve(this);
                await Promise.all(Sites.initialisationPromises);
                this.initializationPromise.resolve();
            },
            true
        );
        await this.initializationPromise;
        this.setState({ isInitialized: true });
    }

    onPopState(e: PopStateEvent) {
        e.preventDefault();
        // pushState so that you can go back again
        window.history.pushState(null, this.title, this.url);
        this.goBack();
    }

    canGoBack() {
        return this.order.length > 1;
    }

    goBack(callOnBackListener = true) {
        const currentSiteId = this.order[this.order.length - 1];
        if (callOnBackListener) {
            const listener = this.sites.get(currentSiteId)?.onBackListener;
            if (listener && listener()) {
                return;
            }
        }

        this.removeSite(currentSiteId);
    }

    getDeepLinkHandler() {
        return this.deepLinkHandler;
    }

    addDeepLink(link: string, site: SiteType<any>) {
        this.deepLinkHandler.set(link, site);
    }

    startSite<PropsType extends Record<string, any>>(site: ComponentType<PropsType>, props?: PropsType) {
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
            containerRefPromise: new PromiseWithHandlers<React.RefObject<HTMLDivElement>>(),
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

    showSite(siteId: number) {
        if (this.sites.has(siteId)) {
            const activeSite = this.sites.get(siteId)!;
            const { visibleSite } = this.state;

            const orderIndex = this.order.indexOf(siteId);
            if (orderIndex !== this.order.length - 1) {
                if (orderIndex !== -1) this.order.splice(orderIndex, 1);
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

    async removeSite(siteId: number) {
        if (this.sites.has(siteId)) {
            const siteToRemove = this.sites.get(siteId)!;
            let visibleSiteIndex = this.order.length - 1;

            const orderIndex = this.order.indexOf(siteId);
            if (orderIndex !== -1) {
                this.order.splice(orderIndex, 1);
            }

            if (orderIndex === visibleSiteIndex) {
                visibleSiteIndex--;
                const visibleSiteId = visibleSiteIndex >= 0 ? this.order[visibleSiteIndex] : -1;
                const activeSite = this.sites.get(visibleSiteId);
                const footerOptions = activeSite?.footerOptions ?? {};

                await this.setState({
                    visibleSite: visibleSiteId,
                    animation: {
                        type: 'end',
                        leavingSite: siteId,
                    },
                    footerOptions,
                });
            } else {
                this.sites.delete(siteId);
                this.setState({ sites: Array.from(this.sites.values()) });
            }
            if (this.singleInstanceSites.has(siteToRemove.site)) {
                this.singleInstanceSites.delete(siteToRemove.site);
            }
        }
    }

    getSiteDataById(siteId: number) {
        return this.sites.get(siteId);
    }

    setOnBackListener(siteId: number, listener: () => boolean | void) {
        const siteContainer = this.sites.get(siteId);
        if (siteContainer) {
            siteContainer.onBackListener = listener;
        }
    }

    updateDefaultTopBarOptions(newOptions: TopBarOptionsWithButtonFunctions) {
        const { defaultTopBarOptions } = this.state;

        if (typeof newOptions.rightButtons === 'function') {
            newOptions.rightButtons = newOptions.rightButtons(defaultTopBarOptions.rightButtons ?? []);
        }
        if (typeof newOptions.leftButtons === 'function') {
            newOptions.leftButtons = newOptions.leftButtons(defaultTopBarOptions.leftButtons ?? []);
        }

        this.setState({
            defaultTopBarOptions: {
                ...defaultTopBarOptions,
                ...(newOptions as TopBarOptions),
            },
        });
    }

    updateDefaultFooterOptions(newOptions: FooterOptions) {
        const { defaultFooterOptions } = this.state;
        this.setState({
            defaultFooterOptions: {
                ...defaultFooterOptions,
                ...newOptions,
            },
        });
    }

    updateFooterOptions(siteId: number, newOptions: FooterOptions) {
        const site = this.sites.get(siteId);
        const { visibleSite } = this.state;
        if (!site) {
            return;
        }
        site.footerOptions = {
            ...site.footerOptions,
            ...newOptions,
        };

        if (visibleSite === siteId) {
            this.setState({ footerOptions: site.footerOptions });
        }
    }
}
