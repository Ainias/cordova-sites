import * as React from 'react';
import { ComponentType, CSSProperties, PureComponent } from 'react';
import { PromiseWithHandlers } from 'js-helper';
import { SiteProps, SiteType } from '../Site/Site';
import { DeepLinkHandler } from './DeepLinks/DeepLinkHandler';
import { SiteAnimationInterface } from './SiteAnimation/SiteAnimationInterface';
export interface SiteData {
    site: ComponentType<SiteProps>;
    id: number;
    props: any;
    onBackListener?: () => boolean | void;
    containerRefPromise: PromiseWithHandlers<React.RefObject<HTMLDivElement>>;
}
declare const initialState: {
    isInitialized: boolean;
    visibleSite: number;
    sites: SiteData[];
    animation: {
        type: 'start' | 'end' | 'pop-to-front';
        leavingSite: number;
    } | null;
};
declare type State = Readonly<typeof initialState>;
declare type Props = {
    startSite: SiteType;
    style?: CSSProperties;
    className?: string;
    deepLinkHandler?: DeepLinkHandler<SiteType>;
    animationHandler?: SiteAnimationInterface;
    basePath?: string;
    siteContainerClass?: string;
    contentWrapper?: ComponentType;
};
export declare class Sites extends PureComponent<Props, State> {
    private static instance;
    private static initialisationPromises;
    private static appCreatedPromise;
    readonly state: State;
    private sites;
    private lastSiteId;
    private order;
    private initializationPromise;
    private title;
    private url;
    private readonly basePath;
    private readonly deepLinkHandler;
    private readonly animationHandler;
    static getInstance(): Sites;
    static addInitialization(initializationFuncOrPromise: ((app: Sites) => Promise<void> | void) | Promise<void>): void;
    constructor(props: Props);
    componentDidUpdate(_prevProps: Readonly<Props>, prevState: Readonly<State>): void;
    render(): JSX.Element | null;
    private startFirstSite;
    private resolveInitialisationPromise;
    setContainerForSite: (id: number, containerRef: React.RefObject<HTMLDivElement>) => void;
    onPopState(e: PopStateEvent): void;
    canGoBack(): boolean;
    goBack(callOnBackListener?: boolean): void;
    getDeepLinkHandler(): DeepLinkHandler<SiteType>;
    addDeepLink(link: string, site: SiteType): void;
    startSite(site: ComponentType<Record<string, any> & SiteProps>, props?: any): void;
    showSite(siteId: number): void;
    removeSite(siteId: number): Promise<void>;
    getSiteDataById(siteId: number): SiteData | undefined;
    setOnBackListener(siteId: number, listener: () => boolean | void): void;
}
export {};
