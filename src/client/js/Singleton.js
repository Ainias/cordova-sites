export class Singleton {
    /**
     *
     * @returns {Singleton|this}
     */
    static getInstance(){
        if (!this._instance){
            this._instance = new this();
        }
        return this._instance;
    }
}