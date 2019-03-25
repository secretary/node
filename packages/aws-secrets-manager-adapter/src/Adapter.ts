import {AbstractPathAdapter, PathOptionsInterface, SecretWithPathInterface} from '@secretary/core';
import {SecretsManager} from 'aws-sdk';
import {CreateSecretRequest, UpdateSecretRequest} from 'aws-sdk/clients/secretsmanager';

import Configuration from './Configuration';
import {PutMultipleOptionsInterface, PutSingleOptionsInterface} from './PutOptionsInterface';

export default class Adapter extends AbstractPathAdapter {
    private readonly client: SecretsManager;

    public constructor(protected readonly config: Configuration) {
        super(config);

        this.client = config.client;
    }

    public getSecrets(options: PathOptionsInterface): Promise<SecretWithPathInterface[]> {
        return this.memoize<SecretWithPathInterface[]>(JSON.stringify(options), async () => {
            const params: SecretsManager.GetSecretValueRequest = {SecretId: options.path};
            if (this.config.versionId) {
                params.VersionId = this.config.versionId;
            }
            if (this.config.versionStage) {
                params.VersionStage = this.config.versionStage;
            }

            const data = await this.client.getSecretValue(params).promise();

            const secrets: { [key: string]: string } = JSON.parse(data['SecretString']);

            return Object.entries(secrets).map<SecretWithPathInterface>(([key, value]) => {
                return {key, value, path: options.path};
            });
        });
    }

    public async putSecret(options: PutSingleOptionsInterface): Promise<void> {
        const {key, value, path, ...requestOptions} = options;

        let existingSecret: SecretWithPathInterface[];
        let newSecret = false;
        try {
            existingSecret = await this.getSecrets({path});
        } catch (e) {
            newSecret = true;
        }

        if (newSecret) {
            const opts: CreateSecretRequest = {Name: path, SecretString: JSON.stringify({[key]: value})};
            if (requestOptions.Description) {
                opts.Description = requestOptions.Description;
            }
            if (requestOptions.Tags) {
                opts.Tags = requestOptions.Tags;
            }
            if (requestOptions.KmsKeyId) {
                opts.KmsKeyId = requestOptions.KmsKeyId;
            }

            await this.client.createSecret(opts);
        } else {
            const newValue: any = {};
            for (const secret of existingSecret) {
                newValue[secret.key] = secret.value;
            }
            newValue[key] = value;

            const opts: UpdateSecretRequest = {SecretId: path};
            if (requestOptions.Description) {
                opts.Description = requestOptions.Description;
            }
            if (requestOptions.KmsKeyId) {
                opts.KmsKeyId = requestOptions.KmsKeyId;
            }

            opts.SecretString = JSON.stringify(newValue);

            await this.client.updateSecret(opts);
        }

        if (this.shouldCache()) {
            this.cache.reset();
        }
    }

    /**
     * @todo Write this to do as few requests as possible (Lump up paths together)
     * @param options
     */
    public async putSecrets(options: PutMultipleOptionsInterface): Promise<void> {
        const {secrets, ...restOptions} = options;
        for (const secret of secrets) {
            await this.putSecret({...restOptions, ...secret});
        }
    }
}
