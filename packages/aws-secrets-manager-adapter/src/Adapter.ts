import {AbstractAdapter, OptionsInterface, Secret, SecretNotFoundError} from '@secretary/core';
import {SecretsManager} from 'aws-sdk';
import {CreateSecretRequest, UpdateSecretRequest} from 'aws-sdk/clients/secretsmanager';

export default class Adapter extends AbstractAdapter {
    public constructor(private readonly client: SecretsManager) {
        super();
    }

    public async getSecret<S extends Secret>(key: string, options: OptionsInterface = {}): Promise<S> {
        const params: SecretsManager.GetSecretValueRequest = {SecretId: key};
        if (options.versionId) {
            params.VersionId = options.versionId;
        }
        if (options.versionStage) {
            params.VersionStage = options.versionStage;
        }

        try {
            const data                        = await this.client.getSecretValue(params).promise();
            const {SecretString, ...metadata} = data;

            const secret: Secret = new Secret(key, '', metadata as any);
            try {
                return secret.withValue(JSON.parse(SecretString)) as S;
            } catch (e) {
                return secret.withValue(SecretString) as S;
            }
        } catch (e) {
            if (e.code === 'ResourceNotFoundException') {
                throw new SecretNotFoundError(key);
            }

            throw e;
        }
    }

    public async putSecret<S extends Secret>(secret: S, options: OptionsInterface = {}): Promise<S> {
        options.SecretString = typeof secret.value === 'string' ? secret.value : JSON.stringify(secret.value);

        try {
            options.SecretId = secret.key;
            const {Tags, ...params} = options;

            let response = await this.client.updateSecret(params as UpdateSecretRequest).promise();
            if (Tags !== undefined) {
                const tagResponse = await this.client.tagResource({SecretId: secret.key, Tags}).promise();
                response = {...response, ...tagResponse};
            }

            return secret.withMetadata(response) as S;
        } catch (e) {
            options.Name = secret.key;
            delete options.SecretId;

            const response = await this.client.createSecret(options as CreateSecretRequest).promise();

            return secret.withMetadata(response) as S;
        }
    }

    public async deleteSecret<S extends Secret>(secret: S, options: OptionsInterface = {}): Promise<void> {
        try {
            await this.client.deleteSecret({...options, SecretId: secret.key}).promise();
        } catch (e) {
            throw new SecretNotFoundError(secret.key);
        }
    }
}
