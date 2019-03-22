import {
    AbstractPathAdapter,
    PathOptionsInterface,
    PutMultiplePathOptionsInterface,
    PutSinglePathOptionsInterface,
    SecretWithPathInterface,
} from '@secretary/core';
import * as nodeVault from 'node-vault';

import Configuration, {AppRoleOptions} from './Configuration';

export default class Adapter extends AbstractPathAdapter {
    private client: nodeVault.client;

    private loggedIn: boolean = false;

    private readonly appRole?: AppRoleOptions;

    private readonly secretPath: string;

    public constructor(protected readonly config: Configuration) {
        super(config);

        const {appRole, secretPath} = config;
        this.client                 = config.client;
        this.appRole                = appRole;
        if (!appRole) {
            this.loggedIn = true;
        }

        this.secretPath = secretPath || 'secret';
    }

    public async getSecrets(options: PathOptionsInterface): Promise<SecretWithPathInterface[]> {
        return this.memoize<SecretWithPathInterface[]>(JSON.stringify(options), async () => {
            await this.logIn();

            const result = await this.client.read(`${this.secretPath}/${options.path}`);

            return Object.entries(result.data).map(([key, value]) => {
                return {
                    key,
                    value: value as string,
                    path:  options.path,
                };
            });
        });
    }

    public async putSecret(options: PutSinglePathOptionsInterface): Promise<void> {
        await this.logIn();
        let existingSecrets: SecretWithPathInterface[] = [];
        try {
            existingSecrets = await this.getSecrets({path: options.path});
        } catch (_) {
        }

        existingSecrets.push(options);
        const data: { [key: string]: string } = {};
        for (const secret of existingSecrets) {
            data[secret.key] = secret.value;
        }

        await this.client.write(`${this.secretPath}/${options.path}`, data);

        if (this.shouldCache()) {
            this.cache.reset();
        }
    }

    /**
     * @todo Optimize to only run as many requests are needed
     * @param options
     */
    public async putSecrets(options: PutMultiplePathOptionsInterface): Promise<void> {
        for (const secret of options.secrets) {
            await this.putSecret(secret);
        }
    }

    private async logIn(): Promise<void> {
        if (!this.loggedIn && this.appRole) {
            await this.client.approleLogin(this.appRole);
        }

        this.loggedIn = true;
    }
}
