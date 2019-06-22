import {AdapterInterface, OptionsInterface, Secret} from './';

export default abstract class implements AdapterInterface {
    /**
     * Fetch a single secret from the adapter
     */
    public abstract getSecret<S extends Secret>(key: string, options?: OptionsInterface): Promise<S>;

    /**
     * Put a secret in the adapter
     */
    public abstract putSecret<S extends Secret>(secret: S, options?: OptionsInterface): Promise<S>;

    /**
     * Delete a secrets in the adapter
     */
    public abstract deleteSecret<S extends Secret>(secret: S, options?: OptionsInterface): Promise<void>;
}
