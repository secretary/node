import 'source-map-support/register';

import {
    AdapterInterface,
    GetSecretOptionsInterface,
    OptionsInterface,
    PathOptionsInterface, PutMultipleOptionsInterface, PutMultiplePathOptionsInterface,
    PutSingleOptionsInterface,
    PutSinglePathOptionsInterface,
    SecretInterface,
} from './';

export default class Secretary<T extends AdapterInterface> {
    public constructor(private readonly adapter: T) {
    }

    public async getSecret(options: GetSecretOptionsInterface): Promise<SecretInterface> {
        return this.adapter.getSecret(options);
    }

    public async getSecrets(options: OptionsInterface | PathOptionsInterface): Promise<SecretInterface[]> {
        return this.adapter.getSecrets(options);
    }

    public async putSecret(options: PutSingleOptionsInterface | PutSinglePathOptionsInterface): Promise<void> {
        return this.adapter.putSecret(options);
    }

    public async putSecrets(options: PutMultipleOptionsInterface | PutMultiplePathOptionsInterface): Promise<void> {
        return this.adapter.putSecrets(options);
    }
}
