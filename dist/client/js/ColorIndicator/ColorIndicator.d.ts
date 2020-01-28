import { Singleton } from "../Singleton";
export declare class ColorIndicator extends Singleton {
    getAverageImgColor(imgEl: any, areaWidth: any, areaHeight: any): {
        r: number;
        g: number;
        b: number;
    };
    invertColorBW(r: any, g: any, b: any): {
        r: any;
        g: any;
        b: any;
    };
    invertColor(r: any, g: any, b: any, bw: any): {
        r: any;
        g: any;
        b: any;
    };
    toHEX(r: any, g: any, b: any): string;
}
