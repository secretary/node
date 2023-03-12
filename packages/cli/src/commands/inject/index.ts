import path from 'node:path';

import {Command, Config, Flags} from '@oclif/core';
import {AbstractAdapter, Manager} from '@secretary/core';
import execa from 'execa';
import * as yup from 'yup';

type SecretCallback = (value?: string) => string | undefined;

interface Secret {
    name: string;
    secret: string;
    property: string;
    source: keyof SecretaryConfig['sources'];
    callback: SecretCallback
}

const configSchema = yup.lazy((wholeValue: SecretaryConfig) => yup.object({
    sources: yup.object().defined(),
    secrets: yup.array().of(yup.object({
        name:     yup.string().defined(),
        secret:   yup.string().defined(),
        property: yup.string().defined(),
        source:   yup.lazy(() => (
            yup.string().oneOf(Object.keys(wholeValue.sources))
        )),
        callback: yup.mixed((input): input is SecretCallback => typeof input === 'function'),
    })).defined(),
}));

interface SecretaryConfig {
    sources: Record<string, AbstractAdapter>;
    secrets: Secret[];
}

type ConfigFileContent = SecretaryConfig | ((manager: Manager) => Promise<SecretaryConfig>);

export default class Inject extends Command {
    public static description = 'Inject secrets into the environment of the given command';

    public static examples = [
        `$ secretary inject yarn build
// output from yarn build
`,
    ];

    public static flags = {
        config: Flags.string({
            char:        'c',
            description: 'SecretaryConfig file to read mapping from',
            default:     path.join(process.cwd(), './.secretaryrc.js'),
        }),
    };

    public static args = [{name: 'command', description: 'Command to run', required: true}];

    public static strict = false;

    private readonly manager: Manager;
    private secretaryConfig: SecretaryConfig | undefined;

    public constructor(argv: string[], config: Config) {
        super(argv, config);

        this.manager = new Manager();
    }

    public async run(): Promise<void> {
        const {argv, flags} = await this.parse(Inject);

        if (!argv[0]) {
            this.error('You must pass a command to this script');

            return this.exit(255);
        }

        this.secretaryConfig = await this.getConfig(flags.config);
        for (const [name, adapter] of Object.entries(this.secretaryConfig.sources)) {
            this.manager.addAdapter(name, adapter);
        }

        const newEnv: Record<string, string | undefined> = {};
        for (const secretConfig of this.secretaryConfig.secrets) {
            // eslint-disable-next-line no-await-in-loop
            const secret = await this.manager.getSecret<Record<string, string>>(secretConfig.secret, secretConfig.source);
            newEnv[secretConfig.name] = typeof secretConfig.callback === 'function' ? secretConfig.callback(secret.value?.[secretConfig.property]) : secret.value?.[secretConfig.property];
        }

        const exec = execa(argv.shift() as string, argv, {env: newEnv});

        exec.stdout?.pipe(process.stdout);
        exec.stderr?.pipe(process.stderr);
        exec.stdin?.pipe(process.stdin);

        await exec;

        return this.exit(exec.exitCode ?? 0);
    }

    private async getConfig(configFile: string): Promise<SecretaryConfig> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
        const configFn = await import(configFile).then((x: any) => x.default ?? x) as ConfigFileContent;
        if (typeof configFn !== 'function') {
            return this.validateConfig(configFn);
        }

        return this.validateConfig(await configFn(this.manager));
    }

    private validateConfig(config: SecretaryConfig): SecretaryConfig {
        return configSchema.validateSync(config) as SecretaryConfig;
    }
}
