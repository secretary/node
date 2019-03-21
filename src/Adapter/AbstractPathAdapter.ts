import {AbstractAdapter, PathAdapterInterface, PathResult, Result} from './';

export default abstract class AbstractPathAdapter extends AbstractAdapter implements PathAdapterInterface {
    public readonly pathRegex: RegExp = /^(?!\/)[A-Za-z\/_-]+(?<!\/)$/;

    public async getSecret(key: string, path: string): Promise<Result> {
        const pathResult = await this.getPath(path);

        return pathResult[key];
    }

    public abstract getPath(path: string): Promise<PathResult>;
}
