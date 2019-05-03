import {DataManager} from "./DataManager";
import {Helper} from "./Helper";
import {Translator} from "./Translator";

export class Form {
    constructor(formElem, urlOrCallback, method) {
        this._formElem = formElem;
        this._method = Helper.nonNull(method, formElem["method"], "POST");
        this._elementChangeListener = null;

        this._validators = [];

        this._isBusy = false;

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

        this._submitCallback = null;
        this.errorCallback = async (errors) => {
            await this.setErrors(errors);
        };

        formElem.addEventListener("submit", async function (e) {
            e.preventDefault();
            await self.doSubmit(e);
        });

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
                    self._elementChangeListener();
                }
                this.setCustomValidity("");
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

    async doSubmit() {
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

    // load(url, isCached) {
    //     this.setValues(DataManager.load(url, isCached).then(function (values) {
    //         if (values["success"]) {
    //             return values["result"];
    //         }
    //         return {};
    //     }));
    //     return this;
    // }

    async setValues(valuePromise) {
        this.setIsBusy(true);
        let values = await Promise.resolve(valuePromise);

        this.setIsBusy(false);
        for (let k in values) {
            if (Helper.isNotNull(this._formElem.elements[k])) {
                if (Helper.isNotNull(this._formElem.elements[k].options) && Helper.isNotNull(values[k + "Options"])) {
                    let options = this._formElem.elements[k].options;
                    for (let val in values[k + "Options"]) {
                        let option = document.createElement("option");
                        option.value = val;
                        option.innerText = values[k + "Options"][val];
                        options.add(option);
                    }
                }

                this._formElem.elements[k].value = Helper.htmlspecialcharsDecode(values[k]);
                if (Helper.isNotNull(values[k]) && ("" + values[k]).trim() !== "") {
                    this._formElem.elements[k].classList.add("notEmpty");
                } else {
                    this._formElem.elements[k].classList.remove("notEmpty");
                }
            }
        }
        return this;
    }

    async getValues(filesToBase64) {
        let values = new FormData(this._formElem);
        values = Array.from(values.entries()).reduce((memo, pair) => ({
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

    clearErrors(){
        Object.keys(this._formElem.elements).forEach(elemKey => {
            this._formElem.elements[elemKey].setCustomValidity("");
        });
        // this._formElem.reportValidity();
    }

    setErrors(errors) {
        let hasElem = false;
        let firstError = null;

        for (let k in errors) {
            if (Helper.isNotNull(this._formElem.elements[k]) && this._formElem.elements[k].type !== "hidden"
                && Helper.isNull(this._formElem.elements[k].readonly) && (
                    Helper.isNull(this._formElem.elements[k].disabled) || !this._formElem.elements[k].disabled)
            ) {
                this._formElem.elements[k].setCustomValidity(Translator.translate(Helper.nonNull(errors[k], "form-default-error")));
                hasElem = true;
            }
            if (Helper.isNull(firstError)) {
                firstError = Helper.nonNull(errors[k], "form-default-error");
            }
        }
        if (!hasElem && Helper.isNotNull(firstError)) {
            for (let k in this._formElem.elements) {
                if (this._formElem.elements[k].type !== "hidden") {
                    this._formElem.elements[k].setCustomValidity(Translator.translate(firstError));
                    hasElem = true;
                    break;
                }
            }
        }

        if (hasElem) {
            this._formElem.reportValidity();//querySelector("input[type=submit], button").click();
        }
    }

    setIsBusy(isBusy) {
        this._isBusy = isBusy;
        if (this._isBusy) {
            this._formElem.classList.add("sending");
        } else {
            this._formElem.classList.remove("sending");
        }
    }

    async submit() {
        this.setIsBusy(true);
        if (await this.validate()) {
            this.setIsBusy(false);
            return await (this._submitHandler(await this.getValues(), this));
        }
        this.setIsBusy(false);
        return false;
    }

    async validate() {
        if (!this._formElem.reportValidity()) {
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
        return this._formElem;
    }
}