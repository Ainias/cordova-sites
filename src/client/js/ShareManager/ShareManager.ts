import {Helper} from "js-helper/dist/shared/Helper";
import {ViewHelper} from "js-helper/dist/client/ViewHelper";
import {ShareDialog} from "./ShareDialog";

declare const device;

export class ShareManager {
    share(text){
        if (device.platform === "browser"){
            this._shareBrowser(text);
        }
        else {
            this._shareMobile(text);
        }
    }

    _shareMobile(text){
        navigator["share"](text);
    }

    _shareBrowser(text){
        new ShareDialog(text).show();
    }
}