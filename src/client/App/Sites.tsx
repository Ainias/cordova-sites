import * as React from 'react';
import { ComponentType, CSSProperties, PureComponent } from 'react';
import {
    FooterOptions,
    initialFooterOptions,
    initialTopBarOptions,
    SiteContainer,
    TopBarOptions,
} from '../Site/SiteContainer';
import { PromiseWithHandlers } from '@ainias42/js-helper';
import { SiteAnimationInterface } from './SiteAnimation/SiteAnimationInterface';
import { DefaultSiteAnimation } from './SiteAnimation/DefaultSiteAnimation';
import { SitesContext } from './Hooks';
import { Footer } from '../Site/Footer/Footer';
import {
    Listener,
    Toast,
    ToastContainer,
    Block,
    Text,
    Flex,
    withMemo,
    DialogContainer, DialogContainerProps, DialogContainerRef, ShowDialog, EmptyProps,
} from '@ainias42/react-bootstrap-mobile';
import { NextRouter, withRouter } from 'next/router';
import { AppProps } from 'next/app';
import { UrlObject } from 'url';
import { PrefetchOptions } from 'next/dist/shared/lib/router/router';

import styles from './sites.scss';
import { useSitesState } from '../useSitesState';
import hoistNonReactStatics from "hoist-non-react-statics";

export type TransitionOptions = {
    scroll?: boolean;
    shallow?: boolean;
    locale?: string;
};

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
      } & Listener<'onClick', any>);

export type SiteData<PropsType> = {
    id: number;
    onBackListener?: () => boolean | void;
    containerRefPromise: PromiseWithHandlers<React.RefObject<HTMLDivElement>>;
    footerOptions: FooterOptions;
    finished: boolean;
    url: string;
} & AppProps<PropsType>;

const initialState = {
    isInitialized: true,
    currentSiteId: 1,
    sites: [] as SiteData<any>[],
    animation: null as
        | null
        | ({
              leavingSite: number;
          } & (
              | {
                    type: 'start';
                }
              | { type: 'end'; sitesToDelete?: number }
          )),
    defaultTopBarOptions: initialTopBarOptions,
    defaultFooterOptions: initialFooterOptions,
    footerOptions: {} as FooterOptions,
    toasts: [] as ToastData[],
};

type State = typeof initialState;
type Props = {
    style?: CSSProperties;
    className?: string;
    animationHandler?: SiteAnimationInterface;
    basePath?: string;
    siteContainerClass?: string;
    contentWrapper?: ComponentType;
    router: NextRouter;
    currentSite: AppProps;
    defaultTopBarOptions?: TopBarOptions;
    defaultFooterOptions?: FooterOptions;
};

class SitesInner extends PureComponent<Props, State> {
    private static instance: SitesInner;

    readonly state: State;
    private currentSiteId = -1;
    private sites = new Map<number, SiteData<any>>();


    private lastToastId = 0;
    private toasts = new Map<number, ToastData>();
    private pushingNewSite = true;
    private isInternalNavigation = false;
    private dialogContainerRef = React.createRef<DialogContainerRef>()

    private readonly animationHandler: SiteAnimationInterface;

    public static getInstance(){
        return SitesInner.instance;
    }

    constructor(props: Props) {
        super(props);
        SitesInner.instance = this;

        const { defaultTopBarOptions, defaultFooterOptions } = this.props;

        if (props.animationHandler) {
            this.animationHandler = props.animationHandler;
        } else {
            this.animationHandler = new DefaultSiteAnimation();
        }

        this.sites.set(this.currentSiteId, {
            ...props.currentSite,
            id: this.currentSiteId,
            containerRefPromise: new PromiseWithHandlers<React.RefObject<HTMLDivElement>>(),
            footerOptions: {},
            finished: false,
            url: props.router.asPath,
        });

        // eslint-disable-next-line react/state-in-constructor
        this.state = {
            ...initialState,
            currentSiteId: this.currentSiteId,
            animation: null,
            sites: this.getActiveSites(),
            defaultFooterOptions: { ...initialFooterOptions, ...(defaultFooterOptions ?? {}) },
            defaultTopBarOptions: { ...initialTopBarOptions, ...(defaultTopBarOptions ?? {}) },
        };
    }

