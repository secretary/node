import {
    CreateSecretRequest,
    GetSecretValueRequest,
    SecretsManager,
    UpdateSecretRequest,
} from '@aws-sdk/client-secrets-manager';
import {AbstractAdapter, OptionsInterface, Secret, SecretNotFoundError, SecretValueType} from '@secretary/core';

export interface GetSecretOptions {
    versionId?: string;
    versionStage?: string;
}

export type PutSecretOptions = UpdateSecretRequest & CreateSecretRequest;

export default class Adapter extends AbstractAdapter {
    public constructor(private readonly client: SecretsManager) {
        super();
    }

    public async getSecret<V extends SecretValueType = SecretValueType>(
        key: string,
        options: GetSecretOptions = {},
    ): Promise<Secret<V>> {
        const params: GetSecretValueRequest = {SecretId: key};
        if (options.versionId) {
            params.VersionId = options.versionId;
        }
        if (options.versionStage) {
            params.VersionStage = options.versionStage;
        }

        try {
            const data = await this.client.getSecretValue(params);
            const {SecretString, ...metadata} = data;

            let secretValue: V = SecretString as V;
            try {
                secretValue = JSON.parse(SecretString) as V;
            } finally {
                return new Secret<V>(key, secretValue, metadata);
            }
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (e.code === 'ResourceNotFoundException') {
                throw new SecretNotFoundError(key);
            }

            throw e;
        }
    }

    public async putSecret<V extends SecretValueType = SecretValueType>(
        secret: Secret<V>,
        options: Omit<PutSecretOptions, 'SecretString' | 'SecretId' | 'Name'> = {},
    ): Promise<Secret<V>> {
        const opts: PutSecretOptions = {
            SecretString: typeof secret.value === 'string' ? secret.value : JSON.stringify(secret.value),
            SecretId:     secret.key,
            Name:         secret.key,
            ...options,
        };

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {Name, Tags, ...params} = opts;

            let response = await this.client.updateSecret(params as UpdateSecretRequest);
            if (Tags !== undefined) {
                const tagResponse = await this.client.tagResource({SecretId: secret.key, Tags});
                response = {...response, ...tagResponse};
            }

            return secret.withMetadata(response.$metadata);
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {SecretId, ...params} = opts;

            const response = await this.client.createSecret(params as CreateSecretRequest);

            return secret.withMetadata(response.$metadata);
        }
    }

    public async deleteSecret<V extends SecretValueType = SecretValueType>(
        secret: Secret<V>,
        options: OptionsInterface = {},
    ): Promise<void> {
        try {
            await this.client.deleteSecret({...options, SecretId: secret.key});
        } catch (e) {
            throw new SecretNotFoundError(secret.key);
        }
    }
}
