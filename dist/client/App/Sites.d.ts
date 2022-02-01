import * as React from 'react';
import { ComponentType, CSSProperties, PureComponent } from 'react';
import { FooterOptions, TopBarOptionsWithButtonFunctions } from '../Site/SiteContainer';
import { PromiseWithHandlers } from 'js-helper';
import { DeepLinkHandler } from './DeepLinks/DeepLinkHandler';
import { SiteAnimationInterface } from './SiteAnimation/SiteAnimationInterface';
import { OnClickProps } from 'react-bootstrap-mobile';
export declare type SiteType<PropsType> = ComponentType<PropsType>;
declare type ToastData = {
    id: number;
    text: string;
    duration: number;
} | ({
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
declare const initialState: {
    isInitialized: boolean;
    visibleSite: number;
    sites: SiteData<any>[];
    animation: {
        type: 'start' | 'end' | 'pop-to-front';
        leavingSite: number;
    } | null;
    defaultTopBarOptions: import("../../client").TopBarProps<import("i18next").StringMap>;
    defaultFooterOptions: {
        visible: boolean;
        buttons: import("../Site/Footer/Footer").FooterButton[];
    };
    footerOptions: Partial<{
        visible: boolean;
        buttons: import("../Site/Footer/Footer").FooterButton[];
    } & {
        activeTab: number;
    }>;
    toasts: ToastData[];
};
declare type State = Readonly<typeof initialState>;
declare type Props = {
    startSite: SiteType<any>;
    style?: CSSProperties;
    className?: string;
    deepLinkHandler?: DeepLinkHandler<SiteType<any>>;
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
    private lastSiteId;
    private sites;
    private singleInstanceSites;
    private order;
    private initializationPromise;
    private lastToastId;
    private toasts;
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
    dismissedToast: (toast?: ToastData | undefined) => void;
    addToast<Data>(text: string, action?: {
        name: string;
        action: (data?: Data) => void;
        actionData?: Data;
    }, duration?: number): void;
    setContainerForSite: (id: number, containerRef: React.RefObject<HTMLDivElement>) => void;
    registerSingleInstanceSite(site: ComponentType): void;
    updateSiteProps(siteId: number, newProps: any): void;
    updateUrl(): void;
    private startFirstSite;
    private resolveInitialisationPromise;
    onPopState(e: PopStateEvent): void;
    canGoBack(): boolean;
    goBack(callOnBackListener?: boolean): void;
    getDeepLinkHandler(): DeepLinkHandler<SiteType<any>>;
    addDeepLink(link: string, site: SiteType<any>): void;
    startSite<PropsType extends Record<string, any>>(site: ComponentType<PropsType>, props?: PropsType): void;
    showSite(siteId: number): void;
    removeSite(siteId: number): Promise<void>;
    getSiteDataById(siteId: number): SiteData<any> | undefined;
    setOnBackListener(siteId: number, listener: () => boolean | void): void;
    updateDefaultTopBarOptions(newOptions: TopBarOptionsWithButtonFunctions): void;
    updateDefaultFooterOptions(newOptions: FooterOptions): void;
    updateFooterOptions(siteId: number, newOptions: FooterOptions): void;
}
export {};
