# Secretary - NodeJS Secrets Management 
[![Build Status](https://travis-ci.org/secretary/node.svg?branch=master)](https://travis-ci.org/secretary/node)
[![codecov](https://codecov.io/gh/secretarysecrets/node/branch/master/graph/badge.svg)](https://codecov.io/gh/secretarysecrets/node)

___

Secretary (etymology: Keeper of secrets) provides an abstract way to manage secrets.

Currently supports the following adapters:

* [AWS Secrets Manager](https://github.com/secretary/node/tree/master/packages/aws-secrets-manager-adapter)
* [Credstash](https://github.com/secretary/node/tree/master/packages/credstash-adapter)
* [Hashicorp Vault](https://github.com/secretary/node/tree/master/packages/hashicorp-vault-adater)
* [JSON File](https://github.com/secretary/node/tree/master/packages/json-file-adapter)

## Installation 

```bash
// If you want to use AWS Secrets Manager
$ npm install @secretary/core @secretary/aws-secrets-manager-adapter

// If you want to use Hashicorp Vault
$ npm install @secretary/core @secretary/hashicorp-vault-adapter
```

Check the install docs of the adapter you want to use for specific instructions.

## Usage

```typescript
import {Adapter, Secretary} from '@secretary/aws-secrets-manager';
// Or: import {Adapter, Secretary} from '@secretary/hashicorp-vault-adapter';
// Or: import {Adapter, Secretary} from '@secretary/json-file-adapter'; // Note: this is not for production
import {SecretsManager} from 'aws-sdk';

const manager = new Secretary(new Adapter(new SecretsManager()));

async function main() {
    const someSecret = await manager.getSecret('database/redis/main');

    console.log(someSecret); 
    /*
    Secret {
        key: 'database/redis/main'
        value: {
            host: 'localhost',
            port: 6379
        },
        metadata: // Metadata from the adapter
    }        
    */
}
```

Check the usage docs of the adapter you want to use for specific instructions.
