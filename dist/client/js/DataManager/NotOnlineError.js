"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotOnlineError extends Error {
    constructor(message, url) {
        super(message + " for url " + url);
        this._url = url;
    }
}
exports.NotOnlineError = NotOnlineError;
//# sourceMappingURL=NotOnlineError.js.map