import { DelegateSite } from "../Context/Delegate/DelegateSite";
export declare class MatomoDelegateSite extends DelegateSite {
    private static currentUrl;
    onStart(pauseArguments: any): Promise<void>;
    update(): void;
}
