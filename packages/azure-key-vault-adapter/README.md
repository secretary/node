# Secretary - Azure Key Vault Adapter

This is the [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/) adapter for [Secretary](https://github.com/secretarysecrets/node)

## Installation 

```bash
$ npm install @secretary/core @secretary/aws-secrets-manager
```

## Usage

### Creating the manager
```typescript
import {Adapter, Secretary} from '@secretary/azure-key-vault-adapter';

const manager = new Secretary(new Adapter({
    clientId: 'client_id_here',
    clientSecret: 'client_secret_here',
    vaultUri: 'vault_uri_here',
}));
```

### CRUD

The rest is done normally
