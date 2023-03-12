/* eslint-disable-rule @typescript-eslint/no-unsafe-assignment @typescript-eslint/no-unsafe-member-access @typescript-eslint/no-unsafe-call */
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        super();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const {appRole, secretPath} = config;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.client = config.client;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.appRole = appRole;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.secretPath = secretPath || 'secret';
    }

    public async getSecret<V extends SecretValueType = SecretValueType>(
        key: string,
        options: OptionsInterface = {},
    ): Promise<Secret<V>> {
        await this.logIn();

        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            const result = await this.client.read(`${this.secretPath}/${key}`, options) as ReadResponse<V>;
            const {data, ...metadata} = result;

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call
            return new Secret<V>(key, data, metadata);
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            throw new SecretNotFoundError(key);
        }
    }

    public async putSecret<V extends SecretValueType = SecretValueType>(
        secret: Secret<V>,
        options: OptionsInterface = {},
    ): Promise<Secret<V>> {
        await this.logIn();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        const newData = typeof secret.value !== 'string' ? JSON.stringify(secret.value) : secret.value;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
        const result = await this.client.write(`${this.secretPath}/${secret.key}`, newData, options) as ReadResponse<V>;
        const {data, ...metadata} = result;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
        return secret.withMetadata(metadata);
    }

    public async deleteSecret<V extends SecretValueType = SecretValueType>(
        secret: Secret<V>,
        options: OptionsInterface = {},
    ): Promise<void> {
        await this.logIn();

        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
            await this.client.delete(`${this.secretPath}/${secret.key}`, options);
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            throw new SecretNotFoundError(secret.key);
        }
    }

    /**
	 * @todo Only login when necessary
	 */
    private async logIn(): Promise<void> {
        if (this.appRole) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
            await this.client.approleLogin({role_id: this.appRole.roleId, secret_id: this.appRole.secretId});
        }
    }
}
