import {AbstractContextAdapter, Context, PathResult, Result} from '../src/Adapter';

export interface Secret {
    name: string;
    value: string;
    type: string;
}

export default class MemoryContextAdapter extends AbstractContextAdapter {
    public constructor(private readonly secrets: Secret[]) {
        super({});
    }

    public async getContext(context: Context): Promise<PathResult> {
        const secrets = this.secrets.filter((secret) => {
            if (context.name) {
                return secret.name === context.name;
            }

            if (context.value) {
                return secret.value === context.value;
            }

            if (context.type) {
                return secret.type === context.type;
            }

            return false;
        });

        const response = {};
        for (const secret of secrets) {
            response[secret.name] = secret.value;
        }

        return response;
    }

    public async getSecret(key: string, context?: Context): Promise<Result> {
        if (context) {
            const secrets = await this.getContext(context);

            return secrets[key];
        }

        const secret = this.secrets.find((x) => {
            if (context && context.name) {
                return x.name === context.name;
            }

            if (context && context.value) {
                return x.value === context.value;
            }

            if (context && context.type) {
                return x.type === context.type;
            }

            return x.name === key;
        });

        return secret ? secret.value : null;
    }
}
