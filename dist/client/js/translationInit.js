"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./App");
const Translator_1 = require("./Translator");
const deTranslations = require("../translations/de");
const enTranslations = require("../translations/en");
App_1.App.addInitialization(() => {
    console.log("user trsnslation");
    Translator_1.Translator.addDynamicTranslations({
        "de": deTranslations,
        "en": enTranslations
    });
});
//# sourceMappingURL=translationInit.js.map