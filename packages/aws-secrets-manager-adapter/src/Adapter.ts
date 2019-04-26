import {AdapterInterface, OptionsInterface, Secret} from '@secretary/core';
import {SecretsManager} from 'aws-sdk';
import {CreateSecretRequest, UpdateSecretRequest} from 'aws-sdk/clients/secretsmanager';

export default class Adapter implements AdapterInterface {
    public constructor(private readonly client: SecretsManager) {
    }

    public async getSecret(key: string, options: OptionsInterface): Promise<Secret> {
        const params: SecretsManager.GetSecretValueRequest = {SecretId: options.path};
        if (options.versionId) {
            params.VersionId = options.versionId;
        }
        if (options.versionStage) {
            params.VersionStage = options.versionStage;
        }

        const data                        = await this.client.getSecretValue(params).promise();
        const {SecretString, ...metadata} = data;

        const secret: Secret = new Secret(key, '', metadata);
        try {
            return secret.withValue(JSON.parse(data['SecretString']));
        } catch (e) {
            return secret.withValue(data['SecretString']);
        }
    }

    public async putSecret(secret: Secret, options: OptionsInterface): Promise<Secret> {
        options.SecretString = typeof secret.value === 'string' ? secret.value : JSON.stringify(secret.value);

        try {
            options.SecretId = secret.key;
            const {Tags, ...params} = options;

            let response = await this.client.updateSecret(params as UpdateSecretRequest).promise();
            if (Tags !== undefined) {
                const tagResponse = await this.client.tagResource({SecretId: secret.key, Tags}).promise();
                response = {...response, ...tagResponse};
            }

            return secret.withMetadata(response);
        } catch (e) {
            options.Name = secret.key;

            const response = await this.client.createSecret(options as CreateSecretRequest).promise();

            return secret.withMetadata(response);
        }
    }

    public async deleteSecret(secret: Secret, options: OptionsInterface): Promise<void> {
        await this.client.deleteSecret({...options, SecretId: secret.key}).promise();
    }
}
