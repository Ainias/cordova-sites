import * as React from 'react';
import { TabBar, TabBarButtonType, withMemo } from '@ainias42/react-bootstrap-mobile';
import { useCallback } from 'react';

import styles from './footer.scss';

export type FooterButton = TabBarButtonType & {
    onClick?: () => void;
};

export type FooterProps = {
    buttons: FooterButton[];
    visible?: boolean;
    activeTab?: number;
};

function Footer({ buttons, visible = false, activeTab = undefined }: FooterProps) {
    // Variables

    // States

    // Refs

    // Callbacks
    const onTabSelect = useCallback(
        (newTab: number) => {
            buttons[newTab]?.onClick?.();
        },
        [buttons]
    );

    // Effects

    // Other

    // Render Functions

    if (!visible || buttons.length === 0) {
        return null;
    }

    return (
        <div className={styles.footer}>
            <TabBar buttons={buttons} activeTab={activeTab} onTabChange={onTabSelect} />
        </div>
    );
}

const FooterMemo = withMemo(Footer, styles);
export { FooterMemo as Footer };
