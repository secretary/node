import {OptionsInterface, Secret} from './';

export default interface AdapterInterface {
    /**
     * Fetch a single secret from the adapter
     */
    getSecret<S extends Secret>(key: string, options?: OptionsInterface): Promise<S>;

    /**
     * Put a secret in the adapter
     */
    putSecret<S extends Secret>(secret: S, options?: OptionsInterface): Promise<S>;

    /**
     * Delete a secrets in the adapter
     */
    deleteSecret<S extends Secret>(secret: S, options?: OptionsInterface): Promise<void>;
}
