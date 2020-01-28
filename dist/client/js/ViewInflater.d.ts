/**
 * Singleton-Klasse genutzt zum laden von Views
 */
export declare class ViewInflater {
    private static instance;
    private loadingPromises;
    /**
     *  Statische Funktion, um die Singleton-Instanz zu holen
     *
     * @returns {ViewInflater}
     */
    static getInstance(): ViewInflater;
    constructor();
    /**
     * Lädt asynchron eine View anhand einer URL und lädt ebenso alle child-views
     *
     * Extra nicht async, damit Promise sofort in LoadingPromise hinzugefügt werden kann
     *
     * @param viewUrl
     * @param parentUrls
     * @returns {*}
     */
    load(viewUrl: any, parentUrls?: any): any;
    /**
     * Statische Funktion, um Elemente aus einem String zu kreieren
     *
     * @param string
     * @returns {NodeListOf<ChildNode>}
     */
    static inflateElementsFromString(string: any): NodeListOf<ChildNode>;
    /**
     * Kreiert ein Ladesymbol. Evtl entfernen
     *
     * @returns {HTMLDivElement}
     */
    static createLoadingSymbol(loaderClass?: any): HTMLDivElement;
    /**
     * Moves the child-Nodes from one element to another
     * @param from
     * @param to
     * @returns {*}
     */
    static moveChildren(from: any, to: any): any;
    /**
     * Ersetzt ein Element durch seine Kinder (entfernt das Element ohne die Kinder zu entfernen)
     * @param element
     */
    static replaceWithChildren(element: any): void;
}
