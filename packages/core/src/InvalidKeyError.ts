export default class InvalidKeyError extends Error {
    constructor(key: string, regex?: RegExp) {
        let message = 'Invalid key for this adapter specified: ' + key;
        if (regex) {
            message += '. Allowed values must match the regex: ' + regex.toString();
        }

        super(message);
    }
}
