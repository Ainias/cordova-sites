import { ComponentType, PureComponent } from 'react';
declare const defaultState: {};
export declare type SiteProps = {
    id: number;
    visible: boolean;
};
declare type State = Readonly<typeof defaultState>;
export declare class Site<TProps extends SiteProps, TState extends State> extends PureComponent<TProps, TState> {
    componentDidMount(): void;
    getSnapshotBeforeUpdate(prevProps: Readonly<TProps>): null;
    componentDidUpdate(prevProps: Readonly<TProps>): void;
    componentWillUnmount(): void;
    componentWillAppear(): void;
    componentWillDisappear(): void;
    componentDidAppear(): void;
    componentDidDisappear(): void;
}
export declare type SiteType = ComponentType<Record<string, any> & SiteProps>;
export {};
