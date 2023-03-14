import * as React from 'react';
import { useCallback, useState } from 'react';
import { InViewport, Image, withMemo } from '@ainias42/react-bootstrap-mobile';
import { useTopBar } from '../../App/Hooks';

import styles from './topBarImage.scss';

export type TopBarImageProps = {
    image: string;
    maxHeight?: string;
};

function TopBarImage({ image, maxHeight }: TopBarImageProps) {
    // Variables

    // States
    const [transparentTopBar, setTransparentTopBar] = useState(true);

    // Refs

    // Callbacks
    const onInViewportChange = useCallback(
        (inViewport: boolean) => {
            setTransparentTopBar(inViewport);
        },
        [setTransparentTopBar]
    );

    // Effects
    useTopBar({ transparent: transparentTopBar, drawBehind: true }, [transparentTopBar]);

    // Other

    // Render Functions

    return (
        <InViewport onInViewportChange={onInViewportChange} threshold={0.1} className={styles.topBarImage}>
            <Image style={maxHeight ? { maxHeight } : undefined} src={image} />
        </InViewport>
    );
}

const TopBarImageMemo = withMemo(TopBarImage, styles);
export { TopBarImageMemo as TopBarImage };
