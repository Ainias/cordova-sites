import {DataManager} from "../DataManager";
import {Helper} from "../Legacy/Helper";
import {Translator} from "../Translator";
import {Toast} from "../Toast/Toast"
import {ImageSelectionElement} from "./ImageSelectionElement";
import {PromiseWithHandlers} from "js-helper";

export class Form {

    private formElem: any;
    private _method: any;
    private _elementChangeListener: (element: HTMLElement, form: Form) => void;
    private _validators: any[];
    private _isBusy: boolean;
    private _submitHandler: any;
    private _editors: any[];
    private _submitCallback: any;
    private errorCallback: (errors) => Promise<void>;


    private imageSelectionElementReady = new PromiseWithHandlers();
    private imageSelectionElements: { [name: string]: ImageSelectionElement } = {};

    constructor(formElem, urlOrCallback, method?, imageSelectionSelector?: string) {
        this.formElem = formElem;
        this._method = Helper.nonNull(method, formElem["method"], "POST");
        this._elementChangeListener = null;

        this._validators = [];

        this._isBusy = false;

        if (imageSelectionSelector === undefined) {
            imageSelectionSelector = "input.image-selection";
        }

        if (typeof urlOrCallback === "string") {
            this._submitHandler = (values) => {
                if (this._method.toLowerCase() === "get") {
                    return (DataManager.load(urlOrCallback + DataManager.buildQuery(values)));
                } else {
                    //TODO, wenn Serververbindung kommt

                    // return (DataManager.send(urlOrCallback, values));
                }
            }
        } else {
            this._submitHandler = urlOrCallback;
        }

        this._editors = [];

        this._submitCallback = null;
        this.errorCallback = async (errors) => {
            await this.setErrors(errors);
        };

        formElem.addEventListener("submit", async function (e) {
            e.preventDefault();
            await self.doSubmit(e);
        });

        this.prepareForImageSelection(imageSelectionSelector).then(r => this.imageSelectionElementReady.resolve(r));

        let self = this;
        [...formElem.elements].forEach(element => {
            element.addEventListener("change", function () {
                if (this.value.trim() !== "") {
                    this.classList.add("notEmpty");
                } else {
                    this.classList.remove("notEmpty");
                }
                this.setCustomValidity("");
                if (Helper.isNotNull(self._elementChangeListener)) {
                    self._elementChangeListener(element, this);
                }
                this.setCustomValidity("");

                if (element.accept && element.accept.indexOf("image") !== -1) {
                    if (element.files && element.files[0]) {
                        let reader = new FileReader();
                        reader.onload = e => {
                            const previewElem = formElem.querySelector("." + element.name + "-preview");
                            if (previewElem) {
                                previewElem.src = e.target["result"];
                            }
                        };
                        reader.readAsDataURL(element.files[0]);
                    } else {
                        formElem.querySelector("." + element.name + "-preview").src = "";
                    }
                }

            });
            element.addEventListener("keydown", function () {
                this.setCustomValidity("");
            });
        });
    }

    private async prepareForImageSelection(imageSelectionSelector) {
        await Helper.asyncForEach(this.formElem.querySelectorAll(imageSelectionSelector), async imgElement => {
            let name = "";
            let value = "";
            if (imgElement instanceof HTMLInputElement) {
                name = imgElement.name;
                value = imgElement.value;
            }
            if (Helper.isNull(name) || name === "") {
                name = imgElement.dataset["name"];
            }
            if (Helper.isNull(value) || value === "") {
                value = imgElement.dataset["value"];
            }

            const imgSelectionElement = new ImageSelectionElement(name);
            if (value && value.trim() !== "") {
                try {
                    await imgSelectionElement.setValue(JSON.parse(value));
                } catch (e) {
                    console.warn(e)
                }
            }

            this.imageSelectionElements[name] = imgSelectionElement;
            imgElement.replaceWith(await imgSelectionElement.getView());
        }, true);
    }

    async setImagesForImageSelectionElement(name: string, images: { [category: string]: { name?: string, src: string }[] }) {
        await this.imageSelectionElementReady;

        if (this.imageSelectionElements[name]) {
            this.imageSelectionElements[name].setImages(images);
        }
    }

    addValidator(validatorCallback) {
        this._validators.push(validatorCallback);
    }

    onError(errorHandler) {
        this.errorCallback = errorHandler;
    }

    addEditor(e) {
        this._editors.push(e);
    }

    async doSubmit(e?) {
        if (!this._isBusy) {
            let res = await this.submit();
            //TODO einbauen, wenn server dazu kommt

            // if (res["success"]) {
            //     if (self._submitCallback !== null) {
            //         return self._submitCallback(res["result"]);
            //     }
            // } else if (Helper.isNotNull(self.errorCallback)) {
            //     return self.errorCallback(res["errors"]);
            // }
            return res;
        }
        return false;
    }

