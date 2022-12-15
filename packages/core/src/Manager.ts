import 'source-map-support/register';

import {AbstractAdapter, OptionsInterface, Secret, SecretValueType} from './';

/**
 * Secrets Manager class.
 */
export default class Manager {
    public constructor(private adapters: Record<string, AbstractAdapter> = {}) {
    }

    private get default(): AbstractAdapter {
        const keys = Object.keys(this.adapters);
        if (keys.length < 1) {
            return undefined;
        }

        return this.adapters.default || this.adapters[keys[0]];
    }

    public getAdapter(name: string): AbstractAdapter {
        return this.adapters[name];
    }

    public getDefaultAdapter(): AbstractAdapter {
        return this.default;
    }

    public addAdapter(name: string, adapter: AbstractAdapter): this {
        if (this.adapters[name]) {
            throw new Error('Adapter with that name already exists');
        }

        this.adapters[name] = adapter;

        return this;
    }

    public removeAdapter(name: string): this {
        if (!this.adapters[name]) {
            throw new Error('Adapter with that name does not exist.');
        }

        delete this.adapters[name];

        return this;
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
     * @param {string} source
     * @param {OptionsInterface} options
     * @return {Promise<Secret>}
     */
    public async getSecret<V extends SecretValueType = SecretValueType>(
        key: string,
        source: string = 'default',
        options?: OptionsInterface,
    ): Promise<Secret<V>> {
        return this.adapters[source].getSecret<V>(key, options);
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
     * @param {string} source
     * @param {OptionsInterface} options
     * @return {Promise<Secret>}
     */
    public async putSecret<V extends SecretValueType = SecretValueType>(
        secret: Secret<V>,
        source: string = 'default',
        options?: OptionsInterface,
    ): Promise<Secret<V>> {
        return this.adapters[source].putSecret<V>(secret, options);
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
     * @param {string} source
     * @param {OptionsInterface} options
     * @return {Promise<void>}
     */
    public async deleteSecret<V extends SecretValueType = SecretValueType>(
        secret: Secret<V>,
        source: string = 'default',
        options?: OptionsInterface,
    ): Promise<void> {
        return this.adapters[source].deleteSecret(secret, options);
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
     * @param {string} source
     * @param {OptionsInterface} options
     * @return {Promise<void>}
     */
    public async deleteSecretByKey(key: string, source: string = 'default', options?: OptionsInterface): Promise<void> {
        const secret = await this.getSecret(key, source, options);

        return this.adapters[source].deleteSecret(secret, options);
    }
}
