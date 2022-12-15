import {readFile, writeFile} from 'fs';

import {AbstractAdapter, OptionsInterface, Secret, SecretNotFoundError, SecretValueType} from '@secretary/core';

import Configuration from './Configuration';

export default class Adapter extends AbstractAdapter {
    public constructor(protected readonly config: Configuration) {
        super();
    }

    private static updateValue<V extends SecretValueType = SecretValueType>(
        key: string,
        value: SecretValueType,
        secrets: Array<Secret<V>>,
    ): Array<Secret<V>> {
        const index = secrets.findIndex((s) => s.key === key);
        if (index >= 0) {
            secrets[index] = secrets[index].withValue(value as V);
        } else {
            secrets.push(new Secret<V>(key, value as V));
        }

        return secrets;
    }

    public async getSecret<V extends SecretValueType = SecretValueType>(
        key: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _options?: OptionsInterface,
    ): Promise<Secret<V>> {
        const secrets = await this.loadSecrets<V>();

        const secret = secrets.find((s) => s.key === key);
        if (!secret) {
            throw new SecretNotFoundError(key);
        }

        return secret;
    }

    public async putSecret<V extends SecretValueType = SecretValueType>(
        secret: Secret<V>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _options?: OptionsInterface,
    ): Promise<Secret<V>> {
        const secrets = Adapter.updateValue(secret.key, secret.value, await this.loadSecrets<V>());

        await this.saveSecrets(secrets);

        return secret;
    }

    public async deleteSecret<V extends SecretValueType = SecretValueType>(
        secret: Secret<V>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _options?: OptionsInterface,
    ): Promise<void> {
        const secrets = await this.loadSecrets<V>();

        const index = secrets.findIndex((s) => s.key === secret.key);
        if (index === -1) {
            throw new SecretNotFoundError(secret.key);
        }
        secrets.splice(index, 1);

        await this.saveSecrets(secrets);
    }

    private async loadSecrets<V extends SecretValueType = SecretValueType>(): Promise<Array<Secret<V>>> {
        return new Promise((resolve, reject) => {
            readFile(this.config.file, (err, buffer) => {
                if (err) {
                    return reject(err);
                }

                const secrets = JSON.parse(buffer.toString('utf8')) as Secret<V>[];

                resolve(secrets.map((s) => new Secret<V>(s.key, s.value, s.metadata)));
            });
        });
    }

    private async saveSecrets<V extends SecretValueType = SecretValueType>(secrets: Array<Secret<V>>): Promise<void> {
        return new Promise((resolve, reject) => {
            writeFile(
                this.config.file,
                Buffer.from(JSON.stringify(secrets, null, 4)),
                (err) => err ? reject(err) : resolve(),
            );
        });
    }
}
