import * as React from 'react';
import { SiteProps } from './Site';
import type { TopBarButtonType } from 'react-bootstrap-mobile';
declare const initialTopBarOptions: {
    title: string | undefined;
    leftButtons: TopBarButtonType[];
    rightButtons: TopBarButtonType[];
    backButton: false | TopBarButtonType | undefined;
};
declare const initialState: {
    topBarOptions: {
        title: string | undefined;
        leftButtons: TopBarButtonType[];
        rightButtons: TopBarButtonType[];
        backButton: false | TopBarButtonType | undefined;
    };
};
export declare type TopBarOptions = Partial<typeof initialTopBarOptions>;
declare type State = Readonly<typeof initialState>;
declare type Props = {
    visible: boolean;
    leaving: boolean;
    id: number;
    siteComponent: React.ComponentType<SiteProps>;
    siteProps: any;
    siteContainerStyle?: {
        [key: string]: string | number;
    };
    siteContainerClass?: string;
    onContainerListener?: (id: number, ref: React.RefObject<HTMLDivElement>) => void;
};
export declare class SiteContainer extends React.PureComponent<Props, State> {
    readonly state: State;
    container: React.RefObject<HTMLDivElement>;
    child: React.RefObject<HTMLDivElement>;
    componentDidMount(): void;
    getSnapshotBeforeUpdate(prevProps: Readonly<Props>): null;
    componentDidUpdate(prevProps: Readonly<Props>): void;
    render(): JSX.Element;
    updateTopBarOptions(newOptions: TopBarOptions): void;
}
export {};
