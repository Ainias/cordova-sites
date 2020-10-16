import {AudioChain} from "./AudioChain";
import {Helper} from "js-helper/dist/shared/Helper";
import {App} from "../App";
import {DataManager} from "../DataManager";

export class SoundManager {
    private static _instance: null | SoundManager;

    private static CHANNELS = {
        MUSIC: "music",
        SOUND: "sound",
        DEFAULT: "default"
    };

    private channels: any;
    private context: any | AudioContext;

    static getInstance() {
        if (Helper.isNull(SoundManager._instance)) {
            SoundManager._instance = new SoundManager();
        }
        return SoundManager._instance;
    }

    constructor() {
        this.channels = {};
        if ('AudioContext' in window) {
            this.context = new AudioContext();
        } else if ('webkitAudioContext' in window) {
            // @ts-ignore
            this.context = new webkitAudioContext();
        } else {
            throw new Error("No audio context found!");
        }
        this.context.onstatechange = function () {
            console.log("stateChange from context", arguments);
        };
        this.context.oncomplete = function () {
            console.log("onComplete from context", arguments)
        };

        window.addEventListener("visibilitychange", (e) => {
            // console.log("visibility Change event", e);
            this.handleVisibilityChange()
        });
        //For safari
        let checkVisibility = () => {
            this.handleVisibilityChange();
            setTimeout(checkVisibility, 500);
        };
        checkVisibility();
    }

    isNotSuspended() {
        // return false;
        return this.context.state !== "suspended";
    }

    set(options, channel) {
        channel = Helper.nonNull(channel, SoundManager.CHANNELS.DEFAULT);
        let audioObject = Helper.nonNull(this.channels[channel], {});

        if (typeof options === "string") {
            options = {audio: options};
        }

        let audio = options.audio;
        if (Helper.isNotNull(audio)) {
            audioObject.loadedPromise = DataManager.loadAsset(audio, "raw").then(res => res.arrayBuffer()).then(arrayBuffer => {
                return new Promise((r, reject) => this.context.decodeAudioData(arrayBuffer, r));
            }).catch(e => console.error(e));
            // audioObject.loadedPromise = fetch(audio).then(res => res.arrayBuffer()).then(arrayBuffer => {
            //     return new Promise((r, reject) => this.context.decodeAudioData(arrayBuffer, r));
            // }).catch(e => console.error(e));
            this.stop(channel);
        }
        audioObject.muted = Helper.nonNull(options.muted, audioObject.muted, false);
        audioObject.volume = Helper.nonNull(options.volume, audioObject.volume, 1);
        audioObject.loop = Helper.nonNull(options.loop, audioObject.loop, false);
        audioObject.timeOffset = Helper.nonNull(options.timeOffset, audioObject.timeOffset, 0);
        this.channels[channel] = audioObject;

        if (audioObject.muted) {
            this.stop(channel);
        }

        return this.channels[channel];
    }

    async resumeContext() {
        if (typeof this.context.resume === "function") {
            return this.context.resume();
        }
    }

    async play(channel, audioOrOptions) {
        this.resumeContext();
        channel = Helper.nonNull(channel, SoundManager.CHANNELS.DEFAULT);
        if (Helper.isNull(audioOrOptions)) {
            audioOrOptions = {};
        } else if (!(typeof audioOrOptions === "object")) {
            audioOrOptions = {
                audio: audioOrOptions
            };
        }
        audioOrOptions.timeOffset = Helper.nonNull(audioOrOptions.timeOffset, 0);

        this.stop(channel);
        this.set(audioOrOptions, channel);

        if (!this.channels[channel].muted) {
            let buffer = await this.channels[channel].loadedPromise;
            let source = new AudioChain(this.context, buffer, (sourceNode) => {
                let gain = this.context.createGain();
                gain.gain.value = this.channels[channel].volume;

                sourceNode.connect(gain);
                gain.connect(this.context.destination);
            });

            source.setBuffer(buffer);

            //to prevent gap in mp3-files
            source.setLooping(this.channels[channel].loop, 0.3, buffer.duration - 0.3);

            this.channels[channel].source = source;
            await source.start();
        }
        return this.channels[channel];
    }

    stop(channel) {
        channel = Helper.nonNull(channel, SoundManager.CHANNELS.DEFAULT);


        let oldAudio = this.channels[channel];
        if (Helper.isNotNull(oldAudio) && Helper.isNotNull(oldAudio.source)) {
            oldAudio.source.stop();
        }
    }

    get(channel) {
        channel = Helper.nonNull(channel, SoundManager.CHANNELS.DEFAULT);
        return this.channels[channel];
    }

    async resume(channel) {
        channel = Helper.nonNull(channel, SoundManager.CHANNELS.DEFAULT);
        if (Helper.isNotNull(this.channels[channel]) && !this.channels[channel].muted && Helper.isNotNull(this.channels[channel].source)) {
            return this.channels[channel].source.resume();
        }
    }

    stopAll() {
        for (let k in this.channels) {
            if (Helper.isNotNull(this.channels[k].source)) {
                this.channels[k].source.stop();
            }
        }
    }

    resumeAllIfNotMuted() {
        for (let k in this.channels) {
            if (Helper.isNotNull(this.channels[k]) && !this.channels[k].muted && Helper.isNotNull(this.channels[k].source)) {
                this.channels[k].source.resume();
            }
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.stopAll();
        } else {
            this.resumeAllIfNotMuted();
        }
    }
}

App.addInitialization(app => {
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