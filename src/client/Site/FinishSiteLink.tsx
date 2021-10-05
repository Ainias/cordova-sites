import * as React from 'react';
import { CSSProperties, FunctionComponent, useCallback } from 'react';
import { useSiteId } from '../App/SiteIdContext';
import { useSites } from '../App/Hooks';

type Props = {
    style?: CSSProperties;
    className?: string;
};

export const FinishSiteLink: FunctionComponent<Props> = React.memo(({ style, children, className }) => {
    const id = useSiteId();
    const sites = useSites();
    const onClickHandler = useCallback(() => {
        if (id) {
            sites?.removeSite(id);
        }
    }, [id, sites]);

    return (
        <button style={style} onClick={onClickHandler} className={className} type="button">
            {children}
        </button>
    );
});
