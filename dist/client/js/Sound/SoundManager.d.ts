export declare class SoundManager {
    private static _instance;
    private static CHANNELS;
    private channels;
    private context;
    static getInstance(): SoundManager;
    constructor();
    isNotSuspended(): boolean;
    set(options: any, channel: any): any;
    resumeContext(): Promise<any>;
    play(channel: any, audioOrOptions: any): Promise<any>;
    stop(channel: any): void;
    get(channel: any): any;
    resume(channel: any): Promise<any>;
    stopAll(): void;
    resumeAllIfNotMuted(): void;
    handleVisibilityChange(): void;
}
