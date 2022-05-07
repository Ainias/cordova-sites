import React, { CSSProperties, PropsWithChildren, useCallback, useEffect, useRef, useState, MouseEvent } from 'react';
import { useSites } from '../App/Hooks';
import { useSiteId } from '../App/SiteIdContext';
import { useInViewport } from 'react-bootstrap-mobile';
import { PrefetchOptions } from 'next/dist/shared/lib/router/router';

export type SiteLinkProps = PropsWithChildren<{
    link: string;
    prefetch?: boolean | PrefetchOptions;
    replace?: boolean;
    shallow?: boolean;
    scroll?: boolean;
    finishCurrentSite?: boolean;
    style?: CSSProperties;
}>;

const SiteLink = function SiteLink({
    link,
    prefetch = true,
    shallow = false,
    scroll = true,
    finishCurrentSite = false,
    style,
    children,
}: SiteLinkProps) {
    const sites = useSites();
    const currentSiteId = useSiteId();
    const linkRef = useRef<HTMLAnchorElement>(null);
    const isInViewport = useInViewport(linkRef);
    const [prefetched, setPrefetched] = useState(false);

    const onClickHandler = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            sites?.push(link, undefined, { scroll, shallow });
            if (finishCurrentSite) {
                sites?.removeSite(currentSiteId);
            }
        },
        [finishCurrentSite, sites, link, scroll, shallow, currentSiteId]
    );

    useEffect(() => {
        if (isInViewport && prefetch && !prefetched) {
            const options = typeof prefetch === 'object' ? prefetch : undefined;
            sites?.prefetch(link, undefined, options);
            setPrefetched(true);
        }
    }, [isInViewport, link, prefetch, prefetched, sites]);

    return (
        <a role="button" style={style} onClick={onClickHandler} href={link} ref={linkRef}>
            {children}
        </a>
    );
};
const SiteLinkMemo = React.memo(SiteLink) as typeof SiteLink;
export { SiteLinkMemo as SiteLink };
