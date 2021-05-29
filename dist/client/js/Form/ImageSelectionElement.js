"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageSelectionElement = void 0;
const ViewInflater_1 = require("../ViewInflater");
const shared_1 = require("js-helper/dist/shared");
const client_1 = require("js-helper/dist/client");
const defaultView = require("../../html/Form/imageSelectionElement.html");
class ImageSelectionElement {
    constructor(name, view) {
        this.images = {};
        this.name = name;
        this.viewLoadedPromise = ViewInflater_1.ViewInflater.getInstance().load(shared_1.Helper.nonNull(view, defaultView)).then((v) => __awaiter(this, void 0, void 0, function* () {
            this.view = v;
            yield this.prepareView();
            this.showSelection();
            return v;
        }));
    }
    prepareView() {
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
            imageSelection.classList.add("highlight");
        });
        imageSelection.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.stopPropagation();
            imageSelection.classList.add("highlight");
        });
        imageSelection.addEventListener("dragleave", (e) => {
            e.preventDefault();
            e.stopPropagation();
            imageSelection.classList.remove("highlight");
        });
        imageSelection.addEventListener("drop", (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            e.stopPropagation();
            imageSelection.classList.remove("highlight");
            if (e instanceof DragEvent) {
                let file = null;
                if (e.dataTransfer.items && e.dataTransfer.items.length >= 1) {
                    if (e.dataTransfer.items[0].kind === "file") {
                        file = e.dataTransfer.items[0].getAsFile();
                    }
                }
                else if (e.dataTransfer.files && e.dataTransfer.files.length >= 1) {
                    file = e.dataTransfer.files[0];
                }
                if (!file || !file.type.startsWith("image/")) {
                    return;
                }
                let imageValue = null;
                let base64 = yield new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(file);
                });
                imageValue = { src: base64, name: file.name };
                this.addImages({ "Uploads": [imageValue] });
                this.setValue(imageValue);
            }
        }));
    }
    showSelection() {
        client_1.ViewHelper.removeAllChildren(this.imageSelectionContainer);
        Object.keys(this.images).sort((a, b) => {
            if (a.toLowerCase() === "uploads") {
                return -1;
            }
            else if (b.toLowerCase() === "uploads") {
                return 1;
            }
            else {
                return a.localeCompare(b);
            }
        }).forEach(category => {
            const categoryElement = this.categoryTemplate.cloneNode(true);
            categoryElement.querySelector(".image-selection-category-name").innerText = category;
            this.images[category].forEach(image => {
                let imageContainerElement = this.createImageElement(image);
                imageContainerElement.addEventListener("click", () => this.setValue(image));
                categoryElement.appendChild(imageContainerElement);
            });
            this.imageSelectionContainer.appendChild(categoryElement);
        });
    }
    createImageElement(image) {
        const imageContainerElement = this.imageContainerTemplate.cloneNode(true);
        imageContainerElement.querySelector(".image-selection-image").src = image.src;
        if (image.name) {
            imageContainerElement.querySelector(".image-selection-image-name").innerText = image.name;
        }
        return imageContainerElement;
    }
    setImages(images) {
        this.images = images;
        if (this.view) {
            this.showSelection();
        }
    }
    addImages(images) {
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
        if (this.view) {
            this.showSelection();
        }
    }
    getView() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.viewLoadedPromise;
        });
    }
    setValue(image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof image === "string") {
                    image = JSON.parse(image);
                }
                yield this.viewLoadedPromise;
                client_1.ViewHelper.removeAllChildren(this.imageSelectionPreviewContainer);
                if (image.src) {
                    this.imageSelectionPreviewContainer.appendChild(this.createImageElement(image));
                }
                this.inputElement.value = JSON.stringify(image);
            }
            catch (e) {
            }
        });
    }
}
exports.ImageSelectionElement = ImageSelectionElement;
//# sourceMappingURL=ImageSelectionElement.js.map