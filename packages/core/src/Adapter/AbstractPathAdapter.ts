import {
    KeyOptionsInterface,
    PathAdapterInterface,
    PathOptionsInterface,
    PutMultiplePathOptionsInterface,
    PutSinglePathOptionsInterface,
    SecretWithPathInterface,
} from '../Interface';
import {AbstractAdapter} from './';

export default abstract class AbstractPathAdapter extends AbstractAdapter implements PathAdapterInterface {
    public readonly pathRegex: RegExp = /^(?!\/)[A-Za-z\/_-]+(?<!\/)$/;

    public async getSecret(options: KeyOptionsInterface): Promise<SecretWithPathInterface> {
        const {key, ...pathOptions} = options;
        const pathResult            = await this.memoize(
            JSON.stringify(pathOptions),
            () => this.getSecrets(pathOptions),
        );

        return pathResult.find((secret) => secret.key === key);
    }

    public abstract getSecrets(options: PathOptionsInterface): Promise<SecretWithPathInterface[]>;

    public abstract putSecret(options: PutSinglePathOptionsInterface): Promise<void>;

    public abstract putSecrets(options: PutMultiplePathOptionsInterface): Promise<void>;

    protected denyIfInvalidPath(path: string): void {
        if (!this.pathRegex.test(path)) {
            throw new Error('Path is invalid. Must match regex: ' + this.pathRegex.toString());
        }
    }
}
