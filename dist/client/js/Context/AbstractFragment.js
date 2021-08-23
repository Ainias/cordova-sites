"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractFragment = void 0;
const Context_1 = require("./Context");
const Helper_1 = require("../Legacy/Helper");
/**
 * Ein Fragment ist ein TeilView einer Ansicht.
 */
class AbstractFragment extends Context_1.Context {
    /**
     * Erstellt ein neues Fragment
     *
     * @param site
     * @param view
     */
    constructor(site, view) {
        super(view);
        this._site = site;
        this._viewQuery = null;
        this._active = true;
    }
    /**
     * Gibt die zugehörige Seite zurück
     *
     * @returns
     */
    getSite() {
        if (this._site instanceof AbstractFragment) {
            return this._site.getSite();
        }
        return this._site;
    }
    startSite(site, args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getSite().startSite(site, args);
        });
    }
    /**
     * Gibt zurück, ob das Fragment aktiv ist. Wenn nicht, wird es in der Seite nicht angezeigt
     *
     * @returns {boolean}
     */
    isActive() {
        return this._active;
    }
    setViewQuery(query) {
        this._viewQuery = query;
    }
    getViewQuery() {
        return this._viewQuery;
    }
    setActive(active) {
        this._active = active;
        if (Helper_1.Helper.isNotNull(this._view)) {
            if (active) {
                this._view.classList.remove("hidden");
            }
            else {
                this._view.classList.add("hidden");
            }
        }
    }
}
exports.AbstractFragment = AbstractFragment;
//# sourceMappingURL=AbstractFragment.js.map