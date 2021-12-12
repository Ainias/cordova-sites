/**
 * Promise-Wrapper-Klasse für Native-Storage
 */
import { Helper } from 'js-helper/dist/shared/Helper';
import { JsonHelper } from 'js-helper/dist/shared/JsonHelper';
import { ArrayHelper, PromiseWithHandlers } from 'js-helper';
import { Sites } from './App/Sites';

declare const NativeStorage: any;

export class NativeStoragePromise {
    private static cache: Record<string, any> = {};
    static prefix = '';
    static persistent = true;
    static electronStorage: any = null;
    static readonly initializationPromise = new PromiseWithHandlers();

    private static isElectron() {
        return (
            typeof navigator === 'object' &&
            typeof navigator.userAgent === 'string' &&
            navigator.userAgent.indexOf('Electron') >= 0
        );
    }

    /**
     * Setzt ein Item für NativeStorage
     */
    static async setItem(key: string, value: number | string | Record<string, any>) {
        await this.initializationPromise;
        if (this.persistent) {
            if (this.isElectron()) {
                return new Promise<void>((res, rej) =>
                    this.electronStorage.set(this.prefix + key, value, (err: any) => {
                        if (err) {
                            rej(err);
                        } else {
                            res();
                        }
                    })
                );
            }
            return new Promise((res, rej) => NativeStorage.setItem(this.prefix + key, value, res, rej));
        }
        this.cache[this.prefix + key] = value;
        return Promise.resolve();
    }

    /**
     * Bekomme ein Item von NativeStorage
     */
    static async getItem<Type extends number | string | Record<string, unknown>>(
        key: string,
        defaultValue?: Type
    ): Promise<any> {
        await this.initializationPromise;
        return new Promise((res) => {
            if (this.isElectron()) {
                this.electronStorage.get(this.prefix + key, (e: any, data: Type) => {
                    if (e) {
                        res(Helper.nonNull(this.cache[this.prefix + key], defaultValue));
                    } else {
                        res(JsonHelper.deepEqual(data, {}) ? defaultValue : data);
                    }
                });
            } else {
                NativeStorage.getItem(
                    this.prefix + key,
                    (data: Type | undefined) => res(Helper.nonNull(data, defaultValue)),
                    () => {
                        res(Helper.nonNull(this.cache[this.prefix + key], defaultValue));
                    }
                );
            }
        });
    }

    /**
     * Bekomme die Keys vom NativeStorage
     *
     */
    static async getAllKeys() {
        await this.initializationPromise;
        let keys: string[];
        if (this.persistent) {
            if (this.isElectron()) {
                keys = await new Promise((res, rej) =>
                    this.electronStorage.keys((err: any, electronKeys: string[]) => {
                        if (err) {
                            rej(err);
                        } else {
                            res(electronKeys);
                        }
                    })
                );
            } else {
                keys = await new Promise((res, rej) => NativeStorage.keys(res, rej));
            }
        } else {
            keys = Object.keys(this.cache);
        }
        return keys.filter((key) => key.startsWith(this.prefix));
    }

    static async removeItem(key: string) {
        return this.remove(key);
    }

    /**
     * Entfernt ein Object aus dem NativeStorage
     *
     */
    static async remove(key: string) {
        await this.initializationPromise;
        delete this.cache[this.prefix + key];
        if (this.isElectron()) {
            return new Promise<void>((res, rej) =>
                this.electronStorage.remove(this.prefix + key, (err: any) => {
                    if (err) {
                        rej(err);
                    } else {
                        res();
                    }
                })
            );
        }
        return new Promise((res, rej) => NativeStorage.remove(this.prefix + key, res, rej));
    }

    /**
     * Entfernt alle Objects aus dem NativeStorage
     */
    static async clear() {
        await this.initializationPromise;
        const keys = await this.getAllKeys();
        await ArrayHelper.asyncForEach(
            keys,
            async (key) => {
                await this.remove(key);
            },
            true
        );
    }

    static async makePersistent() {
        await this.initializationPromise;
        if (!this.persistent) {
            this.persistent = true;
            await ArrayHelper.asyncForEach(
                Object.keys(this.cache),
                async (key) => {
                    await this.setItem(key, this.cache[key]);
                },
                true
            );
        }
    }

    static async makeUnpersistent() {
        await this.initializationPromise;
        if (this.persistent) {
            const keys = await this.getAllKeys();
            const values = {};
            await ArrayHelper.asyncForEach(keys, async (key) => {
                values[key] = await this.getItem(key);
            });
            await this.clear();
            this.persistent = false;
            this.cache = values;
        }
    }
}

Sites.addInitialization(() => NativeStoragePromise.initializationPromise.resolve());
