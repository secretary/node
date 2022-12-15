# Secretary - AWS Secrets Manager Adapter

This is the [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) adapter
for [Secretary](https://github.com/secretarysecrets/node)

## Installation

```bash
$ npm install @secretary/core @secretary/aws-secrets-manager-adapter
```

## Usage

### Creating the manager

```typescript
import {Adapter, Secretary} from '@secretary/aws-secrets-manager-adapter';
import {SecretsManager} from '@aws-sdk/client-secrets-manager';

const manager = new Secretary(new Adapter(new SecretsManager({region: 'us-east-1'})));
```

### CRUD

The rest is done normally