    async setValues(valuePromise) {
        this.setIsBusy(true);
        let values = await Promise.resolve(valuePromise);

        this.setIsBusy(false);
        for (let k in values) {
            if (Helper.isNotNull(this.formElem.elements[k])) {
                if (Helper.isNotNull(this.formElem.elements[k].options) && Helper.isNotNull(values[k + "Options"])) {
                    let options = this.formElem.elements[k].options;
                    for (let val in values[k + "Options"]) {
                        let option = document.createElement("option");
                        option.value = val;
                        option.innerText = values[k + "Options"][val];
                        options.add(option);
                    }
                }

                if (this.formElem.elements[k].type && (this.formElem.elements[k].type === "checkbox" || this.formElem.elements[k].type === "radio")) {
                    this.formElem.elements[k].checked = this.formElem.elements[k].value == values[k];
                } else if (this.formElem.elements[k].type && this.formElem.elements[k].type === "file") {
                    if (this.formElem.elements[k + "-hidden"]) {
                        this.formElem.elements[k + "-hidden"].value = values[k];
                    }

                    if (this.formElem.elements[k].accept && this.formElem.elements[k].accept.indexOf("image") !== -1) {
                        let previewImage = this.formElem.querySelector("." + k + "-preview");
                        if (previewImage) {
                            previewImage.src = values[k];
                        }
                    }
                } else {
                    this.formElem.elements[k].value = Helper.htmlspecialcharsDecode(values[k]);
                    if (this.formElem.elements[k].classList) {
                        if (Helper.isNotNull(values[k]) && ("" + values[k]).trim() !== "") {
                            this.formElem.elements[k].classList.add("notEmpty");
                        } else {
                            this.formElem.elements[k].classList.remove("notEmpty");
                        }
                    }
                }
            }

            if (Helper.isNotNull(this.imageSelectionElements[k])){
                console.log("setImg", k, values[k]);
                this.imageSelectionElements[k].setValue(values[k]);
            }
        }
        return this;
    }

    reset() {
        this.formElem.reset()
    }

    async getValues(filesToBase64?) {
        let valuesFormData = new FormData(this.formElem);
        let values = Array.from(valuesFormData["entries"]()).reduce((memo: {}, pair: [string, FormDataEntryValue]) => ({
            ...memo,
            [pair[0]]: pair[1],
        }), {});
        if (Helper.nonNull(filesToBase64, true)) {
            values = await Form.filesToBase64(values);
        }
        return values;
    }

    static async filesToBase64(values) {
        let filePromises = [];

        Object.keys(values).forEach(key => {
            if (values[key] instanceof Blob) {
                filePromises.push(new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(values[key]);
                }).then(base64 => values[key] = base64));
            }
        });
        await Promise.all(filePromises);
        return values;
    }

    setElementChangeListener(listener) {
        this._elementChangeListener = listener;
    }

    clearErrors() {
        Object.keys(this.formElem.elements).forEach(elemKey => {
            this.formElem.elements[elemKey].setCustomValidity("");
        });
    }

    setErrors(errors) {
        let hasElem = false;
        let firstError = null;
        // let notCatchedErrors = [];

        for (let k in errors) {
            if (Helper.isNotNull(this.formElem.elements[k]) && this.formElem.elements[k].type !== "hidden"
                && Helper.isNull(this.formElem.elements[k].readonly) && (
                    Helper.isNull(this.formElem.elements[k].disabled) || !this.formElem.elements[k].disabled)
            ) {
                this.formElem.elements[k].setCustomValidity(Translator.translate(Helper.nonNull(errors[k], "form-default-error")));
                hasElem = true;
            } else {
                new Toast(Helper.nonNull(errors[k], "form-default-error")).show();
            }
            // if (Helper.isNull(firstError)) {
            //     firstError = ;
            // }
        }
        // if (!hasElem && Helper.isNotNull(firstError)) {
        //     for (let k in this._formElem.elements) {
        //         if (this._formElem.elements[k].type !== "hidden") {
        //             this._formElem.elements[k].setCustomValidity(Translator.translate(firstError));
        //             hasElem = true;
        //             break;
        //         }
        //     }
        // }

        if (hasElem) {
            "reportValidity" in this.formElem && this.formElem.reportValidity();
        }
    }

    setIsBusy(isBusy) {
        this._isBusy = isBusy;
        if (this._isBusy) {
            this.formElem.classList.add("sending");
        } else {
            this.formElem.classList.remove("sending");
        }
    }

    async submit() {
        this._editors.forEach(e => e.updateSourceElement());
        this.setIsBusy(true);
        if (await this.validate()) {
            let res = false;
            try {
                res = await (this._submitHandler(await this.getValues(), this));
            } catch (e) {
                console.error(e);
            } finally {
                this.setIsBusy(false);
            }
            return res;
        }
        this.setIsBusy(false);
        return false;
    }

    async validate() {
        if ("reportValidity" in this.formElem && !this.formElem.reportValidity()) {
            return false;
        }
        let values = await this.getValues();

        let res = await Helper.asyncForEach(this._validators, async validator => {
            return validator(values, this);
        }, true);

        let hasErrors = false;
        let errors = {};
        res.forEach(value => {
            if (value !== true) {
                hasErrors = true;
                if (typeof value === "object") {
                    for (let k in value) {
                        errors[k] = value[k];
                    }
                }
            }
        });

        if (hasErrors) {
            await this.setErrors(errors);
            return false;
        }
        return true;
    }

    onSubmit(callback) {
        this._submitCallback = callback;
    }

    getFormElement() {
        return this.formElem;
    }
}
