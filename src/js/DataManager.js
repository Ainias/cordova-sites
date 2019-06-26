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
                resolve(new Response(xhr.responseText, {status: (xhr.status === 0)?200:xhr.status}))
            };
            xhr.onerror = function (e) {
                reject(e)
            };

            xhr.open('GET', url);

            //set headers
            Object.keys(DataManager._additionalHeaders).forEach(header => {
                xhr.setRequestHeader(header, DataManager._additionalHeaders[header]);
            });

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
    static async load(url, asJson, useBasePath) {
        asJson = Helper.nonNull(asJson, true);
        useBasePath = Helper.nonNull(useBasePath, true);

        url = (useBasePath) ? DataManager.basePath(url) : url;
        return DataManager.fetch(url, {"credentials": "same-origin"}).then(function (res) {
            if (asJson) {
                return res.json();
            }
            return res.text();
        }).catch(e => console.error(e));
    }

    /**
     * Vereinfachung von Laden von Resourcen.
     * Lädt per GET das angegebene Asset und gibt diese als JSON oder Text zurück
     *
     * @param url
     * @param asJson
     * @returns {Promise<* | never | void>}
     */
    static async loadAsset(url) {
        return this.load(url, false, false);
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

    static async send(url, params) {
        url = DataManager.basePath(url);

        let headers = {};
        if (!(params instanceof FormData) && typeof params === "object") {
            params = JSON.stringify(params);
            headers = {
                "Content-Type": "application/json"
            }
        }

        Object.keys(DataManager._additionalHeaders).forEach(header => {
            headers[header] = DataManager._additionalHeaders[header];
        });

        return fetch(url, {
            "credentials": "same-origin",
            "method": "POST",
            "headers": headers,
            "body": params,
        }).then(function (res) {
            return res.json();
        }).catch(function (e) {
            console.error("error", e);
            return {
                "success": false,
                "errors": [
                    "not-online"
                ]
            }
        });
    }

    static basePath(url) {
        return DataManager._basePath + url;
    }

    static setHeader(header, value){
        DataManager._additionalHeaders[header] = value;
    }
}
DataManager._additionalHeaders = {};
DataManager._basePath = "";