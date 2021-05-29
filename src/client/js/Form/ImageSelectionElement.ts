import {ViewInflater} from "../ViewInflater";
import {Helper} from "js-helper/dist/shared";
import {ViewHelper} from "js-helper/dist/client";

const defaultView = require("../../html/Form/imageSelectionElement.html");

export class ImageSelectionElement {
    private readonly viewLoadedPromise: Promise<HTMLElement>
    private view: HTMLElement;

    private name: string;
    private images: { [category: string]: { name?: string, src: string }[] } = {};

    private inputElement: HTMLInputElement
    private categoryTemplate: HTMLElement;
    private imageContainerTemplate: HTMLElement;
    private imageSelectionContainer: HTMLElement;
    private imageSelectionPreviewContainer: HTMLElement;

    constructor(name: string, view?: string) {
        this.name = name;
        this.viewLoadedPromise = ViewInflater.getInstance().load(Helper.nonNull(view, defaultView)).then(async v => {
            this.view = v
            await this.prepareView();
            this.showSelection();
            return v;
        });
    }

    private prepareView() {
        this.imageContainerTemplate = this.view.querySelector(".image-selection-image-container");
        this.imageContainerTemplate.remove();

        this.categoryTemplate = this.view.querySelector(".image-selection-category");
        this.categoryTemplate.remove();

        this.imageSelectionContainer = this.view.querySelector(".image-selection-category-container");
        this.imageSelectionPreviewContainer = this.view.querySelector(".image-selection-preview");
        this.inputElement = this.view.querySelector(".image-selection-value");
        this.inputElement.name = this.name;

        const imageSelection = this.view.querySelector(".image-selection");
        imageSelection.addEventListener("dragenter", (e) => {
            e.preventDefault();
            e.stopPropagation();
            imageSelection.classList.add("highlight")
        })
        imageSelection.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.stopPropagation();
            imageSelection.classList.add("highlight")
        })

        imageSelection.addEventListener("dragleave", (e) => {
            e.preventDefault();
            e.stopPropagation();
            imageSelection.classList.remove("highlight")
        })
        imageSelection.addEventListener("drop", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            imageSelection.classList.remove("highlight")

            if (e instanceof DragEvent) {
                let file = null;
                if (e.dataTransfer.items && e.dataTransfer.items.length >= 1) {
                    if (e.dataTransfer.items[0].kind === "file") {
                        file = e.dataTransfer.items[0].getAsFile();
                    }
                } else if (e.dataTransfer.files && e.dataTransfer.files.length >= 1) {
                    file = e.dataTransfer.files[0];
                }

                if (!file || !file.type.startsWith("image/")) {
                    return;
                }

                let imageValue = null;
                let base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve(reader.result)
                    };
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(file);
                });
                imageValue = {src: base64, name: file.name};
                this.addImages({"Uploads": [imageValue]});
                this.setValue(imageValue);
            }
        })
    }

    private showSelection() {
        ViewHelper.removeAllChildren(this.imageSelectionContainer);
        Object.keys(this.images).sort((a,b) => {
            if (a.toLowerCase() === "uploads"){
                return -1;
            }else if (b.toLowerCase() === "uploads"){
                return 1;
            }
            else {
                return a.localeCompare(b);
            }
        }).forEach(category => {
            const categoryElement = <HTMLElement>this.categoryTemplate.cloneNode(true);
            (<HTMLElement>categoryElement.querySelector(".image-selection-category-name")).innerText = category;

            this.images[category].forEach(image => {
                let imageContainerElement = this.createImageElement(image);
                imageContainerElement.addEventListener("click", () => this.setValue(image));
                categoryElement.appendChild(imageContainerElement);
            });

            this.imageSelectionContainer.appendChild(categoryElement);
        })
    }

    private createImageElement(image: { name?: string, src: string }) {
        const imageContainerElement = <HTMLElement>this.imageContainerTemplate.cloneNode(true);
        (<HTMLImageElement>imageContainerElement.querySelector(".image-selection-image")).src = image.src;

        if (image.name) {
            (<HTMLElement>imageContainerElement.querySelector(".image-selection-image-name")).innerText = image.name;
        }

        return imageContainerElement;
    }

    setImages(images: { [category: string]: { name?: string, src: string }[] }) {
        this.images = images;
        if (this.view) {
            this.showSelection();
        }
    }

    addImages(images: { [category: string]: { name?: string, src: string }[] }) {
        Object.keys(images).forEach(category => {
            if (this.images[category]) {
                const sources = this.images[category].map(i => i.src);
                const newImages = images[category].filter(i => {
                    return (sources.indexOf(i.src) === -1);
                });
                this.images[category].push(...newImages);
            }
            else {
                this.images[category] = images[category];
            }
        });
        if (this.view){
            this.showSelection();
        }
    }

    async getView() {
        return this.viewLoadedPromise;
    }

    async setValue(image: { src: string, name?: string } | string) {
        try {
            if (typeof image === "string") {
                image = <{ src: string, name?: string }>JSON.parse(image);
            }

            await this.viewLoadedPromise;
            ViewHelper.removeAllChildren(this.imageSelectionPreviewContainer);
            if (image.src) {
                this.imageSelectionPreviewContainer.appendChild(this.createImageElement(image));
            }
            this.inputElement.value = JSON.stringify(image);
        } catch (e) {
        }
    }
}
