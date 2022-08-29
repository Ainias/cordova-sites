import * as React from 'react';
import { TopBarButtonType } from 'react-bootstrap-mobile';
export declare type TopBarProps = {
    visible: boolean;
    backButton?: TopBarButtonType | false;
    title?: string;
    rightButtons?: TopBarButtonType[];
    leftButtons?: TopBarButtonType[];
    transparent?: boolean;
    drawBehind?: boolean;
    numberButtons?: number;
    numberButtonsXS?: number;
    numberButtonsSM?: number;
    numberButtonsMD?: number;
    numberButtonsLG?: number;
    numberButtonsXL?: number;
    numberButtonsXXL?: number;
};
export declare const TopBar: React.NamedExoticComponent<TopBarProps>;
