import { AbstractSite } from "../AbstractSite";
export declare class MasterSite extends AbstractSite {
    _delegates: any;
    constructor(siteManager: any, view: any);
    addDelegate(delegateSite: any): void;
    onConstruct(constructParameters: any): Promise<any[]>;
    onStart(pauseArguments: any): Promise<void>;
    onBackPressed(): void;
    onMenuPressed(): void;
    onSearchPressed(): void;
    onViewLoaded(): Promise<any[]>;
    onPause(): Promise<void>;
    onDestroy(): Promise<void>;
}
