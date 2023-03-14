import * as React from 'react';
import { TopBarProps } from './TopBar/TopBar';
import { Override, TopBarButtonType } from '@ainias42/react-bootstrap-mobile';
import { FooterButton } from './Footer/Footer';
export declare const initialTopBarOptions: TopBarProps;
export declare const initialFooterOptions: {
    visible: boolean;
    buttons: FooterButton[];
};
export type TopBarOptions = Partial<TopBarProps>;
export type TopBarOptionsWithButtonFunctions = Partial<Override<TopBarProps, {
    rightButtons: TopBarButtonType[] | ((defaultButtons: TopBarButtonType[]) => TopBarButtonType[]);
    leftButtons: TopBarButtonType[] | ((defaultButtons: TopBarButtonType[]) => TopBarButtonType[]);
}>>;
export type FooterOptions = Partial<typeof initialFooterOptions & {
    activeTab: number;
}>;
declare const initialState: {
    topBarOptions: Partial<Override<TopBarProps, {
        rightButtons: TopBarButtonType[] | ((defaultButtons: TopBarButtonType[]) => TopBarButtonType[]);
        leftButtons: TopBarButtonType[] | ((defaultButtons: TopBarButtonType[]) => TopBarButtonType[]);
    }>>;
    useFullWidth: boolean;
};
type State = Readonly<typeof initialState>;
type Props<SitePropsType> = {
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
declare class SiteContainer<SitePropsType> extends React.PureComponent<Props<SitePropsType>, State> {
    readonly state: State;
    container: React.RefObject<HTMLDivElement>;
    child: React.RefObject<HTMLDivElement>;
    componentDidMount(): void;
    getSnapshotBeforeUpdate(prevProps: Readonly<Props<SitePropsType>>): null;
    componentDidUpdate(prevProps: Readonly<Props<SitePropsType>>): void;
    render(): JSX.Element;
    setUseFullWidth(useFullWidth: boolean): void;
    updateTopBarOptions(newOptions: TopBarOptionsWithButtonFunctions): void;
}
export type SiteContainerType<T> = SiteContainer<T>;
declare const SiteContainerMemo: typeof SiteContainer;
export { SiteContainerMemo as SiteContainer };
