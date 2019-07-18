import {App} from "./App";
import {Translator} from "./Translator";


import deTranslations from "../translations/de";
import enTranslations from "../translations/en";

App.addInitialization(() => {

    Translator.addDynamicTranslations({
        "de": deTranslations,
        "en": enTranslations
    });
});
