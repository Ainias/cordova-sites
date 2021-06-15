export declare class Helper {
    /**
     * Testet, ob eine Variable null oder Undefined ist
     *
     * @param variable
     * @returns {boolean}
     */
    static isNull(variable: any): boolean;
    /**
     * Testet, ob eine Variable nicht (null oder undefined) ist
     *
     * @param variable
     * @returns {boolean}
     */
    static isNotNull(variable: any): boolean;
    /**
     * Gibt den ersten übergebenen Wert, der nicht (null oder undefined) ist, zurück
     *
     * @param val1
     * @param val2
     * @param args
     * @returns {*}
     */
    static nonNull(val1: any, val2: any, ...args: any[]): any;
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
    static isSet(object: any, ...indexes: any[]): any;
    /**
     * Testet, ob ein Wert null oder Leerstring, bzw nur aus leerzeichend bestehender String ist
     *
     * @param value
     * @returns {boolean}
     */
    static empty(value: any): boolean;
    /**
     * Testet, ob ein Wert NICHT (null oder Leerstring, bzw nur aus leerzeichend bestehender String ist)
     *
     * @param value
     * @returns {boolean}
     */
    static notEmpty(value: any): boolean;
    /**
     * Formatiert ein Date-Object nach der Vorlage von der C-Funktion strftime
     *
     * @param sFormat
     * @param date
     * @param useUTC
     * @returns {*|void|string|never}
     */
    static strftime(sFormat: any, date: any, useUTC: any, makePersistentTranslation: any): any;
    static arrayToObject(array: any, indexFunction: any): {};
    /**
     * Deepcopies JSON
     *
     * @param obj
     * @returns {*}
     */
    static cloneJson(obj: any): any;
    /**
     * Erstellt ein FormData-Object von JSON-Data. Nützlich für fetch
     *
     * @param obj
     * @returns {FormData}
     */
    static formDataFromObject(obj: any): FormData;
    /**
     * Entfernt alle Children eines Elements
     *
     * @param element
     * @returns {Node}
     */
    static removeAllChildren(element: any): any;
    static shuffleArray(array: any): any;
    static padZero(n: any, width?: any, z?: any): any;
    static deepEqual(a: any, b: any): any;
    static htmlspecialcharsDecode(text: any): any;
    /**
     * Inverts the key-Values for an object
     * @param obj
     * @return {*}
     */
    static invertKeyValues(obj: any): {};
    static asyncForEach(array: any, callback: any, runAsyncronous?: any): Promise<any[]>;
    static escapeRegExp(str: any): any;
    static objectForEach(object: any, callback: any): void;
    static toArray(object: any): any[];
    static imageUrlIsEmpty(url: any): boolean;
    static newPromiseWithResolve(): Promise<unknown>;
}
