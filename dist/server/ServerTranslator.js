"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Translator_1 = require("../shared/Translator");
const shared_1 = require("js-helper/dist/shared");
class ServerTranslator {
    constructor(lang) {
        this._lang = lang;
    }
    translate(key, args) {
        return Translator_1.Translator.translate(key, args, this._lang);
    }
    static setUserLanguage(req, res, next) {
        let lang = req.acceptsLanguages(...Translator_1.Translator.getInstance().getLanguages());
        if (shared_1.Helper.isNull(lang)) {
            lang = Translator_1.Translator.getInstance().getFallbackLanguage();
        }
        req.lang = lang;
        next();
    }
}
exports.ServerTranslator = ServerTranslator;
//# sourceMappingURL=ServerTranslator.js.map