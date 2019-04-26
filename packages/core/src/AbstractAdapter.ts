import {AdapterInterface, OptionsInterface, Secret} from './';

export default abstract class implements AdapterInterface {
    /**
     * Fetch a single secret from the adapter
     */
    public abstract getSecret(key: string, options?: OptionsInterface): Promise<Secret>;

    /**
     * Put a secret in the adapter
     */
    public abstract putSecret(secret: Secret, options?: OptionsInterface): Promise<Secret>;

    /**
     * Delete a secrets in the adapter
     */
    public abstract deleteSecret(secret: Secret, options?: OptionsInterface): Promise<void>;
}
