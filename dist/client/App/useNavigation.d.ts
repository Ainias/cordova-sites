import { UrlObject } from 'url';
import { PrefetchOptions } from 'next/dist/shared/lib/router/router';
import { TransitionOptions } from './Sites';
export declare function useNavigation(): {
    finish: () => Promise<void> | undefined;
    push: (url: UrlObject | string, as?: UrlObject | string, options?: TransitionOptions) => Promise<boolean> | undefined;
    prefetch: (url: string, as?: string, prefetchOptions?: PrefetchOptions) => Promise<void> | undefined;
    finishAndPush: (url: UrlObject | string, as?: UrlObject | string, options?: TransitionOptions) => Promise<void>;
};
