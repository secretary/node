# Secretary - AWS SSM Parameter Store Adapter

This is the [AWS SSM Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) adapter
for [Secretary](https://github.com/secretary/node)

## Installation

```bash
$ npm install @secretary/core @secretary/aws-ssm-parameter-store-adapter
```

## Usage

### Creating the manager

```typescript
import {Manager} from '@secretary/core';
import {Adapter} from '@secretary/aws-ssm-parameter-store-adapter';
import {SSM} from '@aws-sdk/client-ssm';

const manager = new Manager({aws: new Adapter(new SSM({region: 'us-east-1'}))});
```

Secrets are written as `SecureString` parameters by default. Pass `Type: 'String'` (or a
custom `KeyId`) through the put options to change that.
