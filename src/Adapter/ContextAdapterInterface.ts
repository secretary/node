import {PathResult, Result} from './';

export interface Context {
    [key: string]: string;
}

export default interface ContextAdapterInterface {
    /**
     * Fetch a single secret from the adapter
     * @param key
     * @param context
     */
    getSecret(key: string, context?: Context): Promise<Result>;

    /**
     * Fetch a path from the adapter
     * @param context
     */
    getContext(context: Context): Promise<PathResult>;
}
