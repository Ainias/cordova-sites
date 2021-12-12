import * as React from 'react';
import { useCallback } from 'react';
import { TopBarButton } from 'react-bootstrap-mobile';
import { useSites } from '../../App/Hooks';
export var BackButton = React.memo(function (_a) {
    var sites = useSites();
    var goBack = useCallback(function () { return sites === null || sites === void 0 ? void 0 : sites.goBack(); }, [sites]);
    if (sites === null || sites === void 0 ? void 0 : sites.canGoBack()) {
        return (React.createElement(TopBarButton, { onClick: goBack },
            React.createElement("span", { className: "back-button-img" })));
    }
    return null;
});
//# sourceMappingURL=BackButton.js.map