import React, { ComponentType, CSSProperties } from 'react';
import { SiteProps } from './Site';
declare type Props = {
    siteId?: number;
    site?: ComponentType<Record<string, any> & SiteProps>;
    siteProps?: Record<string, any> & SiteProps;
    style?: CSSProperties;
    finishCurrent?: boolean;
};
export declare const SiteLink: React.FunctionComponent<Props>;
export {};
