import * as React from 'react';
import { BackButton } from './BackButton';
import { TopBarButtonType, TopBar as BMTopBar, useBreakpointSelect } from '@ainias42/react-bootstrap-mobile';
import { useMemo } from 'react';

export type TopBarProps = {
    visible: boolean;
    backButton?: TopBarButtonType | false;
    title?: string;
    rightButtons?: TopBarButtonType[];
    leftButtons?: TopBarButtonType[];
    transparent?: boolean;
    drawBehind?: boolean;
    numberButtons?: number;
    numberButtonsXS?: number;
    numberButtonsSM?: number;
    numberButtonsMD?: number;
    numberButtonsLG?: number;
    numberButtonsXL?: number;
    numberButtonsXXL?: number;
};

export const TopBar = React.memo(function TopBar({
    visible = true,
    backButton = undefined,
    title = '',
    rightButtons = [],
    leftButtons = [],
    transparent = false,
    drawBehind = false,
    numberButtons = 3,
    numberButtonsXS = 2,
    numberButtonsSM = 3,
    numberButtonsMD = 4,
    numberButtonsLG = 5,
    numberButtonsXL = 5,
    numberButtonsXXL = 5,
}: TopBarProps) {
    const realNumberButtons =
        useBreakpointSelect([
            numberButtonsXS,
            numberButtonsSM,
            numberButtonsMD,
            numberButtonsXL,
            numberButtonsLG,
            numberButtonsXXL,
        ]) ?? numberButtons;

    const newLeftButtons = useMemo(() => {
        const lButtons = [...leftButtons];
        let newBackButton = backButton;
        if (newBackButton === undefined) {
            newBackButton = { component: BackButton };
        }
        if (newBackButton !== false) {
            lButtons.unshift(newBackButton);
        }
        return lButtons;
    }, [backButton, leftButtons]);

    const [hiddenButtons, newRightButtons]: [TopBarButtonType[], TopBarButtonType[]] = useMemo(() => {
        const hButtons: TopBarButtonType[] = [];
        const rButtons = [...rightButtons];
        if (rightButtons.length > realNumberButtons) {
            hButtons.push(...rButtons.splice(realNumberButtons - 1, rButtons.length));
        }
        return [hButtons, rButtons];
    }, [realNumberButtons, rightButtons]);

    if (!visible) {
        return null;
    }

    return (
        <BMTopBar
            title={title}
            rightButtons={newRightButtons}
            leftButtons={newLeftButtons}
            hiddenButtons={hiddenButtons}
            transparent={transparent}
            drawBehind={drawBehind}
        />
    );
});
