import React, { useContext } from 'react';
export var SiteIdContext = React.createContext(-1);
SiteIdContext.displayName = 'SiteIdContext';
export function useSiteId() {
    return useContext(SiteIdContext);
}
//# sourceMappingURL=SiteIdContext.js.map