import {AbstractAdapter, OptionsInterface, Secret, SecretNotFoundError, SecretValueType} from '@secretary/core';
import {KeyVaultClient} from 'azure-keyvault';
import msRestAzure from 'ms-rest-azure';

import Configuration from './Configuration';

export interface GetSecretOptions {
    version?: string;
}

export default class Adapter extends AbstractAdapter {
    public constructor(private readonly client: KeyVaultClient, private readonly vaultUri: string) {
        super();
    }

    public static async create(config: Configuration): Promise<Adapter> {
        return new Adapter(await Adapter.getClient(config), config.vaultUri);
    }

    private static async getClient(config: Configuration): Promise<KeyVaultClient> {
        const credentials = await msRestAzure.loginWithServicePrincipalSecret(
            config.clientId,
            config.clientSecret,
            config.domain,
        );

        return new KeyVaultClient(credentials);
    }

    public async getSecret<V extends SecretValueType = SecretValueType>(
        key: string,
        options: GetSecretOptions = {},
    ): Promise<Secret<V>> {
        try {
            const bundle = await this.client.getSecret(this.vaultUri, key, options.version || '');
            const {id, value, ...metadata} = bundle;

            let secretValue: V = value as V;
            try {
                secretValue = JSON.parse(value) as V;
            } finally {
                return new Secret<V>(key, secretValue, metadata);
            }
        } catch (e) {
            throw new SecretNotFoundError(key);
        }
    }

    public async putSecret<V extends SecretValueType = SecretValueType>(
        secret: Secret<V>,
        options: OptionsInterface = {},
    ): Promise<Secret<V>> {
        const secretValue = typeof secret.value === 'string' ? secret.value : JSON.stringify(secret.value);

        const bundle = await this.client.setSecret(this.vaultUri, secret.key, secretValue, options);
        const {id, value, ...metadata} = bundle;

        return secret.withMetadata(metadata);
    }

    public async deleteSecret<V extends SecretValueType = any>(
        secret: Secret<V>,
        options: OptionsInterface = {},
    ): Promise<void> {
        try {
            await this.client.deleteSecret(this.vaultUri, secret.key, options);
        } catch (e) {
            throw new SecretNotFoundError(secret.key);
        }
    }
}