    componentDidMount() {
        const { router } = this.props;
        router.beforePopState(() => false);
        window.history.replaceState(null, '');
        window.history.pushState(null, '', router.asPath);
        window.onpopstate = (e) => this.onPopState(e);
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        const { currentSite, defaultTopBarOptions, defaultFooterOptions } = this.props;
        const {
            currentSiteId,
            animation,
            defaultFooterOptions: stateDefaultFooterOptions,
            defaultTopBarOptions: stateDefaultTopBarOptions,
        } = this.state;

        if (defaultTopBarOptions !== prevProps.defaultTopBarOptions) {
            this.setState({
                defaultTopBarOptions: { ...stateDefaultTopBarOptions, ...defaultTopBarOptions },
            });
        }
        if (defaultFooterOptions !== prevProps.defaultFooterOptions) {
            this.setState({
                defaultFooterOptions: { ...stateDefaultFooterOptions, ...defaultFooterOptions },
            });
        }

        if (currentSite !== prevProps.currentSite) {
            if (this.pushingNewSite) {
                this.currentSiteId++;
                this.pushingNewSite = false;
            }
            this.addOrUpdateCurrentSite(currentSite);
        }

        if (prevState.currentSiteId !== currentSiteId) {
            if (animation !== null) {
                const leavingSiteData = this.sites.get(animation.leavingSite);
                const currentSiteData = this.sites.get(currentSiteId);

                if (leavingSiteData && currentSiteData) {
                    // Handle animation
                    Promise.all([leavingSiteData.containerRefPromise, currentSiteData.containerRefPromise]).then(
                        async ([oldElementRef, newElementRef]) => {
                            const oldElement = oldElementRef?.current;
                            const newElement = newElementRef?.current;

                            if (oldElement && newElement) {
                                switch (animation?.type) {
                                    case 'start': {
                                        await this.animationHandler.animateSiteStart(oldElement, newElement);
                                        break;
                                    }
                                    case 'end': {
                                        await this.animationHandler.animateSiteEnd(oldElement, newElement);

                                        for (let i = 0; i < (animation.sitesToDelete ?? 1); i++) {
                                            this.sites.delete(animation.leavingSite - i);
                                        }

                                        break;
                                    }
                                }

                                const { animation: newAnimation } = this.state;
                                const activeSite = this.sites.get(currentSiteId)!;
                                this.setState({
                                    animation: animation === newAnimation ? null : newAnimation,
                                    sites: this.getActiveSites(),
                                    footerOptions: activeSite ? activeSite.footerOptions : {},
                                });
                            }
                        }
                    );
                }
            }
        }
    }

