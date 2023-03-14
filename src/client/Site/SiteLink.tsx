import React, { CSSProperties, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useSites } from '../App/Hooks';
import { useSiteId } from '../App/SiteIdContext';
import { Clickable, RbmComponentProps, useInViewport, withMemo } from '@ainias42/react-bootstrap-mobile';
import { PrefetchOptions } from 'next/dist/shared/lib/router/router';

export type SiteLinkProps = RbmComponentProps<
    {
        href: string;
        prefetch?: boolean | PrefetchOptions;
        shallow?: boolean;
        scroll?: boolean;
        finishCurrentSite?: boolean;
        style?: CSSProperties;
    },
    { children: ReactNode }
>;

const SiteLink = function SiteLink({
    href,
    prefetch = true,
    shallow = false,
    scroll = true,
    finishCurrentSite = false,
    style,
    className,
    children,
}: SiteLinkProps) {
    const sites = useSites();
    const currentSiteId = useSiteId();
    const linkRef = useRef<HTMLAnchorElement>(null);
    const isInViewport = useInViewport(linkRef);
    const [prefetched, setPrefetched] = useState(false);

    const onClickHandler = useCallback(() => {
        sites?.push(href, undefined, { scroll, shallow });
        if (finishCurrentSite) {
            sites?.removeSite(currentSiteId);
        }
    }, [finishCurrentSite, sites, href, scroll, shallow, currentSiteId]);

    useEffect(() => {
        if (isInViewport && prefetch && !prefetched) {
            const options = typeof prefetch === 'object' ? prefetch : undefined;
            sites?.prefetch(href, undefined, options);
            setPrefetched(true);
        }
    }, [isInViewport, href, prefetch, prefetched, sites]);

    return (
        <Clickable
            interactable={true}
            style={style}
            onClick={onClickHandler}
            href={href}
            ref={linkRef}
            __allowChildren="text"
            className={className}
        >
            {children}
        </Clickable>
    );
};
const SiteLinkMemo = withMemo(SiteLink, undefined, 'text');
export { SiteLinkMemo as SiteLink };
