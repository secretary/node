import {
    AbstractPathAdapter,
    PathOptionsInterface,
    PutMultiplePathOptionsInterface,
    PutSinglePathOptionsInterface,
    SecretWithPathInterface,
} from '@secretary/core';
import {readFile, writeFile} from 'fs';

import Configuration from './Configuration';

interface Secrets {
    [key: string]: string | Secrets;
}

export default class Adapter extends AbstractPathAdapter {
    private static updateValue(
        key: string,
        path: string,
        value: string,
        secrets: SecretWithPathInterface[],
    ): SecretWithPathInterface[] {
        const oldSecret = secrets.find((s) => s.key === key && s.path === path);
        if (oldSecret) {
            oldSecret.value = value;
        } else {
            secrets.push({key, path, value});
        }

        return secrets;
    }

    public constructor(protected readonly config: Configuration) {
        super(config);
    }

    public async getSecrets(options: PathOptionsInterface): Promise<SecretWithPathInterface[]> {
        return this.memoize<SecretWithPathInterface[]>(JSON.stringify(options), async () => {
            const secrets = await this.loadSecrets();

            return secrets.filter((secret) => secret.path === options.path);
        });
    }

    public async putSecret(options: PutSinglePathOptionsInterface): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const secrets = Adapter.updateValue(options.key, options.path, options.value, await this.loadSecrets());

            writeFile(this.config.file, Buffer.from(JSON.stringify(secrets, null, 4)), (err) => {
                if (err) {
                    return reject(err);
                }

                if (this.shouldCache()) {
                    this.cache.reset();
                }

                resolve();
            });
        });
    }

    public async putSecrets(options: PutMultiplePathOptionsInterface): Promise<void> {
        let secrets = await this.loadSecrets();
        for (const secret of options.secrets) {
            secrets = Adapter.updateValue(secret.key, secret.path, secret.value, secrets);
        }

        return new Promise(async (resolve, reject) => {
            writeFile(this.config.file, Buffer.from(JSON.stringify(secrets, null, 4)), (err) => {
                if (err) {
                    return reject(err);
                }

                if (this.shouldCache()) {
                    this.cache.reset();
                }

                resolve();
            });
        });
    }

    private async loadSecrets(): Promise<SecretWithPathInterface[]> {
        return new Promise((resolve, reject) => {
            readFile(this.config.file, (err, buffer) => {
                if (err) {
                    return reject(err);
                }

                resolve(JSON.parse(buffer.toString('utf8')));
            });
        });
    }
}
