import {AbstractAdapter, OptionsInterface, Secret, SecretNotFoundError, SecretValueType} from '@secretary/core';
import * as nodeVault from 'node-vault';

import Configuration, {AppRoleOptions} from './Configuration';

export default class Adapter extends AbstractAdapter {
    private client: nodeVault.client;

    private readonly appRole?: AppRoleOptions;

    private readonly secretPath: string;

    public constructor(config: Configuration) {
        super();

        const {appRole, secretPath} = config;
        this.client                 = config.client;
        this.appRole                = appRole;

        this.secretPath = secretPath || 'secret';
    }

    public async getSecret<V extends SecretValueType = any>(
        key: string,
        options: OptionsInterface = {},
    ): Promise<Secret<V>> {
        await this.logIn();

        try {
            const result              = await this.client.read(`${this.secretPath}/${key}`, options);
            const {data, ...metadata} = result;

            return new Secret(key, data as V, metadata);
        } catch (e) {
            throw new SecretNotFoundError(key);
        }
    }

    public async putSecret<V extends SecretValueType = any>(
        secret: Secret<V>,
        options: OptionsInterface = {},
    ): Promise<Secret<V>> {
        await this.logIn();

        const newData: any = typeof secret.value !== 'string' ? JSON.stringify(secret.value) : secret.value;

        const result              = await this.client.write(`${this.secretPath}/${secret.key}`, newData, options);
        const {data, ...metadata} = result;

        return secret.withMetadata(metadata);
    }

    public async deleteSecret<V extends SecretValueType = any>(
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
            await this.client.approleLogin(this.appRole);
        }
    }
}
