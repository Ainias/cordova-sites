// import {MBBDatabase} from "../Database/MBBDatabase";
import {Helper} from "../Helper";

export class BaseModel {

    constructor() {
        this._id = null;
    }

    /**
     * @returns {number|null}
     */
    getId() {
        return this._id;
    }

    /**
     * @param {number} id
     */
    setId(id) {
        this._id = id;
    }

    async save() {
        //Wenn direkt BaseModel.saveModel aufgerufen wird, später ein Fehler geschmissen (_method not defined), da der
        // falsche Kontext am Objekt existiert
        return this.constructor.saveModel(this);
    }

    static _newModel() {
        return new this();
    }

    static getModelName() {
        throw new Error("_method not defined!");
    }

    static getTableSchema() {
        throw new Error("_method not defined!");
    }

    static _getDBInstance() {
        throw new Error("_method not defined!");
    }

    /**
     * @param model
     * @private
     */
    static _modelToJson(model) {
        let schemaDefinition = this.getTableSchema();
        let jsonObject = {};
        schemaDefinition.forEach(column => {
            let getterName = ["get", column.key.substr(0, 1).toUpperCase(), column.key.substr(1)].join('');
            if (typeof model[getterName] === "function") {
                jsonObject[column.key] = model[getterName]();
            }
        });
        return jsonObject;
    }

    /**
     * Saves entity
     * @param model
     * @return {Promise<*>}
     */
    static async saveModel(model) {
        let table = this.getTable();
        let jsonModel = this._modelToJson(model);

        table = await table;
        let res = await table.query("upsert", jsonModel).exec();
        if (res[0] && res[0]["affectedRowPKS"] && res[0]["affectedRows"] && res[0]["affectedRows"].length >= 1) {
            let jsonObject = res[0]["affectedRows"][0];
            let entity = this._inflate(jsonObject, model);
            this.entities = Helper.nonNull(this.entities, {});
            this.entities[entity.getId()] = entity;
            return entity;
        }
        return null;
    }

    /**
     * Get the table
     * @return {Promise<Promise<NanoSQLInstance>}
     */
    static getTable() {
        let db = this._getDBInstance();
        return db.getTable(this.getModelName());
    }

    /**
     * Finds element by id. Recommend approach, because it caches elements
     *
     * @param id
     * @return {Promise<BaseModel>}
     */
    static async findById(id) {
        id = parseInt(id);
        this.entities = Helper.nonNull(this.entities, {});
        if (!this.entities[id]) {
            this.entities[id] = await this.selectOne({"id": id});
        }
        return this.entities[id];

    }

    /**
     * Selects one element from database
     *
     * @param where
     * @param orderBy
     * @param offset
     * @return {Promise<*>}
     */
    static async selectOne(where, orderBy, offset) {
        let models = await this.select(where, orderBy, 1, offset);
        if (models.length >= 1) {
            return models[0];
        }
        return null;
    }

    /**
     * @param where
     * @param orderBy
     * @param limit
     * @param offset
     * @returns {Promise<[BaseModel]>}
     */
    static async select(where, orderBy, limit, offset) {
        let table = await this.getTable();

        let query = table.query("select");
        if (Helper.isNotNull(where)) {
            if (!Array.isArray(where) && typeof where === "object") {
                let newWhere = [];
                let keys = Object.keys(where);
                keys.forEach((key, index) => {
                    newWhere.push([key, "=", where[key]]);
                    if (index < keys.length - 1) {
                        newWhere.push("AND");
                    }
                });
                where = newWhere;
            }
            query = query.where(where);
        }
        if (Helper.isNotNull(orderBy)) {
            query = query.orderBy(orderBy);
        }
        if (Helper.isNotNull(limit)) {
            query = query.limit(limit);
        }
        if (Helper.isNotNull(offset)) {
            query = query.offset(offset);
        }
        let entities = this._inflate(await query.exec());
        this.entities = Helper.nonNull(this.entities, {});
        entities.forEach(entity => {
            this.entities[entity.getId()] = entity;
        });
        return entities;
    }

    /**
     * Creates Models from json-Object
     *
     * @param jsonObjects
     * @param models
     * @return {*}
     * @private
     */
    static _inflate(jsonObjects, models) {
        models = Helper.nonNull(models, []);

        let isArray = Array.isArray(jsonObjects);
        if (!isArray) {
            jsonObjects = [jsonObjects];
        }
        if (!Array.isArray(models)) {
            models = [models];
        }

        jsonObjects.forEach((jsonObject, index) => {
            let model = (models.length > index) ? models[index] : this._newModel();
            for (let k in jsonObject) {
                let setterName = ["set", k.substr(0, 1).toUpperCase(), k.substr(1)].join('');
                if (typeof model[setterName] === "function") {
                    model[setterName](jsonObject[k]);
                }
                models[index] = model;
            }
        });
        if (!isArray) {
            models = (models.length > 0) ? models[0] : null;
        }
        return models;
    }
}