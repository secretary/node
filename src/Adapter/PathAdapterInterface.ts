import {PathResult, Result} from './';

export default interface PathAdapterInterface {
    /**
     * Regex used to validate path
     */
    pathRegex: RegExp;

    /**
     * Fetch a single secret from the adapter
     * @param key
     * @param path
     */
    getSecret(key: string, path: string): Promise<Result>;

    /**
     * Fetch a path from the adapter
     * @param path
     */
    getPath(path: string): Promise<PathResult>;
}
