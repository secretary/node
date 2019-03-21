import {Options} from 'lru-cache';

export default interface ConfigurationInterface {
    /**
     * Cache settings for caching paths
     */
    cache?: {enabled: boolean; } & Options<string, any>;
}