    render() {
        const {
            isInitialized,
            currentSiteId,
            animation,
            defaultFooterOptions,
            defaultTopBarOptions,
            footerOptions,
            toasts,
        } = this.state;
        let { sites } = this.state;
        const { style, className, siteContainerClass, contentWrapper } = this.props;

        if (!isInitialized) {
            return null;
        }

        if (animation && animation.type === 'end') {
            const animationSite = this.sites.get(animation.leavingSite);
            if (animationSite) {
                sites = [...sites, animationSite];
            }
        }

        const content = (
            <SitesContext.Provider value={this}>
                <DialogContainer ref={this.dialogContainerRef}>
                    <Flex className={styles.sites}>
                        <Block style={style} className={className || styles.siteContainer}>
                            {sites.map((data) => {
                                return (
                                    <SiteContainer
                                        visible={data.id === currentSiteId || data.id === animation?.leavingSite}
                                        leaving={data.id === animation?.leavingSite}
                                        siteComponent={data.Component}
                                        key={data.id}
                                        id={data.id}
                                        siteProps={data.pageProps}
                                        siteContainerClass={siteContainerClass}
                                        onContainerListener={this.setContainerForSite}
                                        defaultTopBarOptions={defaultTopBarOptions}
                                    />
                                );
                            })}
                        </Block>
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
                                        <Text>{toast.text}</Text>
                                    </Toast>
                                );
                            })}
                        </ToastContainer>
                    </Flex>
                </DialogContainer>
            </SitesContext.Provider>
        );

        if (contentWrapper) {
            const Wrapper = contentWrapper;
            return <Wrapper>{content}</Wrapper>;
        }
        return content;
    }

    private dismissedToast = (toast?: ToastData) => {
        if (toast && this.toasts.has(toast.id)) {
            this.toasts.delete(toast.id);
            this.setState({ toasts: Array.from(this.toasts.values()) });
        }
    };

    setContainerForSite = (id: number, containerRef: React.RefObject<HTMLDivElement>) => {
        const siteData = this.sites.get(id);
        if (siteData && !siteData.finished) {
            siteData.containerRefPromise.resolve(containerRef);
        }
    };

    private onPopState = (_: PopStateEvent) => {
        // only back button triggers this. Therefore push again the state and handle internal change
        window.history.pushState(null, '', this.sites.get(this.currentSiteId)?.url);
        this.goBack();
        return false;
    };

    private addOrUpdateCurrentSite(nextPage: AppProps) {
        const id = this.currentSiteId;
        const { currentSiteId } = this.state;
        const { router } = this.props;

        if (this.sites.has(id)) {
            const currentData = this.sites.get(id);
            if (currentData) {
                this.sites.set(id, {
                    ...currentData,
                    pageProps: nextPage.pageProps,
                });
            } else {
                // TODO Sollte nicht vorkommen!
                throw new Error('Not possible!');
            }
        } else {
            this.sites.set(id, {
                ...nextPage,
                id,
                containerRefPromise: new PromiseWithHandlers<React.RefObject<HTMLDivElement>>(),
                footerOptions: {},
                finished: false,
                url: router.asPath,
            });
        }

        const newState = {
            currentSiteId: id,
            sites: this.getActiveSites(),
            footerOptions: {},
        };

        if (id > currentSiteId) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            newState.animation = {
                type: 'start' as const,
                leavingSite: currentSiteId,
            };
        }

        this.setState(newState);
    }

    private getActiveSites() {
        let minSiteId = Infinity;
        const sites = Array.from(this.sites.values()).filter((s) => {
            if (!s.finished) {
                minSiteId = Math.min(minSiteId, s.id);
                return true;
            }
            return false;
        }) as SiteData<any>[];
        useSitesState.getState().setMinimumActiveSite(minSiteId);
        return sites;
    }

    canGoBack() {
        const { sites } = this.state;
        return sites.length >= 2;
    }

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

    showDialog<P = EmptyProps,
        R = any,
        C extends ComponentType<(P & { close: (result?: R) => void }) | P> = ComponentType<
            (P & { close: (result?: R) => void }) | P
        >>( dialog: C,
            props?: Omit<P, 'close'>): Promise<R | void>|undefined {
        return this.dialogContainerRef.current?.showDialog<P, R, C>(dialog, props);
    }

    goBack(callOnBackListener = true) {
        const { currentSiteId } = this;
        if (callOnBackListener) {
            const siteData = this.sites.get(currentSiteId);
            if (siteData && !siteData.finished) {
                const listener = siteData.onBackListener;
                if (listener && listener()) {
                    return undefined;
                }
            }
        }

        return this.finish(currentSiteId);
    }

    push(url: UrlObject | string, as?: UrlObject | string, options?: TransitionOptions) {
        const { router } = this.props;

        this.pushingNewSite = true;
        return router.replace(url, as, options);
    }

    prefetch(url: string, as?: string, prefetchOptions?: PrefetchOptions) {
        const { router } = this.props;

        return router.prefetch(url, as, prefetchOptions);
    }

    async finish(siteId: number) {
        const siteData = this.sites.get(siteId);
        if (siteData && !siteData.finished) {
            siteData.finished = true;
            this.checkCurrentSite();
        }
    }

    private checkCurrentSite() {
        let deletedSites = 0;
        while (this.sites.get(this.currentSiteId)?.finished) {
            this.currentSiteId--;
            deletedSites++;
        }

        if (!this.sites.get(this.currentSiteId)) {
            this.allSitesFinished();
            return;
        }

        // console.log('LOG-d deletedSites', deletedSites, this.currentSiteId);

        const newState: Partial<State> = {
            currentSiteId: this.currentSiteId,
            sites: this.getActiveSites(),
            footerOptions: {},
        };

        if (deletedSites > 0) {
            this.isInternalNavigation = true;
            window.history.replaceState(null, '', this.sites.get(this.currentSiteId)?.url);
            newState.animation = {
                type: 'end',
                leavingSite: this.currentSiteId + deletedSites,
                sitesToDelete: deletedSites,
            };
        }

        this.setState(newState as Readonly<State>);
    }

    private allSitesFinished() {
        // Finished application, go back
        window.history.go(-2);
    }

    getSiteDataById(siteId: number) {
        return this.sites.get(siteId);
    }

    setOnBackListener(siteId: number, listener: () => boolean | void) {
        const siteData = this.sites.get(siteId);
        if (siteData && !siteData.finished) {
            siteData.onBackListener = listener;
        }
    }

    updateFooterOptions(siteId: number, newOptions: FooterOptions) {
        const site = this.sites.get(siteId);
        const { currentSiteId } = this.state;
        if (!site || site.finished) {
            return;
        }
        site.footerOptions = {
            ...site.footerOptions,
            ...newOptions,
        };

        if (currentSiteId === siteId) {
            this.setState({ footerOptions: site.footerOptions });
        }
    }
}

export type { SitesInner as SitesType };
const SitesWithRouter = withRouter(withMemo(SitesInner, styles)) as typeof SitesInner;
hoistNonReactStatics(SitesWithRouter, SitesInner);
export { SitesWithRouter as Sites };
