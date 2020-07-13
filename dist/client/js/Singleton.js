"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Singleton = void 0;
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