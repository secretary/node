# Secretary - NodeJS Secrets Management 
[![Build Status](https://travis-ci.org/aequasi/secretary.svg?branch=master)](https://travis-ci.org/aequasi/secretary)

Secretary (etymology: Keeper of secrets) provides an abstract way to manage (currently only retrieve) secrets.

Currently supports:

* AWS Secrets Manager
* Hashicorp Vault


## Installation 

```bash
// If you want to use AWS Secrets Manager
$ npm install @secretary/core @secretary/aws-secrets-manager

// If you want to use Hashicorp Vault
$ npm install @secretary/core @secretary/node-vault

// If you want to use a JSON file
$ npm install @secretary/core @secretary/json-file
```

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
