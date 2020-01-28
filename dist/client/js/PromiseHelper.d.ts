export declare class PromiseHelper {
    static delay(milliseconds: any): Promise<unknown>;
    static tryMultipleTimes(func: any, times: any, delay: any): Promise<any>;
    static tryUntilTimeout(func: any, timeout: any, delay: any): Promise<unknown>;
}
