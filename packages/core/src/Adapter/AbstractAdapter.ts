import * as LRUCache from 'lru-cache';

import {
    AdapterInterface,
    ConfigurationInterface,
    GetSecretOptionsInterface,
    OptionsInterface, PutMultipleOptionsInterface,
    PutSingleOptionsInterface,
    SecretInterface,
} from '../Interface';

type MemoizeType = SecretInterface | SecretInterface[];

export default abstract class AbstractAdapter implements AdapterInterface {
    protected cache?: LRUCache<string, any>;

    protected constructor(protected readonly config: ConfigurationInterface) {
        if (this.config.cache) {
            const {enabled, ...cacheOptions} = this.config.cache;
            if (enabled) {
                this.cache = new LRUCache<string, any>(cacheOptions);
            }
        }
    }

    public abstract getSecret(options: GetSecretOptionsInterface): Promise<SecretInterface>;

    public abstract getSecrets(options: OptionsInterface): Promise<SecretInterface[]>;

    public abstract putSecret(options: PutSingleOptionsInterface): Promise<void>;

    public abstract putSecrets(options: PutMultipleOptionsInterface): Promise<void>;

    protected async memoize<T extends MemoizeType>(key: string, callback: () => Promise<T>): Promise<T> {
        if (this.shouldCache() && this.cache.has(key)) {
            return this.cache.get(key);
        }

        const cachedValue = await callback();
        if (this.shouldCache()) {
            this.cache.set(key, cachedValue);
        }

        return cachedValue;
    }

    protected shouldCache(): boolean {
        return this.config.cache && this.config.cache.enabled;
    }
}
