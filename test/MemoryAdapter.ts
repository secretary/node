import {
    AbstractAdapter,
    GetSecretOptionsInterface,
    OptionsInterface,
    PutMultipleOptionsInterface,
    PutSingleOptionsInterface,
    SecretInterface,
} from '../src';

export default class MemoryAdapter extends AbstractAdapter {
    public constructor(private readonly secrets: SecretInterface[]) {
        super({cache: {enabled: true}});
    }

    public async getSecret(options: GetSecretOptionsInterface): Promise<SecretInterface> {
        return this.secrets.find((secret) => secret.key === options.key);
    }

    public async getSecrets(options: OptionsInterface): Promise<SecretInterface[]> {
        return this.secrets.filter((secret) => secret.key === options.key);
    }

    public async putSecret(options: PutSingleOptionsInterface): Promise<void> {
        this.secrets.push(options);
    }

    public async putSecrets(options: PutMultipleOptionsInterface): Promise<void> {
        this.secrets.push(...options.secrets);
    }
}
