export default class SecretNotFoundError extends Error {
    constructor(key: string) {
        super('Secret not found with the given key: ' + key);
    }
}
