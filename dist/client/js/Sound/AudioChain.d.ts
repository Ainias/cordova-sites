export declare class AudioChain {
    private _buffer;
    private _shouldLoop;
    private _loopStart;
    private _loopEnd;
    private _chainFunction;
    private _context;
    private _startTime;
    private _pauseTime;
    private _source;
    private _running;
    constructor(context: any, sourceBuffer: any, chainFunction: any);
    setBuffer(buffer: any): void;
    setLooping(shouldLoop: any, loopStart: any, loopEnd: any): void;
    start(delay?: any, offset?: any, duration?: any): Promise<void>;
    stop(delay: any): Promise<any>;
    resume(): Promise<void>;
}
