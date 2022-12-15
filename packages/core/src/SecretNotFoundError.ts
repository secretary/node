export default class SecretNotFoundError extends Error {
    public constructor(key: string) {
        super('Secret not found with the given key: ' + key);
    }
}
