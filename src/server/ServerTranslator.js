import {Translator} from "../shared/Translator";

export class ServerTranslator{
    constructor(lang){
        this._lang = lang;
    }

    translate(key, args) {
        return Translator.translate(key, args, this._lang);
    }
}