import {AbstractAdapter, OptionsInterface, Secret, SecretNotFoundError, SecretValueType} from '@secretary/core';
import {readFile, writeFile} from 'fs';

import Configuration from './Configuration';

interface Secrets {
    [key: string]: string | Secrets;
}

export default class Adapter extends AbstractAdapter {
    private static updateValue(
        key: string,
        value: SecretValueType,
        secrets: Secret[],
    ): Secret[] {
        const index = secrets.findIndex((s) => s.key === key);
        if (index >= 0) {
            secrets[index] = secrets[index].withValue(value);
        } else {
            secrets.push(new Secret(key, value));
        }

        return secrets;
    }

    public constructor(protected readonly config: Configuration) {
        super();
    }

    public async getSecret(key: string, _options?: OptionsInterface): Promise<Secret> {
        const secrets = await this.loadSecrets();

        const secret = secrets.find((s) => s.key === key);
        if (!secret) {
            throw new SecretNotFoundError(key);
        }

        return secret;
    }

    public async putSecret(secret: Secret, _options?: OptionsInterface): Promise<Secret> {
        const secrets = Adapter.updateValue(secret.key, secret.value, await this.loadSecrets());

        await this.saveSecrets(secrets);

        return secret;
    }

    public async deleteSecret(secret: Secret, _options?: OptionsInterface): Promise<void> {
        const secrets = await this.loadSecrets();

        const index = secrets.findIndex((s) => s.key === secret.key);
        if (index === -1) {
            throw new SecretNotFoundError(secret.key);
        }
        secrets.splice(index, 1);

        await this.saveSecrets(secrets);
    }

    private async loadSecrets(): Promise<Secret[]> {
        return new Promise((resolve, reject) => {
            readFile(this.config.file, (err, buffer) => {
                if (err) {
                    return reject(err);
                }

                const secrets = JSON.parse(buffer.toString('utf8'));

                resolve(secrets.map((s) => new Secret(s._key, s._value, s._metadata)));
            });
        });
    }

    private async saveSecrets(secrets: Secret[]): Promise<void> {
        return new Promise((resolve, reject) => {
            writeFile(
                this.config.file,
                Buffer.from(JSON.stringify(secrets, null, 4)),
                (err) => err ? reject(err) : resolve(),
            );
        });
    }
}
