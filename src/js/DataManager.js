import {Helper} from "./Helper";

/**
 * Ein Manager, welches das Laden von Resourcen übernimmt.
 */
export class DataManager {

    /**
     * Diese Funktion sollte anstelle von dem nativen "fetch" verwendet werden!
     * Das native Fetch kann keine file://, welches von Cordova unter Android (und whs iOS) verwendet wird
     * Daher wird heir auf XMLHttpRequest zurückgegriffen
     *
     * @param url
     * @param options
     * @returns {Promise<*>}
     */
    static async fetch(url, options) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(new Response(xhr.responseText, {status: xhr.status}))
            };
            xhr.onerror = function () {
                reject(new TypeError('Local request failed'))
            };
            xhr.open('GET', url);
            xhr.send(null)
        });
    }

    /**
     * Vereinfachung von Laden von Resourcen.
     * Lädt per GET die angegebene URL und gibt diese als JSON oder Text zurück
     *
     * @param url
     * @param asJson
     * @returns {Promise<* | never | void>}
     */
    static async load(url, asJson) {
        asJson = Helper.nonNull(asJson, true);
        return DataManager.fetch(url, {"credentials": "same-origin"}).then(function (res) {
            if (asJson) {
                return res.json();
            }
            return res.text();
        }).catch(e => console.error(e));
    }

    /**
     * Wandelt ein Key-Value-Objekt in einen QueryString um
     *
     * @param values
     * @return {string}
     */
    static buildQuery(values) {
        let queryStrings = [];
        for (let k in values) {
            queryStrings.push(encodeURIComponent(k) + "=" + encodeURIComponent(values[k]));
        }
        return "?" + queryStrings.join("&");
    }
}