import { AbstractSite } from "../AbstractSite";
export declare class DelegateSite extends AbstractSite {
    _site: AbstractSite;
    constructor(site: any);
    setTitle(titleElement: any, title: any): void;
    setParameter(name: any, value: any): void;
    setParameters(parameters: any): void;
    getParameters(): any;
    showLoadingSymbol(): Promise<void>;
    removeLoadingSymbol(): Promise<void>;
    _updateTitle(): void;
    updateUrl(args: any): void;
    startSite(site: any, args?: any): Promise<any>;
    finishAndStartSite(site: any, args?: any, result?: any): Promise<any>;
    finish(result?: any): Promise<void>;
    goBack(): void;
    getFinishPromise(): any;
    setResult(result: any): void;
    getFinishResolver(): any;
    addFragment(viewQuery: any, fragment: any): void;
    findBy(query: any, all: any, asPromise: any): any;
    setPauseParameters(pauseParameters: any): void;
    getViewPromise(): Promise<any>;
    getState(): any;
    getTitle(): any;
    isShowing(): boolean;
    isDestroying(): boolean;
}
