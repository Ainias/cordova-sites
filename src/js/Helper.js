/**
 * Eine Klasse mit häufig genutzten, nützlichen Funktionen
 */
import {Translator} from "./Translator";

export class Helper {
    /**
     * Testet, ob eine Variable null oder Undefined ist
     *
     * @param variable
     * @returns {boolean}
     */
    static isNull(variable) {
        return (variable === null || variable === undefined);
    }

    /**
     * Testet, ob eine Variable nicht (null oder undefined) ist
     *
     * @param variable
     * @returns {boolean}
     */
    static isNotNull(variable) {
        return !Helper.isNull(variable);
    }

    /**
     * Gibt den ersten übergebenen Wert, der nicht (null oder undefined) ist, zurück
     *
     * @param val1
     * @param val2
     * @param args
     * @returns {*}
     */
    static nonNull(val1, val2, ...args) {
        for (let i = 0; i < arguments.length; i++) {
            if (Helper.isNotNull(arguments[i])) {
                return arguments[i];
            }
        }
        return null;
    }

    /**
     * Testet, ob der übergebene Index am Objekt gesetzt ist. Werden mehrere Indexes übergeben, so wird getestet,
     * ob die "Index-Kette" gesetzt ist.
     * Bsp.:
     *  Helper.isSet({"index1":{"index2":value}}, "index1", "index2") ist wahr
     *
     * @param object
     * @param indexes
     * @returns {*}
     */
    static isSet(object, ...indexes) {
        if (Helper.isNotNull(object)) {
            if (indexes.length === 0) {
                return true;
            }
            return (Helper.isSet.apply(null, [object[indexes[0]]].concat(indexes.slice(1))));
        }
        return false;
    }

    /**
     * Testet, ob ein Wert null oder Leerstring, bzw nur aus leerzeichend bestehender String ist
     *
     * @param value
     * @returns {boolean}
     */
    static empty(value) {
        return (Helper.isNull(value) || (typeof value === 'string' && value.trim() === ""))
    }

    /**
     * Testet, ob ein Wert NICHT (null oder Leerstring, bzw nur aus leerzeichend bestehender String ist)
     *
     * @param value
     * @returns {boolean}
     */
    static notEmpty(value) {
        return !Helper.empty(value);
    }

    /**
     * Formatiert ein Date-Object nach der Vorlage von der C-Funktion strftime
     *
     * @param sFormat
     * @param date
     * @param useUTC
     * @returns {*|void|string|never}
     */
    static strftime(sFormat, date, useUTC) {
        if (!(date instanceof Date)) date = new Date(date);
        useUTC = Helper.nonNull(useUTC, false);
        let nDay = (useUTC) ? date.getUTCDay() : date.getDay(),
            nDate = (useUTC) ? date.getUTCDate() : date.getDate(),
            nMonth = (useUTC) ? date.getUTCMonth() : date.getMonth(),
            nYear = (useUTC) ? date.getUTCFullYear() : date.getFullYear(),
            nHour = (useUTC) ? date.getUTCHours() : date.getHours(),
            aDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            aMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
            isLeapYear = function () {
                if ((nYear & 3) !== 0) return false;
                return nYear % 100 !== 0 || nYear % 400 === 0;
            },
            getThursday = function () {
                let target = new Date(date);
                target.setDate(nDate - ((nDay + 6) % 7) + 3);
                return target;
            },
            zeroPad = function (nNum, nPad) {
                return ('' + (Math.pow(10, nPad) + nNum)).slice(1);
            };

        return sFormat.replace(/%[a-z]/gi, function (sMatch) {
            return {
                '%a': Translator.makePersistentTranslation(aDays[nDay].slice(0, 3)).outerHTML,
                '%A': Translator.makePersistentTranslation(aDays[nDay]).outerHTML,
                '%b': Translator.makePersistentTranslation(aMonths[nMonth].slice(0, 3)).outerHTML,
                '%B': Translator.makePersistentTranslation(aMonths[nMonth]).outerHTML,
                '%c': date.toUTCString(),
                '%C': Math.floor(nYear / 100),
                '%d': zeroPad(nDate, 2),
                '%e': nDate,
                '%f': zeroPad(date.getTime() % 1000, 4),
                '%F': date.toISOString().slice(0, 10),
                '%G': getThursday().getFullYear(),
                '%g': ('' + getThursday().getFullYear()).slice(2),
                '%H': zeroPad(nHour, 2),
                '%I': zeroPad((nHour + 11) % 12 + 1, 2),
                '%j': zeroPad(aDayCount[nMonth] + nDate + ((nMonth > 1 && isLeapYear()) ? 1 : 0), 3),
                '%k': '' + nHour,
                '%l': (nHour + 11) % 12 + 1,
                '%m': zeroPad(nMonth + 1, 2),
                '%M': zeroPad(date.getMinutes(), 2),
                '%p': (nHour < 12) ? 'AM' : 'PM',
                '%P': (nHour < 12) ? 'am' : 'pm',
                '%s': Math.round(date.getTime() / 1000),
                '%S': zeroPad(date.getSeconds(), 2),
                '%u': nDay || 7,
                '%V': (function () {
                    let target = getThursday(),
                        n1stThu = target.valueOf();
                    target.setMonth(0, 1);
                    let nJan1 = target.getDay();
                    if (nJan1 !== 4) target.setMonth(0, 1 + ((4 - nJan1) + 7) % 7);
                    return zeroPad(1 + Math.ceil((n1stThu - target) / 604800000), 2);
                })(),
                '%w': '' + nDay,
                '%x': date.toLocaleDateString(),
                '%X': date.toLocaleTimeString(),
                '%y': ('' + nYear).slice(2),
                '%Y': nYear,
                '%z': date.toTimeString().replace(/.+GMT([+-]\d+).+/, '$1'),
                '%Z': date.toTimeString().replace(/.+\((.+?)\)$/, '$1')
            }[sMatch] || sMatch;
        });
    }

