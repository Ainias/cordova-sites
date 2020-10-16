import {Helper} from "./Legacy/Helper";
import {NotOnlineError} from "./DataManager/NotOnlineError";

/**
 * Ein Manager, welches das Laden von Resourcen übernimmt.
 */
export class DataManager {

    static _additionalHeaders;
    static _basePath: string;
    static _assetBasePath: string;

    static onlineCallback = null;

    /**
     * Diese Funktion sollte anstelle von dem nativen "fetch" verwendet werden!
     * Das native Fetch kann keine file://, welches von Cordova unter Android (und whs iOS) verwendet wird
     * Daher wird heir auf XMLHttpRequest zurückgegriffen
     *
     * @param url
     * @param useArrayBuffer
     * @returns {Promise<*>}
     */
    static async fetch(url, useArrayBuffer?) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();

            useArrayBuffer = Helper.nonNull(useArrayBuffer, false);

            if (useArrayBuffer){
                xhr.responseType = "arraybuffer";
            }

            xhr.onload = function () {
                resolve(new Response(useArrayBuffer ? xhr.response : xhr.responseText, {status: (xhr.status === 0) ? 200 : xhr.status}))
            };
            xhr.onerror = function (e) {
                console.error(e);
                debugger;
                reject(new NotOnlineError("not-online", url));
            };

            xhr.open('GET', url);

            //set headers
            Object.keys(DataManager._additionalHeaders).forEach(header => {
                xhr.setRequestHeader(header, DataManager._additionalHeaders[header]);
            });

            xhr.send(null)
        }).then(res => {
            if (DataManager.onlineCallback) {
                DataManager.onlineCallback(true);
            }
            return res;
        }).catch(e => {
            if (DataManager.onlineCallback) {
                DataManager.onlineCallback(false);
            }
            throw e;
        });
    }

    static async fetchBlob(url) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.onload = function (e) {
                resolve(xhr.response)
            };
            xhr.onerror = function (e) {
                console.error(e);
                debugger;
                reject(new NotOnlineError("not-online", url));
            };

            xhr.open('GET', url);
            xhr.responseType = "blob";

            //set headers
            Object.keys(DataManager._additionalHeaders).forEach(header => {
                xhr.setRequestHeader(header, DataManager._additionalHeaders[header]);
            });

            xhr.send(null)
        }).then(res => {
            if (DataManager.onlineCallback) {
                DataManager.onlineCallback(true);
            }
            return res;
        }).catch(e => {
            if (DataManager.onlineCallback) {
                DataManager.onlineCallback(false);
            }
            throw e;
        });
    }

    /**
     * Vereinfachung von Laden von Resourcen.
     * Lädt per GET die angegebene URL und gibt diese als JSON oder Text zurück
     *
     * @param url
     * @param format
     * @param useBasePath
     * @returns {Promise<*  | void>}
     */
    static async load(url, format?, useBasePath?) {
        format = Helper.nonNull(format, true);

        if (format === true) {
            format = "json";
        } else if (format === false) {
            format = "text";
        } else if (format !== "json" && format !== "text") {
            format = "raw";
        }

        useBasePath = Helper.nonNull(useBasePath, true);
        if (useBasePath === true) {
            useBasePath = DataManager._basePath;
        } else if (typeof useBasePath !== "string") {
            useBasePath = "";
        }

        url = DataManager.basePath(url, useBasePath);
        return DataManager.fetch(url, format === "raw").catch(e => {
            if (DataManager.onlineCallback) {
                DataManager.onlineCallback(false);
            }
            throw new NotOnlineError(e, url);
        }).then(function (res: Response) {
            if (DataManager.onlineCallback) {
                DataManager.onlineCallback(true);
            }
            if (format === "json") {
                return res.json();
            } else if (format === "text") {
                return res.text();
            } else {
                return res;
            }
        });
    }

    /**
     * Vereinfachung von Laden von Resourcen.
     * Lädt per GET das angegebene Asset und gibt diese als JSON oder Text zurück
     *
     * @param url
     * @param format
     * @returns {Promise<*  | void>}
     */
    static async loadAsset(url, format?) {
        return this.load(url, Helper.nonNull(format, "text"), DataManager._assetBasePath);
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

    /**
     * Wandelt ein Key-Value-Objekt in einen QueryString um
     *
     * @param values
     * @return {string}
     */
    static buildQueryWithoutNullValues(values) {
        let queryValues = {};
        for (let k in values) {
            if (Helper.isNotNull(values[k])) {
                queryValues[k] = values[k];
            }
        }
        return this.buildQuery(queryValues);
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
            debugger;
            console.error("error", e);
            if (DataManager.onlineCallback) {
                DataManager.onlineCallback(false);
            }
            return {
                "success": false,
                "errors": [
                    "not-online"
                ]
            }
        });
    }

    static basePath(url, basePath?) {
        basePath = Helper.nonNull(basePath, DataManager._basePath);
        return basePath + ((url) ? url : "");
    }

    static setHeader(header, value) {
        DataManager._additionalHeaders[header] = value;
    }
}

DataManager._additionalHeaders = {};
DataManager._basePath = "";
DataManager._assetBasePath = "";