export declare class ScaleHelper {
    scaleTo(scale: any, fontElement: any, container: any, ignoreHeight: any, ignoreWidth: any, margin: any, fontWeight: any, animationDelay: any, addListener: any): Promise<() => Promise<unknown>>;
    scaleToFull(fontElement: any, container: any, ignoreHeight: any, ignoreWidth: any, margin: any, fontWeight: any, animDelay: any, addListener: any): Promise<() => Promise<unknown>>;
    _getNewFontSize(scale: any, fontElement: any, container: any, ignoreHeight: any, ignoreWidth: any, margin: any, fontWeight: any, setFontSize: any): Promise<number>;
}
