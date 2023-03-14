import { CSSProperties, ReactNode } from 'react';
import { RbmComponentProps } from '@ainias42/react-bootstrap-mobile';
import { PrefetchOptions } from 'next/dist/shared/lib/router/router';
export type SiteLinkProps = RbmComponentProps<{
    href: string;
    prefetch?: boolean | PrefetchOptions;
    shallow?: boolean;
    scroll?: boolean;
    finishCurrentSite?: boolean;
    style?: CSSProperties;
}, {
    children: ReactNode;
}>;
declare const SiteLinkMemo: ({ href, prefetch, shallow, scroll, finishCurrentSite, style, className, children, }: SiteLinkProps) => JSX.Element;
export { SiteLinkMemo as SiteLink };
