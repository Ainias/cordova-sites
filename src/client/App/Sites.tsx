import * as React from 'react';
import { ComponentType, CSSProperties, PureComponent } from 'react';
import { SiteContainer } from '../Site/SiteContainer';
import { Helper, PromiseWithHandlers } from 'js-helper';
import { SiteProps, SiteType } from '../Site/Site';
import { DeepLinkHandler } from './DeepLinks/DeepLinkHandler';
import { RouteDeepLinkHandler } from './DeepLinks/RouteDeepLinkHandler';
import { SiteAnimationInterface } from './SiteAnimation/SiteAnimationInterface';
import { DefaultSiteAnimation } from './SiteAnimation/DefaultSiteAnimation';
import { SitesContext } from './Hooks';

export interface SiteData {
    site: ComponentType<SiteProps>;
    id: number;
    props: any;
    onBackListener?: () => boolean | void;
    containerRefPromise: PromiseWithHandlers<React.RefObject<HTMLDivElement>>;
}

const initialState = {
    isInitialized: false,
    visibleSite: -1,
    sites: [] as SiteData[],
    animation: null as null | {
        type: 'start' | 'end' | 'pop-to-front';
        leavingSite: number;
    },
};

type State = Readonly<typeof initialState>;
type Props = {
    startSite: SiteType;
    style?: CSSProperties;
    className?: string;
    deepLinkHandler?: DeepLinkHandler<SiteType>;
    animationHandler?: SiteAnimationInterface;
    basePath?: string;
    siteContainerClass?: string;
};

export class Sites extends PureComponent<Props, State> {
    private static instance: Sites;
    private static initialisationPromises: Promise<void>[] = [];
    private static appCreatedPromise: PromiseWithHandlers<Sites> = new PromiseWithHandlers<Sites>();

    readonly state: State = initialState;
    private sites: Map<number, SiteData> = new Map<number, SiteData>();
    private lastSiteId = 0;
    private order: number[] = [];
    private initializationPromise = new PromiseWithHandlers<void>();

    private title = 'Test';
    private url = '';

    private readonly basePath: string;
    private readonly deepLinkHandler: DeepLinkHandler<SiteType>;
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
            this.deepLinkHandler = new RouteDeepLinkHandler<SiteType>();
        }

        if (props.animationHandler) {
            this.animationHandler = props.animationHandler;
        } else {
            this.animationHandler = new DefaultSiteAnimation();
        }

        this.basePath = Helper.nonNull(props.basePath, '');
        this.deepLinkHandler.setBasePath(this.basePath);
        this.url = this.basePath;
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
            const siteContainer = this.sites.get(visibleSite);
            if (siteContainer) {
                this.url = this.deepLinkHandler.createDeepLinkForSite(siteContainer.site, siteContainer.props);
            } else {
                this.url = this.basePath;
            }
            window.history.replaceState(null, this.title, this.url);

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
                        this.setState({
                            animation: animation === newAnimation ? null : newAnimation,
                            sites: Array.from(this.sites.values()),
                        });
                    }
                });
            }
        }
    }

    render() {
        const { isInitialized, sites, visibleSite, animation } = this.state;
        const { style, className, siteContainerClass } = this.props;

        if (!isInitialized) {
            return null;
        }

        return (
            <div style={style} className={className || 'siteContainer'}>
                <SitesContext.Provider value={this}>
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
                            />
                        );
                    })}
                </SitesContext.Provider>
            </div>
        );
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

    setContainerForSite = (id: number, containerRef: React.RefObject<HTMLDivElement>) => {
        if (this.sites.has(id)) {
            this.sites.get(id)!.containerRefPromise.resolve(containerRef);
        }
    };

    onPopState(e: PopStateEvent) {
        console.log('popState fired');
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
            if (listener && listener() === true) {
                return;
            }
        }

        this.removeSite(currentSiteId);
    }

    getDeepLinkHandler() {
        return this.deepLinkHandler;
    }

    addDeepLink(link: string, site: SiteType) {
        this.deepLinkHandler.set(link, site);
    }

    startSite(site: ComponentType<Record<string, any> & SiteProps>, props?: any) {
        const { visibleSite } = this.state;

        const nextId = ++this.lastSiteId;
        this.sites.set(nextId, {
            site,
            props,
            id: nextId,
            containerRefPromise: new PromiseWithHandlers<React.RefObject<HTMLDivElement>>(),
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
    }

    showSite(siteId: number) {
        if (this.sites.has(siteId)) {
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
            });
        }
    }

    async removeSite(siteId: number) {
        if (this.sites.has(siteId)) {
            const orderIndex = this.order.indexOf(siteId);
            let visibleSiteIndex = this.order.length - 1;
            if (orderIndex !== -1) {
                this.order.splice(orderIndex, 1);
            }
            if (orderIndex === visibleSiteIndex) {
                visibleSiteIndex--;
                const visibleSiteId = visibleSiteIndex >= 0 ? this.order[visibleSiteIndex] : -1;

                await this.setState({
                    visibleSite: visibleSiteId,
                    animation: {
                        type: 'end',
                        leavingSite: siteId,
                    },
                });
            } else {
                this.sites.delete(siteId);
                this.setState({ sites: Array.from(this.sites.values()) });
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
}
