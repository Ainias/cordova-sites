import * as React from 'react';
import { BackButton } from './BackButton';
import { TopBarButtonType, TopBar as BMTopBar, useBreakpointSelect } from 'react-bootstrap-mobile';
import { StringMap } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export type SitesTopBarButtonType<T extends StringMap> = TopBarButtonType &
    (
        | {
              translate?: boolean;
          }
        | {
              translate: true;
              translationArgs: T;
          }
    );

export type TopBarProps<T extends StringMap> = {
    visible: boolean;
    backButton?: SitesTopBarButtonType<T> | false;
    title?: string;
    rightButtons?: SitesTopBarButtonType<T>[];
    leftButtons?: SitesTopBarButtonType<T>[];
    transparent?: boolean;
    drawBehind?: boolean;
    numberButtons?: number;
    numberButtonsXS?: number;
    numberButtonsSM?: number;
    numberButtonsMD?: number;
    numberButtonsLG?: number;
    numberButtonsXL?: number;
    numberButtonsXXL?: number;
} & ({ translate?: boolean } | { translate: true; translationArgs: T });

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
    translate = true,
    ...translationProps
}: TopBarProps<StringMap>) {
    const realNumberButtons =
        useBreakpointSelect([
            numberButtonsXS,
            numberButtonsSM,
            numberButtonsMD,
            numberButtonsXL,
            numberButtonsLG,
            numberButtonsXXL,
        ]) ?? numberButtons;

    const { t } = useTranslation();

    const translateButton = useCallback(
        (button: SitesTopBarButtonType<StringMap>) => {
            if (button.title && button.translate !== false) {
                const buttonTitle =
                    'translationArgs' in button ? t(button.title, button.translationArgs) : t(button.title);
                button = {
                    ...button,
                    title: buttonTitle,
                };
            }
            return button;
        },
        [t]
    );

    if (backButton === undefined) {
        backButton = { component: BackButton };
    }
    if (backButton !== false) {
        leftButtons = leftButtons.slice(0, leftButtons.length);
        leftButtons.unshift(backButton);
    }

    let hiddenButtons: TopBarButtonType[] = [];
    if (rightButtons.length > realNumberButtons) {
        rightButtons = [...rightButtons];
        hiddenButtons.push(...rightButtons.splice(realNumberButtons - 1, rightButtons.length));
    }

    rightButtons = rightButtons.map(translateButton);
    leftButtons = leftButtons.map(translateButton);
    hiddenButtons = hiddenButtons.map(translateButton);

    if (!visible) {
        return null;
    }

    if (title && translate) {
        title = 'translationArgs' in translationProps ? t(title, translationProps.translationArgs) : t(title);
    }

    return (
        <BMTopBar
            title={title}
            rightButtons={rightButtons}
            leftButtons={leftButtons}
            hiddenButtons={hiddenButtons}
            transparent={transparent}
            drawBehind={drawBehind}
        />
    );
});
