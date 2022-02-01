import * as React from 'react';
import { TabBar, TabBarButtonType } from 'react-bootstrap-mobile';
import { useCallback } from 'react';

export type FooterButton = TabBarButtonType & {
    onClick?: () => void;
};

export type FooterProps = {
    buttons: FooterButton[];
    visible?: boolean;
    transparent?: boolean;
    activeTab?: number;
};

export const Footer = React.memo(function Footer({ buttons, visible, activeTab }: FooterProps) {
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
        <div className="footer">
            <TabBar buttons={buttons} activeTab={activeTab} onTabChange={onTabSelect} />
        </div>
    );
});
