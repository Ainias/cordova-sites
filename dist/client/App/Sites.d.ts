/// <reference types="node" />
import * as React from 'react';
import { ComponentType, CSSProperties, PureComponent } from 'react';
import { FooterOptions, TopBarOptions } from '../Site/SiteContainer';
import { PromiseWithHandlers } from '@ainias42/js-helper';
import { SiteAnimationInterface } from './SiteAnimation/SiteAnimationInterface';
import { Listener } from '@ainias42/react-bootstrap-mobile';
import { NextRouter } from 'next/router';
import { AppProps } from 'next/app';
import { UrlObject } from 'url';
import { PrefetchOptions } from 'next/dist/shared/lib/router/router';
type TransitionOptions = {
    scroll?: boolean;
    shallow?: boolean;
    locale?: string;
};
export type SiteType<PropsType> = ComponentType<PropsType>;
type ToastData = {
    id: number;
    text: string;
    duration: number;
} | ({
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
} & AppProps<PropsType>;
declare const initialState: {
    isInitialized: boolean;
    currentSiteId: number;
    sites: SiteData<any>[];
    animation: ({
        leavingSite: number;
    } & ({
        type: 'start';
    } | {
        type: 'end';
        sitesToDelete?: number | undefined;
    })) | null;
    defaultTopBarOptions: import("../../client").TopBarProps;
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
declare class SitesInner extends PureComponent<Props, State> {
    readonly state: State;
    private currentSiteId;
    private sites;
    private lastToastId;
    private toasts;
    private pushingNewSite;
    private isInternalNavigation;
    private readonly animationHandler;
    constructor(props: Props);
    componentDidMount(): void;
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void;
    render(): JSX.Element | null;
    private dismissedToast;
    setContainerForSite: (id: number, containerRef: React.RefObject<HTMLDivElement>) => void;
    private onPopState;
    private addOrUpdateCurrentSite;
    private getActiveSites;
    canGoBack(): boolean;
    addToast<Data>(text: string, action?: {
        name: string;
        action: (data?: Data) => void;
        actionData?: Data;
    }, duration?: number): void;
    goBack(callOnBackListener?: boolean): Promise<void> | undefined;
    push(url: UrlObject | string, as?: UrlObject | string, options?: TransitionOptions): Promise<boolean>;
    prefetch(url: string, as?: string, prefetchOptions?: PrefetchOptions): Promise<void>;
    removeSite(siteId: number): Promise<void>;
    private checkCurrentSite;
    getSiteDataById(siteId: number): SiteData<any> | undefined;
    setOnBackListener(siteId: number, listener: () => boolean | void): void;
    updateFooterOptions(siteId: number, newOptions: FooterOptions): void;
}
export type { SitesInner as SitesType };
declare const SitesWithRouter: typeof SitesInner;
export { SitesWithRouter as Sites };
