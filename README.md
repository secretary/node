# Secretary - NodeJS Secrets Management 
[![Build Status](https://travis-ci.org/secretarysecrets/node.svg?branch=master)](https://travis-ci.org/secretarysecrets/node)
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
$ npm install @secretary/core @secretary/aws-secrets-manager

// If you want to use Hashicorp Vault
$ npm install @secretary/core @secretary/vault
```

Check the install docs of the adapter you want to use for specific instructions.

## Usage

```typescript
import Secretary from '@secretary/core';
import Adapter from '@secretary/aws-secrets-manager';
import {SecretsManager} from 'aws-sdk';

const manager = new Secretary({
    adapter: new Adapter({client: new SecretsManager()})
});

async function main() {
    const someSecret = await manager.getSecret('redis_host', 'some/secret/path');
    
    console.log(someSecret); // redis://localhost:6379
}
```

Check the usage docs of the adapter you want to use for specific instructions.
