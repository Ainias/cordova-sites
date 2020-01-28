import { AbstractFragment } from "../AbstractFragment";
export declare class TabFragment extends AbstractFragment {
    _tabViews: any;
    _tabViewPromise: any;
    _nameContainer: any;
    _nameButton: any;
    _tabContent: any;
    _tabSite: any;
    constructor(site: any, view: any);
    onViewLoaded(): Promise<any[]>;
    addTab(name: any, origView: any, nameIsTranslatable?: any): Promise<void>;
    setActiveTab(tabView: any): void;
}
