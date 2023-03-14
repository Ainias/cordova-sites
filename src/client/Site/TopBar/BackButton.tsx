import * as React from 'react';
import { useCallback } from 'react';
import { TopBarButton, withMemo, InlineBlock } from '@ainias42/react-bootstrap-mobile';
import { useSites } from '../../App/Hooks';

import styles from './backButton.scss';

export const BackButton = withMemo(function BackButton() {
    const sites = useSites();
    const goBack = useCallback(() => sites?.goBack(), [sites]);

    if (sites?.canGoBack()) {
        return (
            <TopBarButton onClick={goBack}>
                <InlineBlock className={styles.backButtonImg} />
            </TopBarButton>
        );
    }
    return null;
}, styles);
