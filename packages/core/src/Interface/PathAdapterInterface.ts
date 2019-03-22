import {
    AdapterInterface,
    KeyOptionsInterface,
    PathOptionsInterface,
    PutMultipleOptionsInterface,
    PutSingleOptionsInterface,
    SecretWithPathInterface,
} from './';

export default interface PathAdapterInterface extends AdapterInterface {
    /**
     * Regex used to validate path
     */
    pathRegex: RegExp;

    /**
     * Fetch a single secret from the adapter
     */
    getSecret(options: KeyOptionsInterface): Promise<SecretWithPathInterface>;

    /**
     * Fetch a path from the adapter
     */
    getSecrets(options: PathOptionsInterface): Promise<SecretWithPathInterface[]>;

    /**
     * Put a secret in the adapter
     */
    putSecret(options: PutSingleOptionsInterface): Promise<void>;

    /**
     * Put a group of secrets in the adapter
     */
    putSecrets(options: PutMultipleOptionsInterface): Promise<void>;
}
