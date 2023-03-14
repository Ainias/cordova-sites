export declare class ServerTranslator {
    private lang;
    constructor(lang: string);
    translate(key: string, args?: string[]): string;
    static setUserLanguage(req: any, _res: any, next: () => void): void;
}
