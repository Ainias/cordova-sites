import { create } from 'zustand';

const initialState = {
    minimumActiveSiteId: Infinity,
};
export type SitesStateState = typeof initialState & ReturnType<typeof actionsGenerator>;

type SetState = (
    newState:
        | SitesStateState
        | Partial<SitesStateState>
        | ((state: SitesStateState) => SitesStateState | Partial<SitesStateState>),
    replace?: boolean
) => void;
type GetState = () => Readonly<SitesStateState>;

const actionsGenerator = (set: SetState, get: GetState) => ({
    clear() {
        set({ ...actionsGenerator(set, get), ...initialState }, true);
    },
    setMinimumActiveSite(siteId: number) {
        set({ minimumActiveSiteId: siteId });
    },
});

export const useSitesState = create<SitesStateState>((set, get) => ({
    ...initialState,
    ...actionsGenerator(set, get),
}));
