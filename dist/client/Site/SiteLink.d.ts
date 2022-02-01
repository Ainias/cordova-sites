import React, { ComponentType, CSSProperties, PropsWithChildren } from 'react';
export declare type SiteLinkProps<SiteProps extends Record<string, string | number>> = PropsWithChildren<{
    siteId?: number;
    site?: ComponentType<SiteProps>;
    siteProps?: SiteProps;
    style?: CSSProperties;
    finishCurrent?: boolean;
}>;
export declare const SiteLink: React.MemoExoticComponent<(<SiteProps extends Record<string, string | number>>({ siteId, site, siteProps, style, children, finishCurrent, }: SiteLinkProps<SiteProps>) => JSX.Element)>;
