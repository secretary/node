/* tslint:disable:interface-over-type-literal */
export type SecretValueType = string | { [key: string]: string };
export type MetadataType = { [key: string]: any };

export default class Secret {
    public constructor(private _key: string, private _value: SecretValueType, private _metadata: MetadataType = {}) {
    }

    public get key(): string {
        return this._key;
    }

    public get value(): SecretValueType {
        return this._value;
    }

    public get metadata(): any {
        return this._metadata;
    }

    public withValue(value: SecretValueType): Secret {
        return new Secret(this._key, value, this._metadata);
    }

    public withMetadata(metadata: any): Secret {
        return new Secret(this._key, this._value, metadata);
    }
}