    /**
     * Deepcopies JSON
     *
     * @param obj
     * @returns {*}
     */
    static cloneJson(obj) {
        // https://stackoverflow.com/questions/4120475/how-to-create-and-clone-a-json-object/17502990#17502990
        let i;

        // basic type deep copy
        if (Helper.isNull(obj) || typeof obj !== 'object') {
            return obj
        }
        // array deep copy
        if (obj instanceof Array) {
            let cloneA = [];
            for (i = 0; i < obj.length; ++i) {
                cloneA[i] = Helper.cloneJson(obj[i]);
            }
            return cloneA;
        }
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        // object deep copy
        let cloneO = {};
        for (i in obj) {
            cloneO[i] = Helper.cloneJson(obj[i]);
        }
        return cloneO;
    }

    /**
     * Erstellt ein FormData-Object von JSON-Data. Nützlich für fetch
     *
     * @param obj
     * @returns {FormData}
     */
    static formDataFromObject(obj) {
        let formData = new FormData();
        for (let k in obj) {
            formData.set(k, obj[k]);
        }
        return formData;
    }

    /**
     * Entfernt alle Children eines Elements
     *
     * @param element
     * @returns {Node}
     */
    static removeAllChildren(element) {
        if (element instanceof Node) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
        return element;
    }

    static shuffleArray(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    static padZero(n, width, z) {
        z = Helper.nonNull(z, '0');
        n = n + '';
        width = Helper.nonNull(width, 1);
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    static deepEqual(a, b) {
        // debugger;
        if (a === b) {
            return true;
        }

        if (typeof a === "object" && typeof b === "object") {
            let keysOfB = Object.keys(b);
            let childrenDeepEqual = Object.keys(a).every((key) => {
                let index = keysOfB.indexOf(key);
                if (index < 0) {
                    return false;
                }

                keysOfB.splice(index, 1);
                return Helper.deepEqual(a[key], b[key]);
            });
            return (childrenDeepEqual && keysOfB.length === 0);
        }
        return false;
    }


    //Ältere evtl nützliche Funktionen

    // static htmlspecialcharsDecode(text) {
    //     const map = {
    //         '&amp;': '&',
    //         '&#038;': "&",
    //         '&lt;': '<',
    //         '&gt;': '>',
    //         '&quot;': '"',
    //         '&#039;': "'",
    //         '&#8217;': "’",
    //         '&#8216;': "‘",
    //         '&#8211;': "–",
    //         '&#8212;': "—",
    //         '&#8230;': "…",
    //         '&#8221;': '”'
    //     };
    //
    //     if (Helper.isNotNull(text) && typeof text.replace === "function") {
    //         return text.replace(/\&[\w\d\#]{2,5}\;/g, function (m) {
    //             return map[m];
    //         });
    //     }
    //     return text;
    // }
    // static getIndexedObject(array, keyValue) {
    //     let obj = {};
    //     for (let i = 0, n = array.length; i < n; i++) {
    //         obj[array[i][keyValue]] = array[i];
    //     }
    //     return obj;
    // }

    /**
     * Inverts the key-Values for an object
     * @param obj
     * @return {*}
     */
    static invertKeyValues(obj) {
        let new_obj = {};

        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                new_obj[obj[prop]] = prop;
            }
        }

        return new_obj;
    }

    static async asyncForEach(array, callback, runAsyncronous) {
        runAsyncronous = Helper.nonNull(runAsyncronous, false);

        let validPromises = [];
        for (let i = 0; i < array.length; i++) {
            let index = i;
            let currentPromise = Promise.resolve(callback(array[index], index, array));
            if (!runAsyncronous) {
                await currentPromise;
            }
            validPromises.push(currentPromise);
        }
        return Promise.all(validPromises);
    }

    static escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    }

    static objectForEach(object, callback) {
        Object.keys(object).forEach(key => {
            callback(object[key], key, object);
        });
    }

    static toArray(object) {
        let res = [];
        for (let k in object) {
            res.push(object[k]);
        }
        return res;
    }

    static newPromiseWithResolve() {
        let resolver = null;
        let rejecter = null;

        let promise = new Promise((resolve, reject) => {
            resolver = resolve;
            rejecter = reject;
        });
        promise.resolve = resolver;
        promise.reject = rejecter;

        return promise;
    }
}
