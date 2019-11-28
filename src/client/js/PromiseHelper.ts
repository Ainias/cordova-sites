import {Helper} from "./Legacy/Helper";

export class PromiseHelper{
    static async delay(milliseconds){
        return new Promise(r => {
            setTimeout(r, milliseconds);
        })
    }

    static async tryMultipleTimes(func, times, delay){
        times = Helper.nonNull(times, 5);
        delay = Helper.nonNull(delay, 50);

        for(let i = 0; i < times; i++){
            let res = await func();
            if (res !== undefined){
                return res;
            }
            else {
                await PromiseHelper.delay(delay);
            }
        }
        return undefined;
    }

    static async tryUntilTimeout(func, timeout, delay){
        timeout = Helper.nonNull(timeout, 500);
        delay = Helper.nonNull(delay, 50);

        return new Promise(async (resolve, reject) => {
            let shouldRun = true;
            PromiseHelper.delay(timeout).then(() => {
                reject(new Error("timeout"));
                shouldRun = false;
            });

            while(shouldRun){
                let res = await func();
                if (res !== undefined){
                    resolve(res);
                    break;
                }
                await PromiseHelper.delay(delay);
            }
        });
    }
}