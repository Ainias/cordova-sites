import { AbstractFragment } from "../AbstractFragment";
import { AbstractSite } from "../AbstractSite";
export declare class TabFragment<ct extends AbstractSite> extends AbstractFragment<ct> {
    private tabs;
    private lastTabId;
    private tabViewPromise;
    private activeTab;
    private nameContainer;
    private nameButton;
    private tabContent;
    private tabSite;
    private onTabChangeListener;
    constructor(site: any, view?: any);
    onViewLoaded(): Promise<any[]>;
    addFragment(name: any, fragment: any, nameIsTranslatable?: boolean): void;
    showTab(tabId: number): void;
    setOnTabChangeListener(listener: (newTab: any) => void): void;
}
