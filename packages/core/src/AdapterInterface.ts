import {OptionsInterface, Secret} from './';

export default interface AdapterInterface {
    /**
     * Fetch a single secret from the adapter
     */
    getSecret(key: string, options?: OptionsInterface): Promise<Secret>;

    /**
     * Put a secret in the adapter
     */
    putSecret(secret: Secret, options?: OptionsInterface): Promise<Secret>;

    /**
     * Delete a secrets in the adapter
     */
    deleteSecret(secret: Secret, options?: OptionsInterface): Promise<void>;
}
