import {Command, Config, Flags} from '@oclif/core';
import {AbstractAdapter, Manager} from '@secretary/core';
import execa from 'execa';
import * as path from 'path';
import * as yup from 'yup';

interface Secret {
  name: string;
  secret: string;
  property: string;
  source: keyof SecretaryConfig['sources'];
}

const configSchema = yup.lazy((wholeValue) => yup.object({
  sources: yup.object().defined(),
  secrets: yup.array().of(yup.object({
    name: yup.string().defined(),
    secret: yup.string().defined(),
    property: yup.string().defined(),
    source: yup.lazy(() => (
      yup.string().oneOf(Object.keys(wholeValue.sources))
    )),
  })).defined()
}));

interface SecretaryConfig {
  sources: Record<string, AbstractAdapter>;
  secrets: Secret[];
}

type ConfigFileContent = SecretaryConfig | ((manager: Manager) => Promise<SecretaryConfig>);

export default class Inject extends Command {
  static description = 'Inject secrets into the environment of the given command';

  static examples = [
    `$ secretary inject yarn build
// output from yarn build
`,
  ];

  static flags = {
    config: Flags.string({
      char: 'c',
      description: 'SecretaryConfig file to read mapping from',
      default: path.join(process.cwd(), './.secretaryrc.js')
    }),
  };

  static args = [{name: 'command', description: 'Command to run', required: true}];

  static strict = false;

  private readonly manager: Manager;
  private secretaryConfig: SecretaryConfig | undefined;

  constructor(argv: string[], config: Config) {
    super(argv, config);

    this.manager = new Manager();
  }

  async run(): Promise<void> {
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
      const secret = await this.manager.getSecret<Record<string, string>>(secretConfig.secret, secretConfig.source);
      newEnv[secretConfig.name] = secret.value?.[secretConfig.property];
    }

    const exec = execa(argv.shift() as string, argv, {env: newEnv});

    exec.stdout?.pipe(process.stdout);
    exec.stderr?.pipe(process.stderr);
    exec.stdin?.pipe(process.stdin);

    await exec;

    return this.exit(exec.exitCode ?? 0);
  }

  private async getConfig(configFile: string): Promise<SecretaryConfig> {
    const configFn: ConfigFileContent = await import(configFile).then((x) => x.default ?? x);
    if (typeof configFn !== 'function') {
      return this.validateConfig(configFn);
    }

    return this.validateConfig(await configFn(this.manager));
  }

  private validateConfig(config: SecretaryConfig): SecretaryConfig {
    return configSchema.validateSync(config) as SecretaryConfig;
  }
}
