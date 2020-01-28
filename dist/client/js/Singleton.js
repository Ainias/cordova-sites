"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Singleton {
    /**
     *
     * @returns {Singleton|this}
     */
    static getInstance() {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance;
    }
}
exports.Singleton = Singleton;
//# sourceMappingURL=Singleton.js.map