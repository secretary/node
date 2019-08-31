/* tslint:disable:interface-over-type-literal */
export type SecretValueType = string | {[key: string]: string};
export type MetadataType = {[key: string]: any};

export default class Secret<Value extends SecretValueType = any> {
    public constructor(
        public readonly key: string,
        public readonly value?: Value,
        public readonly metadata: MetadataType = {}
    ) {
    }

    public withValue<NewValue extends SecretValueType = any>(value: NewValue): Secret<NewValue> {
        return new Secret(this.key, value, this.metadata);
    }

    public withMetadata(metadata: any): Secret<Value> {
        return new Secret(this.key, this.value, metadata);
    }
}
