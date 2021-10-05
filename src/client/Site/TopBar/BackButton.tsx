import * as React from 'react';
import { FunctionComponent, useCallback } from 'react';
import { TopBarButton } from 'react-bootstrap-mobile';
import { useSites } from '../../App/Hooks';

type Props = {};

export const BackButton: FunctionComponent<Props> = React.memo(({}) => {
    const sites = useSites();
    const goBack = useCallback(() => sites?.goBack(), [sites]);

    if (sites?.canGoBack()) {
        return <TopBarButton onClick={goBack}>&lt;</TopBarButton>;
    }
    return null;
});
