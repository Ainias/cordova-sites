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
exports.Form = void 0;
const DataManager_1 = require("../DataManager");
const Helper_1 = require("../Legacy/Helper");
const Translator_1 = require("../Translator");
const Toast_1 = require("../Toast/Toast");
const ImageSelectionElement_1 = require("./ImageSelectionElement");
const js_helper_1 = require("js-helper");
class Form {
    constructor(formElem, urlOrCallback, method, imageSelectionSelector) {
        this.imageSelectionElementReady = new js_helper_1.PromiseWithHandlers();
        this.imageSelectionElements = {};
        this.formElem = formElem;
        this._method = Helper_1.Helper.nonNull(method, formElem["method"], "POST");
        this._elementChangeListener = null;
        this._validators = [];
        this._isBusy = false;
        if (imageSelectionSelector === undefined) {
            imageSelectionSelector = "input.image-selection";
        }
        if (typeof urlOrCallback === "string") {
            this._submitHandler = (values) => {
                if (this._method.toLowerCase() === "get") {
                    return (DataManager_1.DataManager.load(urlOrCallback + DataManager_1.DataManager.buildQuery(values)));
                }
                else {
                    //TODO, wenn Serververbindung kommt
                    // return (DataManager.send(urlOrCallback, values));
                }
            };
        }
        else {
            this._submitHandler = urlOrCallback;
        }
        this._editors = [];
        this._submitCallback = null;
        this.errorCallback = (errors) => __awaiter(this, void 0, void 0, function* () {
            yield this.setErrors(errors);
        });
        formElem.addEventListener("submit", function (e) {
            return __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                yield self.doSubmit(e);
            });
        });
        this.prepareForImageSelection(imageSelectionSelector).then(r => this.imageSelectionElementReady.resolve(r));
        let self = this;
        [...formElem.elements].forEach(element => {
            element.addEventListener("change", function () {
                if (this.value.trim() !== "") {
                    this.classList.add("notEmpty");
                }
                else {
                    this.classList.remove("notEmpty");
                }
                this.setCustomValidity("");
                if (Helper_1.Helper.isNotNull(self._elementChangeListener)) {
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
                    }
                    else {
                        formElem.querySelector("." + element.name + "-preview").src = "";
                    }
                }
            });
            element.addEventListener("keydown", function () {
                this.setCustomValidity("");
            });
        });
    }
    prepareForImageSelection(imageSelectionSelector) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Helper_1.Helper.asyncForEach(this.formElem.querySelectorAll(imageSelectionSelector), (imgElement) => __awaiter(this, void 0, void 0, function* () {
                let name = "";
                let value = "";
                if (imgElement instanceof HTMLInputElement) {
                    name = imgElement.name;
                    value = imgElement.value;
                }
                if (Helper_1.Helper.isNull(name) || name === "") {
                    name = imgElement.dataset["name"];
                }
                if (Helper_1.Helper.isNull(value) || value === "") {
                    value = imgElement.dataset["value"];
                }
                const imgSelectionElement = new ImageSelectionElement_1.ImageSelectionElement(name);
                if (value && value.trim() !== "") {
                    try {
                        yield imgSelectionElement.setValue(JSON.parse(value));
                    }
                    catch (e) {
                        console.warn(e);
                    }
                }
                this.imageSelectionElements[name] = imgSelectionElement;
                imgElement.replaceWith(yield imgSelectionElement.getView());
            }), true);
        });
    }
    setImagesForImageSelectionElement(name, images) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.imageSelectionElementReady;
            if (this.imageSelectionElements[name]) {
                this.imageSelectionElements[name].setImages(images);
            }
        });
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
    doSubmit(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isBusy) {
                let res = yield this.submit();
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
        });
    }
    setValues(valuePromise) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setIsBusy(true);
            let values = yield Promise.resolve(valuePromise);
            this.setIsBusy(false);
            for (let k in values) {
                if (Helper_1.Helper.isNotNull(this.formElem.elements[k])) {
                    if (Helper_1.Helper.isNotNull(this.formElem.elements[k].options) && Helper_1.Helper.isNotNull(values[k + "Options"])) {
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
                    }
                    else if (this.formElem.elements[k].type && this.formElem.elements[k].type === "file") {
                        if (this.formElem.elements[k + "-hidden"]) {
                            this.formElem.elements[k + "-hidden"].value = values[k];
                        }
                        if (this.formElem.elements[k].accept && this.formElem.elements[k].accept.indexOf("image") !== -1) {
                            let previewImage = this.formElem.querySelector("." + k + "-preview");
                            if (previewImage) {
                                previewImage.src = values[k];
                            }
                        }
                    }
                    else {
                        this.formElem.elements[k].value = Helper_1.Helper.htmlspecialcharsDecode(values[k]);
                        if (this.formElem.elements[k].classList) {
                            if (Helper_1.Helper.isNotNull(values[k]) && ("" + values[k]).trim() !== "") {
                                this.formElem.elements[k].classList.add("notEmpty");
                            }
                            else {
                                this.formElem.elements[k].classList.remove("notEmpty");
                            }
                        }
                    }
                }
                if (Helper_1.Helper.isNotNull(this.imageSelectionElements[k])) {
                    console.log("setImg", k, values[k]);
                    this.imageSelectionElements[k].setValue(values[k]);
                }
            }
            return this;
        });
    }
    reset() {
        this.formElem.reset();
    }
    getValues(filesToBase64) {
        return __awaiter(this, void 0, void 0, function* () {
            let valuesFormData = new FormData(this.formElem);
            let values = Array.from(valuesFormData["entries"]()).reduce((memo, pair) => (Object.assign(Object.assign({}, memo), { [pair[0]]: pair[1] })), {});
            if (Helper_1.Helper.nonNull(filesToBase64, true)) {
                values = yield Form.filesToBase64(values);
            }
            return values;
        });
    }
    static filesToBase64(values) {
        return __awaiter(this, void 0, void 0, function* () {
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
            yield Promise.all(filePromises);
            return values;
        });
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
            if (Helper_1.Helper.isNotNull(this.formElem.elements[k]) && this.formElem.elements[k].type !== "hidden"
                && Helper_1.Helper.isNull(this.formElem.elements[k].readonly) && (Helper_1.Helper.isNull(this.formElem.elements[k].disabled) || !this.formElem.elements[k].disabled)) {
                this.formElem.elements[k].setCustomValidity(Translator_1.Translator.translate(Helper_1.Helper.nonNull(errors[k], "form-default-error")));
                hasElem = true;
            }
            else {
                new Toast_1.Toast(Helper_1.Helper.nonNull(errors[k], "form-default-error")).show();
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
        }
        else {
            this.formElem.classList.remove("sending");
        }
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            this._editors.forEach(e => e.updateSourceElement());
            this.setIsBusy(true);
            if (yield this.validate()) {
                let res = false;
                try {
                    res = yield (this._submitHandler(yield this.getValues(), this));
                }
                catch (e) {
                    console.error(e);
                }
                finally {
                    this.setIsBusy(false);
                }
                return res;
            }
            this.setIsBusy(false);
            return false;
        });
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            if ("reportValidity" in this.formElem && !this.formElem.reportValidity()) {
                return false;
            }
            let values = yield this.getValues();
            let res = yield Helper_1.Helper.asyncForEach(this._validators, (validator) => __awaiter(this, void 0, void 0, function* () {
                return validator(values, this);
            }), true);
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
                yield this.setErrors(errors);
                return false;
            }
            return true;
        });
    }
    onSubmit(callback) {
        this._submitCallback = callback;
    }
    getFormElement() {
        return this.formElem;
    }
}
exports.Form = Form;
//# sourceMappingURL=Form.js.map