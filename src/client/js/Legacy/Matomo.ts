import {Helper} from "js-helper";

export class Matomo{

    static LOCAL_STORAGE_KEY = "matomoShouldTrack";
    static TRACK_SITE = "";
    static BASE_PATH = "";
    static SIDE_ID = "1";

    static currentUrl = null;
    static isTrackingPromise = null;


    static init() {
        Matomo.isTrackingPromise = new Promise(async (resolve) => {
            let shouldTrack = Helper.nonNull(localStorage.getItem(Matomo.LOCAL_STORAGE_KEY), "1");
            if (Helper.isNull(shouldTrack)) {
                shouldTrack = await Matomo._askIsTracking();
                localStorage.setItem(Matomo.LOCAL_STORAGE_KEY, shouldTrack);
            }
            else {
                shouldTrack = (shouldTrack === "1");
                Matomo.setTrack(shouldTrack);
            }
            resolve(shouldTrack);
        });
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
        if (Helper.nonNull(Matomo.currentUrl)) {
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

    static async _askIsTracking() {
        Matomo.isTrackingPromise = new Promise(resolve => {
            Matomo.push([function () {
                resolve(!this["isUserOptedOut"]());
            }]);
            Matomo.push([function () {
                resolve(!this["isUserOptedOut"]());
            }]);
        });
        return Matomo.isTrackingPromise;
    }

    static async query(method) {
        return fetch(Matomo.TRACK_SITE + Matomo.BASE_PATH + method, {
            "mode": "cors",
            "credentials": "include",
        }).then(res => res.text()).then(text => (new window.DOMParser()).parseFromString(text, "text/xml"));
    }

    static getTrackingPromise() {
        return Matomo.isTrackingPromise;
    }

    static async setTrack(shouldTrack) {
        Matomo.isTrackingPromise = Promise.resolve(shouldTrack);
        localStorage.setItem(Matomo.LOCAL_STORAGE_KEY, (shouldTrack === true) ? "1" : "0");

        if (shouldTrack) {
            Matomo.push(["forgetUserOptOut"], true);
        }
        else {
            Matomo.push(["optUserOut"], true);
        }
    }

    static async trackEvent(event, name, label, value){
        let ev = ["trackEvent", event, name];
        if (Helper.isNotNull(label)){
            ev.push(label);
        }
        if (Helper.isNotNull(value) && !isNaN(parseFloat(value)) && isFinite(value)){
            ev.push(value);
        }

        return this.push(ev);
    }

    static async push(arr, force?) {

        if (!Array.isArray(arr)) {
            arr = [arr];
        }
        window["_paq"].push(arr);
    }
}