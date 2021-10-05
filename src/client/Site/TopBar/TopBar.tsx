import * as React from 'react';
import { FunctionComponent } from 'react';
import { BackButton } from './BackButton';
import { TopBarButtonType, TopBar as BMTopBar } from 'react-bootstrap-mobile';

type Props = {
    backButton?: TopBarButtonType | false;
    title?: string;
    rightButtons?: TopBarButtonType[];
    leftButtons?: TopBarButtonType[];
};

export const TopBar: FunctionComponent<Props> = React.memo(
    ({ backButton = undefined, title = '', rightButtons = [], leftButtons = [] }) => {
        if (backButton === undefined) {
            backButton = { component: BackButton };
        }
        if (backButton !== false) {
            leftButtons = leftButtons.slice(0, leftButtons.length);
            leftButtons.unshift(backButton);
        }

        return <BMTopBar title={title} rightButtons={rightButtons} leftButtons={leftButtons} />;
    }
);
