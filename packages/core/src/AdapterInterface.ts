import {OptionsInterface, Secret, SecretValueType} from './';

export default interface AdapterInterface {
    /**
     * Fetch a single secret from the adapter
     */
    getSecret<V extends SecretValueType = SecretValueType>(key: string, options?: OptionsInterface): Promise<Secret<V>>;

    /**
     * Put a secret in the adapter
     */
    putSecret<V extends SecretValueType = SecretValueType>(secret: Secret<V>, options?: OptionsInterface): Promise<Secret<V>>;

    /**
     * Delete a secrets in the adapter
     */
    deleteSecret<V extends SecretValueType = SecretValueType>(secret: Secret<V>, options?: OptionsInterface): Promise<void>;
}
