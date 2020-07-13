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
const DataManager_1 = require("./DataManager");
const Helper_1 = require("./Legacy/Helper");
const Translator_1 = require("./Translator");
const Toast_1 = require("./Toast/Toast");
class Form {
    constructor(formElem, urlOrCallback, method) {
        this._formElem = formElem;
        this._method = Helper_1.Helper.nonNull(method, formElem["method"], "POST");
        this._elementChangeListener = null;
        this._validators = [];
        this._isBusy = false;
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
                    self._elementChangeListener();
                }
                this.setCustomValidity("");
                if (element.accept && element.accept.indexOf("image") !== -1) {
                    if (element.files && element.files[0]) {
                        let reader = new FileReader();
                        reader.onload = e => {
                            formElem.querySelector("." + element.name + "-preview").src = e.target["result"];
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
    // load(url, isCached) {
    //     this.setValues(DataManager.load(url, isCached).then(function (values) {
    //         if (values["success"]) {
    //             return values["result"];
    //         }
    //         return {};
    //     }));
    //     return this;
    // }
    setValues(valuePromise) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setIsBusy(true);
            let values = yield Promise.resolve(valuePromise);
            this.setIsBusy(false);
            for (let k in values) {
                if (Helper_1.Helper.isNotNull(this._formElem.elements[k])) {
                    if (Helper_1.Helper.isNotNull(this._formElem.elements[k].options) && Helper_1.Helper.isNotNull(values[k + "Options"])) {
                        let options = this._formElem.elements[k].options;
                        for (let val in values[k + "Options"]) {
                            let option = document.createElement("option");
                            option.value = val;
                            option.innerText = values[k + "Options"][val];
                            options.add(option);
                        }
                    }
                    if (this._formElem.elements[k].type && (this._formElem.elements[k].type === "checkbox" || this._formElem.elements[k].type === "radio")) {
                        if (this._formElem.elements[k].value == values[k]) {
                            this._formElem.elements[k].checked = true;
                        }
                    }
                    else if (this._formElem.elements[k].type && this._formElem.elements[k].type === "file") {
                        if (this._formElem.elements[k + "-hidden"]) {
                            this._formElem.elements[k + "-hidden"].value = values[k];
                        }
                        if (this._formElem.elements[k].accept && this._formElem.elements[k].accept.indexOf("image") !== -1) {
                            let previewImage = this._formElem.querySelector("." + k + "-preview");
                            if (previewImage) {
                                previewImage.src = values[k];
                            }
                        }
                    }
                    else {
                        this._formElem.elements[k].value = Helper_1.Helper.htmlspecialcharsDecode(values[k]);
                        if (Helper_1.Helper.isNotNull(values[k]) && ("" + values[k]).trim() !== "") {
                            this._formElem.elements[k].classList.add("notEmpty");
                        }
                        else {
                            this._formElem.elements[k].classList.remove("notEmpty");
                        }
                    }
                }
            }
            return this;
        });
    }
    getValues(filesToBase64) {
        return __awaiter(this, void 0, void 0, function* () {
            let valuesFormData = new FormData(this._formElem);
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
        Object.keys(this._formElem.elements).forEach(elemKey => {
            this._formElem.elements[elemKey].setCustomValidity("");
        });
    }
    setErrors(errors) {
        let hasElem = false;
        let firstError = null;
        // let notCatchedErrors = [];
        for (let k in errors) {
            if (Helper_1.Helper.isNotNull(this._formElem.elements[k]) && this._formElem.elements[k].type !== "hidden"
                && Helper_1.Helper.isNull(this._formElem.elements[k].readonly) && (Helper_1.Helper.isNull(this._formElem.elements[k].disabled) || !this._formElem.elements[k].disabled)) {
                this._formElem.elements[k].setCustomValidity(Translator_1.Translator.translate(Helper_1.Helper.nonNull(errors[k], "form-default-error")));
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
            "reportValidity" in this._formElem && this._formElem.reportValidity();
        }
    }
    setIsBusy(isBusy) {
        this._isBusy = isBusy;
        if (this._isBusy) {
            this._formElem.classList.add("sending");
        }
        else {
            this._formElem.classList.remove("sending");
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
            if ("reportValidity" in this._formElem && !this._formElem.reportValidity()) {
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
        return this._formElem;
    }
}
exports.Form = Form;
//# sourceMappingURL=Form.js.map