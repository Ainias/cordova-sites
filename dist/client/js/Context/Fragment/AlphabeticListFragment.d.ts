import { AbstractFragment } from "../AbstractFragment";
export declare class AlphabeticListFragment extends AbstractFragment {
    _elements: any;
    _sideScrolling: any;
    constructor(site: any, view: any);
    onViewLoaded(): Promise<any[]>;
    setElements(elements: any): void;
    renderElement(element: any): HTMLDivElement;
    renderList(): void;
}
