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
const AbstractSite_1 = require("../AbstractSite");
class DelegateSite extends AbstractSite_1.AbstractSite {
    constructor(site) {
        super(undefined, document.createElement("span"));
        /** @var {AbstractSite} */
        this._site = site;
    }
    setTitle(titleElement, title) {
        return this._site.setTitle(titleElement, title);
    }
    setParameter(name, value) {
        //Todo changing
        // return this._site.setParameter(name, value);
    }
    setParameters(parameters) {
        //TODO changing
        // return this._site.setParameters(parameters)
    }
    getParameters() {
        return this._site.getParameters();
    }
    showLoadingSymbol() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._site.showLoadingSymbol();
        });
    }
    removeLoadingSymbol() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._site.removeLoadingSymbol();
        });
    }
    _updateTitle() {
        return this._site._updateTitle();
    }
    updateUrl(args) {
        //todo
        // return this._site.updateUrl(args);
    }
    startSite(site, args) {
        return this._site.startSite(site, args);
    }
    finishAndStartSite(site, args, result) {
        return this._site.finishAndStartSite(site, args, result);
    }
    finish(result) {
        return this._site.finish(result);
    }
    goBack() {
        return this._site.goBack();
    }
    getFinishPromise() {
        return this._site.getFinishPromise();
    }
    setResult(result) {
        return this._site.setResult(result);
    }
    getFinishResolver() {
        return this._site.getFinishResolver();
    }
    addFragment(viewQuery, fragment) {
        return this._site.addFragment(viewQuery, fragment);
    }
    findBy(query, all, asPromise) {
        return this._site.findBy(query, all, asPromise);
    }
    setPauseParameters(pauseParameters) {
        return this._site.setPauseParameters(pauseParameters);
    }
    getViewPromise() {
        return this._site.getViewPromise();
    }
    getState() {
        return this._site.getState();
    }
    getTitle() {
        return this._site.getTitle();
    }
    isShowing() {
        return this._site.isShowing();
    }
    isDestroying() {
        return this._site.isDestroying();
    }
}
exports.DelegateSite = DelegateSite;
//# sourceMappingURL=DelegateSite.js.map