import 'source-map-support/register';

import {AbstractAdapter, InvalidKeyError, OptionsInterface, Secret, SecretNotFoundError} from './';

/**
 * Secrets Manager class.
 */
export default class Manager<T extends AbstractAdapter = AbstractAdapter> {
    /**
     * @param {AbstractAdapter} adapter
     */
    public constructor(public readonly adapter: T) {
    }

    /**
     * Fetch a secret by key. Certain adapters might also have custom options that you can specify.
     *
     * If the secret doesn't exist, a SecretNotFoundError will be thrown.
     * If the key is invalid, an InvalidKeyError will be thrown.
     *
     * @throws {InvalidKeyError} When the key is invalid.
     * @throws {SecretNotFoundError} When the secret cannot be found
     * @param {string} key
     * @param {OptionsInterface} options
     * @return {Promise<Secret>}
     */
    public async getSecret<S extends Secret>(key: string, options?: OptionsInterface): Promise<S> {
        return this.adapter.getSecret<S>(key, options);
    }

    /**
     * Add or Update a secret. Certain adapters might also have custom options that you can specify.
     *
     * If the does not exist in the adapter, it will add it.
     * If the secret already exists in the adapter, it will update it.
     * If the key is invalid, an InvalidKeyError will be thrown.
     *
     * @throws {InvalidKeyError} When the key is invalid.
     * @param {Secret} secret
     * @param {OptionsInterface} options
     * @return {Promise<Secret>}
     */
    public async putSecret<S extends Secret>(secret: S, options?: OptionsInterface): Promise<S> {
        return this.adapter.putSecret<S>(secret, options);
    }

    /**
     * Deletes a secret. Certain adapters might also have custom options that you can specify.
     *
     * If the secret doesn't exist, a SecretNotFoundError will be thrown.
     * If the key is invalid, an InvalidKeyError will be thrown.
     *
     * @throws {InvalidKeyError} When the key is invalid.
     * @throws {SecretNotFoundError} When the secret cannot be found
     * @param {Secret} secret
     * @param {OptionsInterface} options
     * @return {Promise<void>}
     */
    public async deleteSecret<S extends Secret>(secret: S, options?: OptionsInterface): Promise<void> {
        return this.adapter.deleteSecret(secret, options);
    }

    /**
     * Deletes a secret by its key. Certain adapters might also have custom options that you can specify.
     *
     * If the secret doesn't exist, a SecretNotFoundError will be thrown.
     * If the key is invalid, an InvalidKeyError will be thrown.
     *
     * @throws {InvalidKeyError} When the key is invalid.
     * @throws {SecretNotFoundError} When the secret cannot be found
     * @param {string} key
     * @param {OptionsInterface} options
     * @return {Promise<void>}
     */
    public async deleteSecretByKey(key: string, options?: OptionsInterface): Promise<void> {
        const secret = await this.getSecret(key, options);

        return this.adapter.deleteSecret(secret, options);
    }
}
