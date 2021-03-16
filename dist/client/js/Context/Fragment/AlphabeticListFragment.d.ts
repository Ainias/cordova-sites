import { AbstractFragment } from "../AbstractFragment";
export declare class AlphabeticListFragment extends AbstractFragment {
    private elements;
    private sideScrolling;
    private heading;
    private headingElement;
    constructor(site: any, view: any);
    onViewLoaded(): Promise<any[]>;
    setElements(elements: any): void;
    setHeading(headingElement: HTMLElement): void;
    renderElement(element: any): HTMLElement;
    renderList(): void;
}
