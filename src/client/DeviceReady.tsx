import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';

type Props = { style?: React.CSSProperties; className: string };

export const DeviceReady: FunctionComponent<Props> = React.memo(({ style, className, children }) => {
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        document.addEventListener('deviceready', () => setIsReady(true));
    }, []);

    if (isReady) {
        return (
            <span style={style} className={className}>
                {children}
            </span>
        );
    }
    return null;
});
