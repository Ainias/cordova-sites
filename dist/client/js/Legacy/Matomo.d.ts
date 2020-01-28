export declare class Matomo {
    static LOCAL_STORAGE_KEY: string;
    static TRACK_SITE: string;
    static BASE_PATH: string;
    static SIDE_ID: string;
    static currentUrl: any;
    static isTrackingPromise: any;
    static init(): void;
    static update(title: any): void;
    static _askIsTracking(): Promise<any>;
    static query(method: any): Promise<Document>;
    static getTrackingPromise(): any;
    static setTrack(shouldTrack: any): Promise<void>;
    static trackEvent(event: any, name: any, label: any, value: any): Promise<void>;
    static push(arr: any, force?: any): Promise<void>;
}
