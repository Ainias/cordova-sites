import * as React from 'react';
import { useEffect, useState } from 'react';
export var DeviceReady = React.memo(function (_a) {
    var style = _a.style, className = _a.className, children = _a.children;
    var _b = useState(false), isReady = _b[0], setIsReady = _b[1];
    useEffect(function () {
        document.addEventListener('deviceready', function () { return setIsReady(true); });
    }, []);
    if (isReady) {
        return (React.createElement("span", { style: style, className: className }, children));
    }
    return null;
});
//# sourceMappingURL=DeviceReady.js.map