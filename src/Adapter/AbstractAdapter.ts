import * as LRUCache from 'lru-cache';

import {ConfigurationInterface} from './';

export type Result = string;
export interface PathResult {
    [key: string]: string;
}

export default abstract class AbstractAdapter {
    protected cache?: LRUCache<string, any>;

    protected constructor(protected readonly config: ConfigurationInterface) {
        if (this.shouldCache()) {
            const {enabled, ...cacheOptions} = this.config.cache;
            this.cache                       = new LRUCache<string, any>(cacheOptions);
        }
    }

    protected async memoize<T extends PathResult | Result>(key: string, callback: () => Promise<T>): Promise<T> {
        if (this.shouldCache() && this.cache.has(key)) {
            return this.cache.get(key);
        }

        const cachedValue = await callback();
        if (this.shouldCache()) {
            this.cache.set(key, cachedValue);
        }

        return cachedValue;
    }

    private shouldCache(): boolean {
        return this.config.cache && this.config.cache.enabled;
    }
}
