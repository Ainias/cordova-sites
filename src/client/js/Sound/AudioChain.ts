import {Helper} from "js-helper/dist/shared/Helper";

export class AudioChain {
    private _buffer: any;
    private _shouldLoop: boolean;
    private _loopStart: any;
    private _loopEnd: any;
    private _chainFunction: any;
    private _context: any;
    private _startTime: any;
    private _pauseTime: any;
    private _source: any;
    private _running: boolean;

    constructor(context, sourceBuffer, chainFunction) {
        this._buffer = sourceBuffer;
        this._shouldLoop = false;
        this._loopStart = null;
        this._loopEnd = null;
        this._chainFunction = chainFunction;
        this._context = context;

        this._startTime = null;
        this._pauseTime = null;
        this._source = null;

        this._running = false;
    }

    setBuffer(buffer) {
        this._buffer = buffer;
    }

    setLooping(shouldLoop, loopStart, loopEnd) {
        this._shouldLoop = shouldLoop;

        if (Helper.isNotNull(loopStart)) {
            this._loopStart = loopStart;
        }
        if (Helper.isNotNull(loopEnd)) {
            this._loopEnd = loopEnd;
        }
    }

    async start(delay?, offset?, duration?) {
        //sind sonst null, schmeißt in Android 5 einen fehler
        delay = Helper.nonNull(delay, 0);
        offset = Helper.nonNull(offset, 0);
        //Duration darf nicht gesetzt werden
        // duration = Helper.nonNull(duration, -1);

        let source = this._context.createBufferSource();

        source.loop = this._shouldLoop;
        if (Helper.isNotNull(this._loopStart)) {
            source.loopStart = this._loopStart;
        }
        if (Helper.isNotNull(this._loopEnd)) {
            source.loopEnd = this._loopEnd;
        }
        source.buffer = this._buffer;
        await this._chainFunction(source);

        if (Helper.isNull(duration)){
            source.start(delay, offset);
        }
        else{
            source.start(delay, offset, duration);
        }
        this._startTime = (new Date()).getTime() - (Helper.nonNull(offset, 0) * 1000);
        this._source = source;
        this._running = true;
    }

    async stop(delay) {
        if (Helper.isNotNull(this._source)) {
            delay = Helper.nonNull(delay, 0);

            this._pauseTime = ((new Date()).getTime()) - this._startTime;
            this._running = false;
            return this._source.stop(delay);
        }
        return null;
    }

    async resume() {

        if (!this._running) {
            return this.start(null, Helper.nonNull(this._pauseTime, 0) / 1000.0);
        }
    }
}