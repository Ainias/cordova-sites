import * as React from 'react';
import { CSSProperties, useCallback } from 'react';
import { useSiteId } from '../App/SiteIdContext';
import { useSites } from '../App/Hooks';
import { Clickable, RbmComponentProps, withMemo } from '@ainias42/react-bootstrap-mobile';

export type FinishSiteLinkProps = RbmComponentProps<{
    style?: CSSProperties;
}>;

function FinishSiteLink({ style, children, className }: FinishSiteLinkProps) {
    const id = useSiteId();
    const sites = useSites();
    const onClickHandler = useCallback(() => {
        if (id) {
            sites?.finish(id);
        }
    }, [id, sites]);

    return (
        <Clickable style={style} onClick={onClickHandler} className={className} __allowChildren="all">
            {children}
        </Clickable>
    );
}

const FinishSiteLinkMemo = withMemo(FinishSiteLink);
export { FinishSiteLinkMemo as FinishSiteLink };
