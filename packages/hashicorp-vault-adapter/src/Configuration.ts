import {ConfigurationInterface} from '@secretary/core';
import * as nodeVault from 'node-vault';

export interface AppRoleOptions {
    role_id: string;
    secret_id: string;
}

export default interface Configuration extends ConfigurationInterface {
    appRole?: AppRoleOptions;
    secretPath?: string;
    client: nodeVault.client;
}
