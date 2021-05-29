export declare class ImageSelectionElement {
    private readonly viewLoadedPromise;
    private view;
    private name;
    private images;
    private inputElement;
    private categoryTemplate;
    private imageContainerTemplate;
    private imageSelectionContainer;
    private imageSelectionPreviewContainer;
    constructor(name: string, view?: string);
    private prepareView;
    private showSelection;
    private createImageElement;
    setImages(images: {
        [category: string]: {
            name?: string;
            src: string;
        }[];
    }): void;
    addImages(images: {
        [category: string]: {
            name?: string;
            src: string;
        }[];
    }): void;
    getView(): Promise<HTMLElement>;
    setValue(image: {
        src: string;
        name?: string;
    } | string): Promise<void>;
}
