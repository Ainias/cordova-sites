import { FunctionComponent } from 'react';
import { TopBarButtonType } from 'react-bootstrap-mobile';
declare type Props = {
    backButton?: TopBarButtonType | false;
    title?: string;
    rightButtons?: TopBarButtonType[];
    leftButtons?: TopBarButtonType[];
};
export declare const TopBar: FunctionComponent<Props>;
export {};
