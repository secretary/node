import {AbstractAdapter, OptionsInterface, Secret, SecretNotFoundError, SecretValueType} from '@secretary/core';
import {KeyVaultClient} from 'azure-keyvault';
import msRestAzure from 'ms-rest-azure';

import Configuration from './Configuration';

export default class Adapter extends AbstractAdapter {
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

    public constructor(private readonly client: KeyVaultClient, private readonly vaultUri: string) {
        super();
    }

    public async getSecret<V extends SecretValueType = any>(
        key: string,
        options: OptionsInterface = {},
    ): Promise<Secret<V>> {
        try {
            const bundle                   = await this.client.getSecret(this.vaultUri, key, options.version || '');
            const {id, value, ...metadata} = bundle;

            const secret = new Secret<V>(key, '' as V, metadata as any);
            try {
                return secret.withValue(JSON.parse(value));
            } catch (e) {
                return secret.withValue(value);
            }
        } catch (e) {
            throw new SecretNotFoundError(key);
        }
    }

    public async putSecret<V extends SecretValueType = any>(
        secret: Secret<V>,
        options: OptionsInterface = {},
    ): Promise<Secret<V>> {
        const secretValue = typeof secret.value === 'string' ? secret.value : JSON.stringify(secret.value);

        const bundle                   = await this.client.setSecret(this.vaultUri, secret.key, secretValue, options);
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
