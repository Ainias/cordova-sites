import * as React from 'react';
import { BackButton } from './BackButton';
import { TopBar as BMTopBar } from 'react-bootstrap-mobile';
export var TopBar = React.memo(function (_a) {
    var _b = _a.backButton, backButton = _b === void 0 ? undefined : _b, _c = _a.title, title = _c === void 0 ? '' : _c, _d = _a.rightButtons, rightButtons = _d === void 0 ? [] : _d, _e = _a.leftButtons, leftButtons = _e === void 0 ? [] : _e;
    if (backButton === undefined) {
        backButton = { component: BackButton };
    }
    if (backButton !== false) {
        leftButtons = leftButtons.slice(0, leftButtons.length);
        leftButtons.unshift(backButton);
    }
    return React.createElement(BMTopBar, { title: title, rightButtons: rightButtons, leftButtons: leftButtons });
});
//# sourceMappingURL=TopBar.js.map