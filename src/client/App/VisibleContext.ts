import React, { useContext } from 'react';

export const VisibleContext = React.createContext(false);
VisibleContext.displayName = 'VisibleContext';

export function useIsVisible() {
    return useContext(VisibleContext);
}
