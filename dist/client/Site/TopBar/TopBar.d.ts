import * as React from 'react';
import { TopBarButtonType } from 'react-bootstrap-mobile';
import { StringMap } from 'i18next';
export declare type SitesTopBarButtonType<T extends StringMap> = TopBarButtonType & ({
    translate?: boolean;
} | {
    translate: true;
    translationArgs: T;
});
export declare type TopBarProps<T extends StringMap> = {
    visible: boolean;
    backButton?: SitesTopBarButtonType<T> | false;
    title?: string;
    rightButtons?: SitesTopBarButtonType<T>[];
    leftButtons?: SitesTopBarButtonType<T>[];
    transparent?: boolean;
    drawBehind?: boolean;
    numberButtons?: number;
    numberButtonsXS?: number;
    numberButtonsSM?: number;
    numberButtonsMD?: number;
    numberButtonsLG?: number;
    numberButtonsXL?: number;
    numberButtonsXXL?: number;
} & ({
    translate?: boolean;
} | {
    translate: true;
    translationArgs: T;
});
export declare const TopBar: React.NamedExoticComponent<TopBarProps<StringMap>>;
