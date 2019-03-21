import 'source-map-support/register';
import {AbstractContextAdapter, AbstractPathAdapter, Context, PathResult, Result} from './Adapter';

export default class Secretary<T extends AbstractPathAdapter | AbstractContextAdapter> {
    public constructor(private readonly adapter: T) {
    }

    public async getSecret(key: string, pathOrContext?: string | Context): Promise<Result> {
        if (pathOrContext === null) {
            return this.getSecretByContext(key);
        }

        if (typeof pathOrContext === 'string') {
            return this.getSecretByPath(key, pathOrContext as string);
        }

        return this.getSecretByContext(key, pathOrContext as Context);
    }

    public async getSecrets(pathOrContext: string | Context): Promise<PathResult> {
        if (typeof pathOrContext === 'string') {
            return this.getSecretsByPath(pathOrContext as string);
        }

        return this.getSecretsByContext(pathOrContext as Context);
    }

    private async getSecretByPath(key: string, path: string): Promise<Result> {
        const adapter: AbstractPathAdapter = this.adapter as AbstractPathAdapter;
        if (!adapter.pathRegex.test(path)) {
            throw new Error('Path is invalid. Must match regex: ' + adapter.pathRegex.toString());
        }

        return adapter.getSecret(key, path);
    }

    private async getSecretByContext(key: string, context?: Context): Promise<Result> {
        const adapter: AbstractContextAdapter = this.adapter as AbstractContextAdapter;

        return adapter.getSecret(key, context);
    }

    private async getSecretsByPath(path: string): Promise<PathResult> {
        const adapter: AbstractPathAdapter = this.adapter as AbstractPathAdapter;
        if (!adapter.pathRegex.test(path)) {
            throw new Error('Path is invalid. Must match regex: ' + adapter.pathRegex.toString());
        }

        return adapter.getPath(path);
    }

    private async getSecretsByContext(context: Context): Promise<PathResult> {
        const adapter: AbstractContextAdapter = this.adapter as AbstractContextAdapter;

        return adapter.getContext(context);
    }
}
