"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioChain = void 0;
const Helper_1 = require("js-helper/dist/shared/Helper");
class AudioChain {
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
        if (Helper_1.Helper.isNotNull(loopStart)) {
            this._loopStart = loopStart;
        }
        if (Helper_1.Helper.isNotNull(loopEnd)) {
            this._loopEnd = loopEnd;
        }
    }
    start(delay, offset, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            //sind sonst null, schmeißt in Android 5 einen fehler
            delay = Helper_1.Helper.nonNull(delay, 0);
            offset = Helper_1.Helper.nonNull(offset, 0);
            //Duration darf nicht gesetzt werden
            // duration = Helper.nonNull(duration, -1);
            let source = this._context.createBufferSource();
            source.loop = this._shouldLoop;
            if (Helper_1.Helper.isNotNull(this._loopStart)) {
                source.loopStart = this._loopStart;
            }
            if (Helper_1.Helper.isNotNull(this._loopEnd)) {
                source.loopEnd = this._loopEnd;
            }
            source.buffer = this._buffer;
            yield this._chainFunction(source);
            if (Helper_1.Helper.isNull(duration)) {
                source.start(delay, offset);
            }
            else {
                source.start(delay, offset, duration);
            }
            this._startTime = (new Date()).getTime() - (Helper_1.Helper.nonNull(offset, 0) * 1000);
            this._source = source;
            this._running = true;
        });
    }
    stop(delay) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Helper_1.Helper.isNotNull(this._source)) {
                delay = Helper_1.Helper.nonNull(delay, 0);
                this._pauseTime = ((new Date()).getTime()) - this._startTime;
                this._running = false;
                return this._source.stop(delay);
            }
            return null;
        });
    }
    resume() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._running) {
                return this.start(null, Helper_1.Helper.nonNull(this._pauseTime, 0) / 1000.0);
            }
        });
    }
}
exports.AudioChain = AudioChain;
//# sourceMappingURL=AudioChain.js.map