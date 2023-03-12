# Secretary - NodeJS Secrets Management

[![Build Stats](https://img.shields.io/github/actions/workflow/status/secretary/node/monorepo?branch=master&style=for-the-badge)](https://github.com/secretary/node)
[![codecov](https://img.shields.io/codecov/c/github/secretary/node?style=for-the-badge)](https://codecov.io/gh/secretary/node)

[![Downloads/week](https://img.shields.io/npm/dm/@secretary/core?style=for-the-badge)](https://npmjs.org/package/secretary/node)
[![License](https://img.shields.io/npm/l/@secretary/core.svg?style=for-the-badge)](https://github.com/secretary/node/blob/master/package.json)

___

Secretary (etymology: Keeper of secrets) provides an abstract way to manage secrets.

Currently supports the following adapters:

* [AWS Secrets Manager](https://github.com/secretary/node/tree/master/packages/aws-secrets-manager-adapter)
* [Azure Key Vault](https://github.com/secretary/node/tree/master/packages/azure-key-vault-adapter)
* [Hashicorp Vault](https://github.com/secretary/node/tree/master/packages/hashicorp-vault-adater)
* [JSON File](https://github.com/secretary/node/tree/master/packages/json-file-adapter)

## Cli Tool

There is also a [CLI package](https://github.com/secretary/node/tree/master/packages/cli) that can be used to inject
secrets as environment variables into a script

All it takes is install the package with:

```shell
yarn global add @secretary/cli
```

or

```shell
npm i -g @secretary/cli
```

and then place a config file (`.secretaryrc.js`) in your root directory:

```javascript
const {Adapter} = require("@secretary/aws-secrets-manager-adapter");
const {SecretsManager} = require('@aws-sdk/client-secrets-manager');

// You can specify an object here as the export, or a function
// if you need to do some async calls in here
module.exports = async (manager) => ({
    sources: {
        aws: new Adapter(new SecretsManager({
            region: 'us-east-1',
        })),
    },
    secrets: [
        {
            name: 'BOT_TOKEN',
            secret: 'bot/development',
            property: 'token',
            source: 'aws',
            callback(value) {
                return value.replace(/^Bot /, '');
            }
        }
    ]
})

```

Then run the following:

```shell
$ secretary inject yarn build
```

Your build script will then have a `BOT_TOKEN` environment variable set with the secret value's.

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
import {Manager} from '@secretary/core';
import {Adapter} from '@secretary/aws-secrets-manager';
// Or: import {Adapter} from '@secretary/hashicorp-vault-adapter';
// Or: import {Adapter} from '@secretary/json-file-adapter'; // Note: this is not for production
import {SecretsManager} from '@aws-sdk/client-secrets-manager';

const manager = new Manager({aws: new Adapter(new SecretsManager())});
```

### Fetch Secrets

```typescript
const someSecret = await manager.getSecret('some/database/secret', 'aws');
// or, aws as the first (and only) adapter in the manager, `default` is another key that works,
// which is what source getSecret defaults to
const someSecret = await manager.getSecret('some/database/secret');

console.log(someSecret.value.dsn); // redis://localhost:6379
```

### Create Secrets

```typescript
const secret = new Secret('some/database/secret', {dsn: 'redis://localhost:6379'});
await manager.putSecret(secret, 'aws');

console.log(someSecret.value.dsn); // redis://localhost:6379
```

### Delete Secrets

```typescript
const secret = await manager.getSecret('some/database/secret');

await manager.deleteSecret(secret, 'aws');
```

Check the usage docs of the adapter you want to use for specific instructions.
