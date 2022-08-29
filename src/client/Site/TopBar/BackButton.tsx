import * as React from 'react';
import { useCallback } from 'react';
import { TopBarButton, withMemo, InlineBlock } from 'react-bootstrap-mobile';
import { useSites } from '../../App/Hooks';

import styles from './backButton.scss';

type Props = {};

function BackButton({}: Props) {
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
}

const BackButtonMemo = withMemo(BackButton, styles);
export { BackButtonMemo as BackButton };
