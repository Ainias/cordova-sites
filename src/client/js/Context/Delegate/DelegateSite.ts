import {AbstractSite} from "../AbstractSite";

export class DelegateSite extends AbstractSite {

    _site: AbstractSite;

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

    async showLoadingSymbol() {
        return this._site.showLoadingSymbol();
    }

    async removeLoadingSymbol() {
        return this._site.removeLoadingSymbol();
    }

    _updateTitle() {
        return this._site._updateTitle();
    }

    updateUrl(args) {
        //todo
        // return this._site.updateUrl(args);
    }

    startSite(site, args?) {
        return this._site.startSite(site, args);
    }

    finishAndStartSite(site, args?, result?) {
        return this._site.finishAndStartSite(site, args, result);
    }

    finish(result?) {
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

    getTitle(){
        return this._site.getTitle();
    }

    isShowing(): boolean {
        return this._site.isShowing();
    }
}