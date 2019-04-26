import * as nodeVault from 'node-vault';

export interface AppRoleOptions {
    roleId: string;
    secretId: string;
}

export default interface Configuration {
    appRole?: AppRoleOptions;
    secretPath?: string;
    client: nodeVault.client;
}
