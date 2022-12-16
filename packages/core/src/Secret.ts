export type SecretValueType = string | Record<string, string>;
export type MetadataType = any;

export default class Secret<Value extends SecretValueType = SecretValueType> {
    public constructor(
        public readonly key: string,
        public readonly value?: Value,
        public readonly metadata: MetadataType = {},
    ) {
    }

    public withValue<NewValue extends SecretValueType = SecretValueType>(value: NewValue): Secret<NewValue> {
        return new Secret(this.key, value, this.metadata);
    }

    public withMetadata(metadata: MetadataType): Secret<Value> {
        return new Secret(this.key, this.value, metadata);
    }
}
