import {Translator} from "../shared/Translator";
import {Helper} from "js-helper/dist/shared";

export class ServerTranslator{
    constructor(lang){
        this._lang = lang;
    }

    translate(key, args) {
        return Translator.translate(key, args, this._lang);
    }

    static setUserLanguage(req, res, next){
        let lang = req.acceptsLanguages(...Translator.getInstance().getLanguages());
        if (Helper.isNull(lang)){
            lang = Translator.getInstance().getFallbackLanguage();
        }
        req.lang = lang;
        next();
    }
}