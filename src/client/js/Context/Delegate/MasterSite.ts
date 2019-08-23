import {AbstractSite} from "../AbstractSite";
import {Helper} from "../../Helper";

export class MasterSite extends AbstractSite{

    _delegates;

    constructor(siteManager, view) {
        super(siteManager, view);
        this._delegates = [];
    }

    addDelegate(delegateSite){
        this._delegates.push(delegateSite);
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);
        await Helper.asyncForEach(this._delegates, async delegate => {
            await delegate.onConstruct(constructParameters);
        });
        return res;
    }

    async onStart(pauseArguments) {
        await super.onStart(pauseArguments);
        await Helper.asyncForEach(this._delegates, async delegate => {
            await delegate.onStart(pauseArguments);
        });
    }

    onBackPressed() {
        super.onBackPressed();
        this._delegates.forEach(delegate => {
            delegate.onBackPressed();
        });
    }


    onMenuPressed() {
        super.onMenuPressed();
        this._delegates.forEach(delegate => {
            delegate.onMenuPressed();
        });
    }

    onSearchPressed() {
        super.onSearchPressed();
        this._delegates.forEach(delegate => {
            delegate.onSearchPressed();
        });
    }

    async onViewLoaded() {
        let res =  super.onViewLoaded();
        await Helper.asyncForEach(this._delegates, async delegate => {
            await delegate.onViewLoaded();
        });
        return res;
    }

    async onPause() {
        await super.onPause();
        await Helper.asyncForEach(this._delegates, async delegate => {
            await delegate.onPause();
        });
    }

    async onDestroy() {
        await super.onDestroy();
        await Helper.asyncForEach(this._delegates, async delegate => {
            await delegate.onDestroy();
        });
    }
}