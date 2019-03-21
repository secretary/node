# Secretary - NodeJS Secrets Management 
[![Build Status](https://travis-ci.org/aequasi/secretary.svg?branch=master)](https://travis-ci.org/aequasi/secretary)

Secretary (etymology: Keeper of secrets) provides an abstract way to manage (currently only retrieve) secrets.

Currently supports:

* AWS Secrets Manager
* Hashicorp Vault


## Installation 

```bash
// If you want to use AWS Secrets Manager
$ npm install secretary-secrets aws-sdk

// If you want to use Hashicorp Vault
$ npm install secretary-secrets node-vault

// If you want to use a JSON file (no extra deps needed!)
$ npm install secretary-secrets
```

## Usage

```typescript
import Secretary, {AWSSecretsManagerAdapter} from 'secretary-secrets';
import {SecretsManager} from 'aws-sdk';

const manager = new Secretary({
    adapter: new AWSSecretsManagerAdapter({client: new SecretsManager()})
});

async function main() {
    const someSecret = await manager.getSecret('redis_host', 'some/secret/path');
    
    console.log(someSecret); // redis://localhost:6379
}
```
