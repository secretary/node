import {
    AbstractPathAdapter,
    PathOptionsInterface,
    PutMultiplePathOptionsInterface,
    PutSinglePathOptionsInterface,
    SecretWithPathInterface,
} from '../src';

export default class MemoryPathAdapter extends AbstractPathAdapter {
    public constructor(private readonly secrets: SecretWithPathInterface[]) {
        super({cache: {enabled: true}});
    }

    public async getSecrets(options: PathOptionsInterface): Promise<SecretWithPathInterface[]> {
        this.denyIfInvalidPath(options.path);

        return this.secrets.filter((secret) => secret.path === options.path);
    }

    public async putSecret(options: PutSinglePathOptionsInterface): Promise<void> {
        this.secrets.push(options);
    }

    public async putSecrets(options: PutMultiplePathOptionsInterface): Promise<void> {
        this.secrets.push(...options.secrets);
    }
}
