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
const js_helper_1 = require("js-helper");
const NativeStoragePromise_1 = require("../NativeStoragePromise");
class Matomo {
    static init() {
        Matomo.isTrackingPromise = new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let shouldTrack = yield NativeStoragePromise_1.NativeStoragePromise.getItem(Matomo.LOCAL_STORAGE_KEY, "1");
            if (js_helper_1.Helper.isNull(shouldTrack)) {
                shouldTrack = yield Matomo._askIsTracking();
                yield NativeStoragePromise_1.NativeStoragePromise.setItem(Matomo.LOCAL_STORAGE_KEY, shouldTrack);
            }
            else {
                shouldTrack = (shouldTrack === "1");
                yield Matomo.setTrack(shouldTrack);
            }
            resolve(shouldTrack);
        }));
        Matomo.isTrackingPromise.then(() => {
            Matomo.push(['trackPageView'], true);
            Matomo.push(['enableLinkTracking'], true);
            Matomo.push(['setTrackerUrl', Matomo.TRACK_SITE + '/piwik.php'], true);
            Matomo.push(['setSiteId', Matomo.SIDE_ID + ""], true);
            let d = document, g = d.createElement('script'), s = d.getElementsByTagName('head')[0];
            g.type = 'text/javascript';
            g.async = true;
            g.defer = true;
            g.src = Matomo.TRACK_SITE + '/piwik.js';
            s.appendChild(g);
        });
    }
    static update(title) {
        if (js_helper_1.Helper.nonNull(Matomo.currentUrl)) {
            Matomo.push(['setReferrerUrl', Matomo.currentUrl]);
        }
        Matomo.currentUrl = window.location.pathname + window.location.search;
        Matomo.push(['setCustomUrl', Matomo.currentUrl]);
        Matomo.push(['setDocumentTitle', title]);
        // remove all previously assigned custom variables, requires Matomo (formerly Piwik) 3.0.2
        Matomo.push(['deleteCustomVariables', 'page']);
        Matomo.push(['setGenerationTimeMs', 0]);
        Matomo.push(['trackPageView']);
        // make Matomo aware of newly added content
        var content = document.getElementById('site-content');
        Matomo.push(['MediaAnalytics::scanForMedia', content]);
        Matomo.push(['FormAnalytics::scanForForms', content]);
        Matomo.push(['trackContentImpressionsWithinNode', content]);
        Matomo.push(['enableLinkTracking']);
    }
    static _askIsTracking() {
        return __awaiter(this, void 0, void 0, function* () {
            Matomo.isTrackingPromise = new Promise(resolve => {
                Matomo.push([function () {
                        resolve(!this["isUserOptedOut"]());
                    }]);
            });
            return Matomo.isTrackingPromise;
        });
    }
    static query(method) {
        return __awaiter(this, void 0, void 0, function* () {
            return fetch(Matomo.TRACK_SITE + Matomo.BASE_PATH + method, {
                "mode": "cors",
                "credentials": "include",
            }).then(res => res.text()).then(text => (new window["DOMParser"]()).parseFromString(text, "text/xml"));
        });
    }
    static getTrackingPromise() {
        return Matomo.isTrackingPromise;
    }
    static setTrack(shouldTrack) {
        return __awaiter(this, void 0, void 0, function* () {
            Matomo.isTrackingPromise = Promise.resolve(shouldTrack);
            yield NativeStoragePromise_1.NativeStoragePromise.setItem(Matomo.LOCAL_STORAGE_KEY, (shouldTrack === true) ? "1" : "0");
            if (shouldTrack) {
                yield Matomo.push(["forgetUserOptOut"], true);
            }
            else {
                yield Matomo.push(["optUserOut"], true);
            }
        });
    }
    static trackEvent(event, name, label, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let ev = ["trackEvent", event, name];
            if (js_helper_1.Helper.isNotNull(label)) {
                ev.push(label);
            }
            if (js_helper_1.Helper.isNotNull(value) && !isNaN(parseFloat(value)) && isFinite(value)) {
                ev.push(value);
            }
            return this.push(ev);
        });
    }
    //TODO Matomo
    static push(arr, force) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (!Array.isArray(arr)) {
            //     arr = [arr];
            // }
            // window["_paq"].push(arr);
        });
    }
}
exports.Matomo = Matomo;
Matomo.LOCAL_STORAGE_KEY = "matomoShouldTrack";
Matomo.TRACK_SITE = "";
Matomo.BASE_PATH = "";
Matomo.SIDE_ID = "1";
Matomo.currentUrl = null;
Matomo.isTrackingPromise = null;
//# sourceMappingURL=Matomo.js.map