declare const initialState: {
    minimumActiveSiteId: number;
};
export type SitesStateState = typeof initialState & ReturnType<typeof actionsGenerator>;
type SetState = (newState: SitesStateState | Partial<SitesStateState> | ((state: SitesStateState) => SitesStateState | Partial<SitesStateState>), replace?: boolean) => void;
type GetState = () => Readonly<SitesStateState>;
declare const actionsGenerator: (set: SetState, get: GetState) => {
    clear(): void;
    setMinimumActiveSite(siteId: number): void;
};
export declare const useSitesState: import("zustand").UseBoundStore<import("zustand").StoreApi<SitesStateState>>;
export {};
