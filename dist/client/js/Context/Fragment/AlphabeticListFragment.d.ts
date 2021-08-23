import { AbstractFragment } from "../AbstractFragment";
import { AbstractSite } from "../AbstractSite";
export declare class AlphabeticListFragment<ct extends AbstractSite> extends AbstractFragment<ct> {
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
