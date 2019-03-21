import {AbstractPathAdapter, PathResult} from '../src/Adapter';

export default class MemoryPathAdapter extends AbstractPathAdapter {
    public constructor(private readonly secrets: PathResult) {
        super({cache: {enabled: true}});
    }

    public async getPath(path: string): Promise<PathResult> {
        const resolved             = this.resolve(path);
        const response: PathResult = {};
        for (const key of Object.keys(resolved)) {
            if (typeof resolved[key] !== 'object') {
                response[key] = resolved[key];
            }
        }

        return response;
    }

    private resolve(path: string): any {
        const properties = Array.isArray(path) ? path : path.split('/');

        return properties.reduce((prev, curr) => prev && prev[curr], this.secrets as any);
    }
}
