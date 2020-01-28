export declare class ServerTranslator {
    _lang: string;
    constructor(lang: any);
    translate(key: any, args?: any): any;
    static setUserLanguage(req: any, res: any, next: any): void;
}
