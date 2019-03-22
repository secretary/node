import {
    AbstractAdapter,
    GetSecretOptionsInterface,
    OptionsInterface,
    PutMultipleOptionsInterface,
    PutSingleOptionsInterface,
    SecretInterface,
} from '@secretary/core';
import Credstash from 'nodecredstash';

import Configuration from './Configuration';

interface GetAllSecretsOptions extends OptionsInterface {
    version?: number;
    context?: { [key: string]: string };
    startsWith?: string;
}

interface PutOptionsInterface extends PutSingleOptionsInterface {
    context?: { [key: string]: string };
    digest?: string;
    version?: number;
}

export default class Adapter extends AbstractAdapter {
    private client: Credstash;

    public constructor(protected readonly config: Configuration) {
        super(config);

        this.client = config.client;
    }

    public async getSecret(options: GetSecretOptionsInterface): Promise<SecretInterface> {
        return this.memoize<SecretInterface>(JSON.stringify(options), async () => {
            const {key, ...restOptions} = options;
            const result                = await this.client.getSecret({name: key, ...restOptions});

            return {key, value: result[key]};
        });
    }

    public getSecrets(options: GetAllSecretsOptions): Promise<SecretInterface[]> {
        return this.memoize<SecretInterface[]>(JSON.stringify(options), async () => {
            const result = await this.client.getAllSecrets(options);

            return Object.entries(result).map(([key, value]) => ({key, value}));
        });
    }

    public async putSecret(options: PutOptionsInterface): Promise<void> {
        const {key, value, ...restOptions} = options;

        // Interface on this is bad. Says context is required
        await this.client.putSecret({name: key, secret: value, ...restOptions} as any);
    }

    public async putSecrets(options: PutMultipleOptionsInterface): Promise<void> {
        for (const secret of options.secrets) {
            await this.putSecret(secret);
        }
    }
}
