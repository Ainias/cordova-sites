import * as React from 'react';
import { useCallback } from 'react';
import { useSiteId } from '../App/SiteIdContext';
import { useSites } from '../App/Hooks';
export var FinishSiteLink = React.memo(function (_a) {
    var style = _a.style, children = _a.children, className = _a.className;
    var id = useSiteId();
    var sites = useSites();
    var onClickHandler = useCallback(function () {
        if (id) {
            sites === null || sites === void 0 ? void 0 : sites.removeSite(id);
        }
    }, [id, sites]);
    return (React.createElement("button", { style: style, onClick: onClickHandler, className: className, type: "button" }, children));
});
//# sourceMappingURL=FinishSiteLink.js.map