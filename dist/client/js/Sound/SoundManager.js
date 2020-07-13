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
exports.SoundManager = void 0;
const AudioChain_1 = require("./AudioChain");
const Helper_1 = require("js-helper/dist/shared/Helper");
const App_1 = require("../App");
class SoundManager {
    constructor() {
        this.channels = {};
        if ('AudioContext' in window) {
            this.context = new AudioContext();
        }
        else if ('webkitAudioContext' in window) {
            // @ts-ignore
            this.context = new webkitAudioContext();
        }
        else {
            throw new Error("No audio context found!");
        }
        this.context.onstatechange = function () {
            console.log("stateChange from context", arguments);
        };
        this.context.oncomplete = function () {
            console.log("onComplete from context", arguments);
        };
        window.addEventListener("visibilitychange", (e) => {
            // console.log("visibility Change event", e);
            this.handleVisibilityChange();
        });
        //For safari
        let checkVisibility = () => {
            this.handleVisibilityChange();
            setTimeout(checkVisibility, 500);
        };
        checkVisibility();
    }
    static getInstance() {
        if (Helper_1.Helper.isNull(SoundManager._instance)) {
            SoundManager._instance = new SoundManager();
        }
        return SoundManager._instance;
    }
    isNotSuspended() {
        // return false;
        return this.context.state !== "suspended";
    }
    set(options, channel) {
        channel = Helper_1.Helper.nonNull(channel, SoundManager.CHANNELS.DEFAULT);
        let audioObject = Helper_1.Helper.nonNull(this.channels[channel], {});
        if (typeof options === "string") {
            options = { audio: options };
        }
        let audio = options.audio;
        if (Helper_1.Helper.isNotNull(audio)) {
            audioObject.loadedPromise = fetch(audio).then(res => res.arrayBuffer()).then(arrayBuffer => {
                return new Promise((r) => this.context.decodeAudioData(arrayBuffer, r));
            }).catch(e => console.error(e));
            this.stop(channel);
        }
        audioObject.muted = Helper_1.Helper.nonNull(options.muted, audioObject.muted, false);
        audioObject.volume = Helper_1.Helper.nonNull(options.volume, audioObject.volume, 1);
        audioObject.loop = Helper_1.Helper.nonNull(options.loop, audioObject.loop, false);
        audioObject.timeOffset = Helper_1.Helper.nonNull(options.timeOffset, audioObject.timeOffset, 0);
        this.channels[channel] = audioObject;
        if (audioObject.muted) {
            this.stop(channel);
        }
        return this.channels[channel];
    }
    resumeContext() {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.context.resume === "function") {
                return this.context.resume();
            }
        });
    }
    play(channel, audioOrOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resumeContext();
            channel = Helper_1.Helper.nonNull(channel, SoundManager.CHANNELS.DEFAULT);
            if (Helper_1.Helper.isNull(audioOrOptions)) {
                audioOrOptions = {};
            }
            else if (!(typeof audioOrOptions === "object")) {
                audioOrOptions = {
                    audio: audioOrOptions
                };
            }
            audioOrOptions.timeOffset = Helper_1.Helper.nonNull(audioOrOptions.timeOffset, 0);
            this.stop(channel);
            this.set(audioOrOptions, channel);
            if (!this.channels[channel].muted) {
                let buffer = yield this.channels[channel].loadedPromise;
                let source = new AudioChain_1.AudioChain(this.context, buffer, (sourceNode) => {
                    let gain = this.context.createGain();
                    gain.gain.value = this.channels[channel].volume;
                    sourceNode.connect(gain);
                    gain.connect(this.context.destination);
                });
                source.setBuffer(buffer);
                //to prevent gap in mp3-files
                source.setLooping(this.channels[channel].loop, 0.3, buffer.duration - 0.3);
                this.channels[channel].source = source;
                yield source.start();
            }
            return this.channels[channel];
        });
    }
    stop(channel) {
        channel = Helper_1.Helper.nonNull(channel, SoundManager.CHANNELS.DEFAULT);
        let oldAudio = this.channels[channel];
        if (Helper_1.Helper.isNotNull(oldAudio) && Helper_1.Helper.isNotNull(oldAudio.source)) {
            oldAudio.source.stop();
        }
    }
    get(channel) {
        channel = Helper_1.Helper.nonNull(channel, SoundManager.CHANNELS.DEFAULT);
        return this.channels[channel];
    }
    resume(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            channel = Helper_1.Helper.nonNull(channel, SoundManager.CHANNELS.DEFAULT);
            if (Helper_1.Helper.isNotNull(this.channels[channel]) && !this.channels[channel].muted && Helper_1.Helper.isNotNull(this.channels[channel].source)) {
                return this.channels[channel].source.resume();
            }
        });
    }
    stopAll() {
        for (let k in this.channels) {
            if (Helper_1.Helper.isNotNull(this.channels[k].source)) {
                this.channels[k].source.stop();
            }
        }
    }
    resumeAllIfNotMuted() {
        for (let k in this.channels) {
            if (Helper_1.Helper.isNotNull(this.channels[k]) && !this.channels[k].muted && Helper_1.Helper.isNotNull(this.channels[k].source)) {
                this.channels[k].source.resume();
            }
        }
    }
    handleVisibilityChange() {
        if (document.hidden) {
            this.stopAll();
        }
        else {
            this.resumeAllIfNotMuted();
        }
    }
}
exports.SoundManager = SoundManager;
SoundManager.CHANNELS = {
    MUSIC: "music",
    SOUND: "sound",
    DEFAULT: "default"
};
App_1.App.addInitialization(app => {
    // PauseSite.onPauseListeners.push(() => {
    //     SoundManager.getInstance().stopAll();
    // });
    // PauseSite.onStartListeners.push(() => {
    //     SoundManager.getInstance().resumeAllIfNotMuted();
    // });
});
// AndroidBridge.addDefinition(() => {
// window["soundManagerInstance"] = SoundManager.getInstance();
// window["soundManagerInstance"]["stopAll"] = window["soundManagerInstance"].stopAll;
// window["soundManagerInstance"]["resumeAllIfNotMuted"] = window["soundManagerInstance"].resumeAllIfNotMuted;
// });
//# sourceMappingURL=SoundManager.js.map