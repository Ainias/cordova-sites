export class NotOnlineError extends Error{
    private _url: string;

    constructor(message: string, url: string) {
        super(message+" for url "+url);
        this._url = url;
    }
}