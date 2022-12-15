import {Command, Flags} from '@oclif/core';
import {AbstractAdapter, Manager} from '@secretary/core';

interface Secret {
  name: string;
  property: string;
  source: keyof Config['sources'];
}

interface Config {
  sources: Record<string, AbstractAdapter>;
  secrets: Secret[];
}

type ConfigFileContent = Config | ((manager: Manager) => Promise<Config>);

export default class Inject extends Command {
  static description = 'Inject secrets into the environment of the given command';

  static examples = [
    `$ secretary inject yarn build
// output from yarn build
`,
  ];

  static flags = {
    config: Flags.string({char: 'c', description: 'Config file to read mapping from', default: '.secretaryrc.js'}),
  };

  static args = [{name: 'command', description: 'Command to run', required: true}];

  static strict = false;

  async run(): Promise<void> {
    const {argv, flags} = await this.parse(Inject);

    const manager = new Manager();
    const config = await this.getConfig(flags.config);

    this.log(`Command: ${JSON.stringify(argv)}`);
    this.log(`Flags: ${JSON.stringify(flags)}`);
  }

  private async getConfig(configFile: string): Promise<Config> {
    const configFn: ConfigFileContent = require(configFile);
    if (typeof configFn !== 'function') {
      return this.validateConfig(configFn);
    }

    return this.validateConfig(await configFn());
  }

  private validateConfig(config: Config): Config {
    return config;
  }
}

interface Config {

}
