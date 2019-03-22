import {ConfigurationInterface} from '@secretary/core';
import {SecretsManager} from 'aws-sdk';
import {SecretVersionIdType, SecretVersionStageType} from 'aws-sdk/clients/secretsmanager';

export default interface Configuration extends ConfigurationInterface {
    /**
     * Specifies the unique identifier of the version of the secret that you want to retrieve. If you specify this
     * parameter then don't specify VersionStage. If you don't specify either a VersionStage or VersionId then the
     * default is to perform the operation on the version with the VersionStage value of AWSCURRENT. This value is
     * typically a UUID-type value with 32 hexadecimal digits.
     */
    versionId?: SecretVersionIdType;
    /**
     * Specifies the secret version that you want to retrieve by the staging label attached to the version. Staging
     * labels are used to keep track of different versions during the rotation process. If you use this parameter then
     * don't specify VersionId. If you don't specify either a VersionStage or VersionId, then the default is to perform
     * the operation on the version with the VersionStage value of AWSCURRENT.
     */
    versionStage?: SecretVersionStageType;

    client: SecretsManager;
}
