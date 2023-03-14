import { Translator } from '../shared/Translator';
import { Helper } from '@ainias42/js-helper';

export class ServerTranslator {
    private lang: string;

    constructor(lang: string) {
        this.lang = lang;
    }

    translate(key: string, args?: string[]) {
        return Translator.translate(key, args, this.lang);
    }

    static setUserLanguage(req: any, _res: any, next: () => void) {
        let lang = req.acceptsLanguages(...Translator.getInstance().getLanguages());
        if (Helper.isNull(lang)) {
            lang = Translator.getInstance().getFallbackLanguage();
        }
        req.lang = lang;
        next();
    }
}
