import {AbstractAdapter, OptionsInterface, Secret, SecretNotFoundError, SecretValueType} from '@secretary/core';
import * as nodeVault from 'node-vault';

import Configuration, {AppRoleOptions} from './Configuration';

interface ReadResponse<V extends SecretValueType> {
    data: V;
}

export default class Adapter extends AbstractAdapter {
    private client: nodeVault.client;

    private readonly appRole?: AppRoleOptions;

    private readonly secretPath: string;

    public constructor(config: Configuration) {
        super();

        const {appRole, secretPath} = config;
        this.client = config.client;
        this.appRole = appRole;

        this.secretPath = secretPath || 'secret';
    }

    public async getSecret<V extends SecretValueType = SecretValueType>(
        key: string,
        options: OptionsInterface = {},
    ): Promise<Secret<V>> {
        await this.logIn();

        try {
            const result = await this.client.read(`${this.secretPath}/${key}`, options) as ReadResponse<V>;
            const {data, ...metadata} = result;

            return new Secret<V>(key, data, metadata);
        } catch (e) {
            throw new SecretNotFoundError(key);
        }
    }

    public async putSecret<V extends SecretValueType = SecretValueType>(
        secret: Secret<V>,
        options: OptionsInterface = {},
    ): Promise<Secret<V>> {
        await this.logIn();
        const newData = typeof secret.value !== 'string' ? JSON.stringify(secret.value) : secret.value;

        const result = await this.client.write(`${this.secretPath}/${secret.key}`, newData, options) as ReadResponse<V>;
        const {data, ...metadata} = result;

        return secret.withMetadata(metadata);
    }

    public async deleteSecret<V extends SecretValueType = SecretValueType>(
        secret: Secret<V>,
        options: OptionsInterface = {},
    ): Promise<void> {
        await this.logIn();

        try {
            await this.client.delete(`${this.secretPath}/${secret.key}`, options);
        } catch (e) {
            throw new SecretNotFoundError(secret.key);
        }
    }

    /**
	 * @todo Only login when necessary
	 */
    private async logIn(): Promise<void> {
        if (this.appRole) {
            await this.client.approleLogin({role_id: this.appRole.roleId, secret_id: this.appRole.secretId});
        }
    }
}
