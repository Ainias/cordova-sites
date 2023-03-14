import React, { useContext } from 'react';

export const SiteIdContext = React.createContext(-1);
SiteIdContext.displayName = 'SiteIdContext';

export function useSiteId() {
    return useContext(SiteIdContext);
}
