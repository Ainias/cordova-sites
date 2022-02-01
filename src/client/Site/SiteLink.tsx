import React, { ComponentType, CSSProperties, PropsWithChildren, useCallback } from 'react';
import { useCreateDeepLink, useSites } from '../App/Hooks';
import { useSiteId } from '../App/SiteIdContext';

export type SiteLinkProps<SiteProps extends Record<string, string | number>> = PropsWithChildren<{
    siteId?: number;
    site?: ComponentType<SiteProps>;
    siteProps?: SiteProps;
    style?: CSSProperties;
    finishCurrent?: boolean;
}>;

export const SiteLink = React.memo(function SiteLink<SiteProps extends Record<string, string | number>>({
    siteId,
    site,
    siteProps,
    style,
    children,
    finishCurrent = false,
}: SiteLinkProps<SiteProps>) {
    const sites = useSites();
    const currentSiteId = useSiteId();
    const onClickHandler = useCallback(
        (e) => {
            e.preventDefault();
            if (siteId !== undefined) {
                sites?.showSite(siteId);
            } else if (site) {
                sites?.startSite(site, siteProps);
            }

            if (finishCurrent) {
                sites?.removeSite(currentSiteId);
            }
        },
        [site, siteProps, siteId, sites, finishCurrent, currentSiteId]
    );

    if (!site && typeof siteId === 'number') {
        const data = sites?.getSiteDataById(siteId);
        if (typeof data !== 'undefined') {
            site = data.site;
            siteProps = data.props;
        }
    }
    if (site === undefined) {
        throw new Error(`site is undefined with id ${siteId}`);
    }
    const link = useCreateDeepLink(site, siteProps);

    return (
        <a role="button" style={style} onClick={onClickHandler} href={link}>
            {children}
        </a>
    );
});
