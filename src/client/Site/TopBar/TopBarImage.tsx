import * as React from 'react';
import { Image } from 'react-bootstrap';
import { useCallback, useState } from 'react';
import { InViewport } from 'react-bootstrap-mobile';
import { useTopBar } from '../../App/Hooks';

export type TopBarImageProps = {
    image: string;
    maxHeight?: string;
};

export const TopBarImage = React.memo(function TopBarImage({ image, maxHeight }: TopBarImageProps) {
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
    useTopBar({ transparent: transparentTopBar, drawBehind: true });

    // Other

    // Render Functions

    return (
        <InViewport onInViewportChange={onInViewportChange} threshold={0.1} className="topbar-image">
            <Image style={maxHeight ? { maxHeight } : undefined} src={image} />
        </InViewport>
    );
});
