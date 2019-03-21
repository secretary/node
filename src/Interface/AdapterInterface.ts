import {
    GetSecretOptionsInterface,
    OptionsInterface,
    PutMultipleOptionsInterface,
    PutSingleOptionsInterface,
    SecretInterface,
} from './';

export default interface AdapterInterface {
    /**
     * Fetch a single secret from the adapter
     */
    getSecret(options: GetSecretOptionsInterface): Promise<SecretInterface>;

    /**
     * Fetch a path from the adapter
     */
    getSecrets(options: OptionsInterface): Promise<SecretInterface[]>;

    /**
     * Put a secret in the adapter
     */
    putSecret(options: PutSingleOptionsInterface): Promise<void>;

    /**
     * Put a group of secrets in the adapter
     */
    putSecrets(options: PutMultipleOptionsInterface): Promise<void>;
}
