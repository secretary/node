import {AdapterInterface, OptionsInterface, Secret, SecretValueType} from './';

export default abstract class implements AdapterInterface {
    /**
     * Fetch a single secret from the adapter
     */
    public abstract getSecret<V extends SecretValueType = SecretValueType>(
        key: string,
        options?: OptionsInterface,
    ): Promise<Secret<V>>;

    /**
     * Put a secret in the adapter
     */
    public abstract putSecret<V extends SecretValueType = SecretValueType>(
        secret: Secret<V>,
        options?: OptionsInterface,
    ): Promise<Secret<V>>;

    /**
     * Delete a secrets in the adapter
     */
    public abstract deleteSecret<V extends SecretValueType = SecretValueType>(
        secret: Secret<V>,
        options?: OptionsInterface,
    ): Promise<void>;
}
