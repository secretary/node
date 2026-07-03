import {
    DeleteParameterRequest,
    GetParameterRequest,
    PutParameterRequest,
    SSM,
} from '@aws-sdk/client-ssm';
import {AbstractAdapter, Secret, SecretNotFoundError, SecretValueType} from '@secretary/core';

export type GetSecretOptions = Omit<GetParameterRequest, 'Name'>;

export type PutSecretOptions = Omit<PutParameterRequest, 'Name' | 'Value'>;

export type DeleteSecretOptions = Omit<DeleteParameterRequest, 'Name'>;

const isNotFound = (e: unknown): boolean =>
    (e as Record<string, unknown>)?.name === 'ParameterNotFound' || (e as Record<string, unknown>)?.__type === 'ParameterNotFound';

export default class Adapter extends AbstractAdapter {
    public constructor(private readonly client: SSM) {
        super();
    }

    public async getSecret<V extends SecretValueType = SecretValueType>(
        key: string,
        options: GetSecretOptions = {},
    ): Promise<Secret<V>> {
        const params: GetParameterRequest = {Name: key, WithDecryption: true, ...options};

        try {
            const data = await this.client.getParameter(params);
            const value = data.Parameter?.Value;

            let secretValue: V = value as V;
            try {
                secretValue = JSON.parse(value) as V;
            } finally {
                return new Secret<V>(key, secretValue);
            }
        } catch (e) {
            if (isNotFound(e)) {
                throw new SecretNotFoundError(key);
            }

            throw e;
        }
    }

    public async putSecret<V extends SecretValueType = SecretValueType>(
        secret: Secret<V>,
        options: PutSecretOptions = {},
    ): Promise<Secret<V>> {
        const params: PutParameterRequest = {
            Name:      secret.key,
            Value:     typeof secret.value === 'string' ? secret.value : JSON.stringify(secret.value),
            Type:      'SecureString',
            Overwrite: true,
            ...options,
        };

        const response = await this.client.putParameter(params);

        return secret.withMetadata(response.$metadata);
    }

    public async deleteSecret<V extends SecretValueType = SecretValueType>(
        secret: Secret<V>,
        options: DeleteSecretOptions = {},
    ): Promise<void> {
        try {
            await this.client.deleteParameter({...options, Name: secret.key});
        } catch (e) {
            if (isNotFound(e)) {
                throw new SecretNotFoundError(secret.key);
            }

            throw e;
        }
    }
}
