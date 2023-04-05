import { useSiteId } from './SiteIdContext';
import { useSites } from './Hooks';
import { useCallback } from 'react';
import { UrlObject } from 'url';
import { PrefetchOptions } from 'next/dist/shared/lib/router/router';
import { TransitionOptions } from './Sites';

export function useNavigation() {
    const siteId = useSiteId();
    const sites = useSites();

    const finish = useCallback(() => sites?.finish(siteId), [siteId, sites]);
    const push = useCallback(
        (url: UrlObject | string, as?: UrlObject | string, options?: TransitionOptions) =>
            sites?.push(url, as, options),
        [sites]
    );
    const prefetch = useCallback(
        (url: string, as?: string, prefetchOptions?: PrefetchOptions) => sites?.prefetch(url, as, prefetchOptions),
        [sites]
    );
    const finishAndPush = useCallback(
        async (url: UrlObject | string, as?: UrlObject | string, options?: TransitionOptions) => {
            await push(url, as, options);
            await finish();
        },
        [finish, push]
    );

    return { finish, push, prefetch, finishAndPush };
}
