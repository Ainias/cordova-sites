import React, { ComponentType, CSSProperties, FunctionComponent, useCallback } from 'react';
import { SiteProps } from './Site';
import { useCreateDeepLink, useSites } from '../App/Hooks';
import { useSiteId } from '../App/SiteIdContext';

type Props = {
    siteId?: number;
    site?: ComponentType<Record<string, any> & SiteProps>;
    siteProps?: Record<string, any> & SiteProps;
    style?: CSSProperties;
    finishCurrent?: boolean;
};

function createSiteLinkFunc() {
    const SiteLink: FunctionComponent<Props> = React.memo<Props>(
        ({ siteId, site, siteProps, style, children, finishCurrent = false }) => {
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
        }
    );
    return SiteLink;
}

export const SiteLink = createSiteLinkFunc();
