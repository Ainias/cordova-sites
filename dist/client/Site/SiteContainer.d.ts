import * as React from 'react';
import { SitesTopBarButtonType, TopBarProps } from './TopBar/TopBar';
import { FooterButton } from './Footer/Footer';
import { StringMap } from 'i18next';
import { Override } from 'react-bootstrap-mobile';
export declare const initialTopBarOptions: TopBarProps<StringMap>;
export declare const initialFooterOptions: {
    visible: boolean;
    buttons: FooterButton[];
};
export declare type TopBarOptions = Partial<TopBarProps<StringMap>>;
export declare type TopBarOptionsWithButtonFunctions = Partial<Override<TopBarProps<StringMap>, {
    rightButtons: SitesTopBarButtonType<StringMap>[] | ((defaultButtons: SitesTopBarButtonType<StringMap>[]) => SitesTopBarButtonType<StringMap>[]);
    leftButtons: SitesTopBarButtonType<StringMap>[] | ((defaultButtons: SitesTopBarButtonType<StringMap>[]) => SitesTopBarButtonType<StringMap>[]);
}>>;
export declare type FooterOptions = Partial<typeof initialFooterOptions & {
    activeTab: number;
}>;
declare const initialState: {
    topBarOptions: Partial<Override<TopBarProps<StringMap>, {
        rightButtons: SitesTopBarButtonType<StringMap>[] | ((defaultButtons: SitesTopBarButtonType<StringMap>[]) => SitesTopBarButtonType<StringMap>[]);
        leftButtons: SitesTopBarButtonType<StringMap>[] | ((defaultButtons: SitesTopBarButtonType<StringMap>[]) => SitesTopBarButtonType<StringMap>[]);
    }>>;
};
declare type State = Readonly<typeof initialState>;
declare type Props<SitePropsType> = {
    visible: boolean;
    leaving: boolean;
    id: number;
    siteComponent: React.ComponentType<SitePropsType>;
    siteProps: SitePropsType;
    siteContainerStyle?: {
        [key: string]: string | number;
    };
    siteContainerClass?: string;
    onContainerListener?: (id: number, ref: React.RefObject<HTMLDivElement>) => void;
    defaultTopBarOptions: typeof initialTopBarOptions;
};
export declare class SiteContainer<SitePropsType> extends React.PureComponent<Props<SitePropsType>, State> {
    readonly state: State;
    container: React.RefObject<HTMLDivElement>;
    child: React.RefObject<HTMLDivElement>;
    componentDidMount(): void;
    getSnapshotBeforeUpdate(prevProps: Readonly<Props<SitePropsType>>): null;
    componentDidUpdate(prevProps: Readonly<Props<SitePropsType>>): void;
    render(): JSX.Element;
    updateTopBarOptions(newOptions: TopBarOptionsWithButtonFunctions): void;
}
export {};
