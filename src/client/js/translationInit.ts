import {App} from "./App";
import {Translator} from "./Translator";

const deTranslations = require( "../translations/de");
const enTranslations = require("../translations/en");

App.addInitialization(() => {
    console.log("user trsnslation");
    Translator.addDynamicTranslations({
        "de": deTranslations,
        "en": enTranslations
    });
});
