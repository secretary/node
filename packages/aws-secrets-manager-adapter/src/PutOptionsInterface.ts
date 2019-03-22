import {PutMultiplePathOptionsInterface, PutSinglePathOptionsInterface} from '@secretary/core';
import {
    KmsKeyIdType,
    PutSecretValueRequest,
    SecretVersionStagesType,
    TagListType,
} from 'aws-sdk/clients/secretsmanager';

export interface PutSingleOptionsInterface extends PutSinglePathOptionsInterface {
    /**
     * (Optional) Specifies a list of staging labels that are attached to this version of the secret. These staging
     * labels are used to track the versions through the rotation process by the Lambda rotation function. A staging
     * label must be unique to a single version of the secret. If you specify a staging label that's already associated
     * with a different version of the same secret then that staging label is automatically removed from the other
     * version and attached to this version. If you do not specify a value for VersionStages then Secrets Manager
     * automatically moves the staging label AWSCURRENT to this new version.
     */
    VersionStages?: SecretVersionStagesType;

    /**
     * (Optional) Specifies a user-provided description of the secret.
     */
    Description?: string;

    /**
     * (Optional) Specifies the ARN, Key ID, or alias of the AWS KMS customer master key (CMK) to be used to encrypt
     * the SecretString or SecretBinary values in the versions stored in this secret. You can specify any of the
     * supported ways to identify a AWS KMS key ID. If you need to reference a CMK in a different account, you can use
     * only the key ARN or the alias ARN. If you don't specify this value, then Secrets Manager defaults to using the
     * AWS account's default CMK (the one named aws/secretsmanager). If a AWS KMS CMK with that name doesn't yet exist,
     * then Secrets Manager creates it for you automatically the first time it needs to encrypt a version's
     * SecretString or SecretBinary fields.  You can use the account's default CMK to encrypt and decrypt only if you
     * call this operation using credentials from the same account that owns the secret. If the secret is in a
     * different account, then you must create a custom CMK and specify the ARN in this field.
     */
    KmsKeyId?: KmsKeyIdType;

    /**
     * (Optional) Specifies a list of user-defined tags that are attached to the secret. Each tag is a "Key" and
     * "Value" pair of strings. This operation only appends tags to the existing list of tags. To remove tags, you must
     * use UntagResource.    Secrets Manager tag key names are case sensitive. A tag with the key "ABC" is a different
     * tag from one with key "abc".   If you check tags in IAM policy Condition elements as part of your security
     * strategy, then adding or removing a tag can change permissions. If the successful completion of this operation
     * would result in you losing your permissions for this secret, then this operation is blocked and returns an
     * Access Denied error.    This parameter requires a JSON text string argument. For information on how to format a
     * JSON parameter for the various command line tool environments, see Using JSON for Parameters in the AWS CLI User
     * Guide. For example:  [{"Key":"CostCenter","Value":"12345"},{"Key":"environment","Value":"production"}]  If your
     * command-line tool or SDK requires quotation marks around the parameter, you should use single quotes to avoid
     * confusion with the double quotes required in the JSON text.  The following basic restrictions apply to tags:
     * Maximum number of tags per secret—50   Maximum key length—127 Unicode characters in UTF-8   Maximum value
     * length—255 Unicode characters in UTF-8   Tag keys and values are case sensitive.   Do not use the aws: prefix in
     * your tag names or values because it is reserved for AWS use. You can't edit or delete tag names or values with
     * this prefix. Tags with this prefix do not count against your tags per secret limit.   If your tagging schema
     * will be used across multiple services and resources, remember that other services might have restrictions on
     * allowed characters. Generally allowed characters are: letters, spaces, and numbers representable in UTF-8, plus
     * the following special characters: + - = . _ : / @.
     */
    Tags?: TagListType;
}

export interface PutMultipleOptionsInterface extends PutMultiplePathOptionsInterface, PutSecretValueRequest {
    secrets: PutSingleOptionsInterface[];
}
