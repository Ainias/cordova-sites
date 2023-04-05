import * as React from 'react';
import { useCallback } from 'react';
import { TopBarButton, withMemo, InlineBlock } from '@ainias42/react-bootstrap-mobile';
import { useSites } from '../../App/Hooks';

import styles from './backButton.scss';
import { useSitesState } from '../../useSitesState';
import { useSiteId } from '../../App/SiteIdContext';

export const BackButton = withMemo(function BackButton() {
    const sites = useSites();
    const goBack = useCallback(() => sites?.goBack(), [sites]);
    const siteId = useSiteId();
    const canGoBack = useSitesState((state) => state.minimumActiveSiteId < siteId);

    if (canGoBack) {
        return (
            <TopBarButton onClick={goBack}>
                <InlineBlock className={styles.backButtonImg} />
            </TopBarButton>
        );
    }
    return null;
}, styles);
