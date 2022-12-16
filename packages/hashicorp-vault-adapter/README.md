# Secretary - Hashicorp Vault Adapter

This is the [Hashicorp Vault](https://www.vaultproject.io/) adapter
for [Secretary](https://github.com/secretarysecrets/node)

## Installation

```bash
$ npm install @secretary/core @secretary/vault
```

## Usage

### Creating the manager

```typescript
import {Manager} from '@secretary/core';
import {Adapter} from '@secretary/hashicorp-vault-adapter';
import * as nodeVault from 'node-vault';

const manager = new Manager({vault: new Adapter({client: nodeVault()})});
```
