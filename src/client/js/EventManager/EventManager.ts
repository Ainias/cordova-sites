import {Helper} from "../Helper";

export class EventManager{
    private static _instance: any = null;
    private _listeners: {};
    private _lastListenerId: number;

    /**
     * @return {EventManager}
     */
    static getInstance(){
        if (!this._instance){
            this._instance = new EventManager();
        }
        return this._instance;
    }

    constructor(){
        this._listeners = {};
        this._lastListenerId = 0;
    }

    addListener(event, listener){
        if (typeof listener !== "function"){
            throw new Error("can only add functions as listeners!");
        }

        this._lastListenerId++;

        if (!this._listeners[event]){
            this._listeners[event] = {};
            this._listeners[event][this._lastListenerId] = listener;
        }

        return this._lastListenerId;
    }

    removeListener(event, listenerId){
        if (this._listeners[event] && this._listeners[event][listenerId]){
            delete this._listeners[event][listenerId];
        }
    }

    async trigger(event, data){
        if (this._listeners[event]){
            await Helper.asyncForEach(Object.keys(this._listeners[event]), async listenerId => {
                await this._listeners[event][listenerId](data);
            }, true);
        }
    }

    static async trigger(event, data){
        return this.getInstance().trigger(event, data);
    }
}