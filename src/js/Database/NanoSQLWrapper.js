import {nSQL} from "nano-sql";
import {SQLiteStore} from "cordova-plugin-nano-sqlite/lib/sqlite-adapter";

/**
 * Wrapper für Nano-SQL, sollte Abgeleitet werden und setupDatabase überschrieben werden
 *
 * Handled den Datenbank-Typ (IndexedDB, SQLite, ...) in _connectToDatabase
 * Bei Anfragen durch getTable() ist die Datenbank verbunden
 */
export class NanoSQLWrapper {

    /**
     * Initialisiert das Verbindungs-Promise,
     * Lässt die Datenbank initialisieren und verbinden
     *
     * @param databaseName
     */
    constructor(databaseName) {
        this.connectionResolveReject = {};
        this._connectionPromise = new Promise((resolver, rejecter) => {
            this.connectionResolveReject.resolve = resolver;
            this.connectionResolveReject.reject = rejecter;
        });

        this.databaseName = databaseName;

        this.setupDatabase();
        this._connectToDatabase();
    }

    /**
     * Methode, welche von Kinderklassen überschrieben werden sollte
     * Datenbank-Schema sollte hier definiert werden
     */
    setupDatabase() {

    }

    /**
     * Hilfs-funktion, um ein Model/Eine Tabelle schneller zu generieren
     *
     * @param name
     * @param schema
     */
    declareModel(name, schema) {
        return nSQL(name).model(schema);
    }

    /**
     * Methode, welche sich zur Datenbank verbindet. Benutzt den an den Constructor übergebenen Datenbanknamen
     *
     * @returns {Promise<any>}
     */
    async _connectToDatabase() {
        nSQL().config({
            mode: (typeof cordova === "undefined"
                || window.cordova.platformId === "browser"
                || !window["sqlitePlugin"]) ?
                "PERM" : new SQLiteStore(),
            id: this.databaseName
        }).connect().then(this.connectionResolveReject.resolve).catch(this.connectionResolveReject.reject);
        return this._connectionPromise;
    }

    async waitForConnection(){
        return this._connectionPromise;
    }

    /**
     *  Gibt ein Promise mit einer NanoSQLInstance auf die entsprechende Tabelle zurück.
     *  Promise wartet auf das Verbinden der Datenbank (welches durch den Constructor ausgelöst wird), um vorzeitige
     *  Anfragen zu verhindern.
     *
     * @param table
     * @returns {Promise<NanoSQLInstance>}
     */
    async getTable(table) {
        await this._connectionPromise;
        return nSQL(table);
    }
}
