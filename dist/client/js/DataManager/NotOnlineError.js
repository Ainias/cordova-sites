"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotOnlineError = void 0;
class NotOnlineError extends Error {
    constructor(message, url) {
        super(message + " for url " + url);
        this._url = url;
    }
}
exports.NotOnlineError = NotOnlineError;
//# sourceMappingURL=NotOnlineError.js.map