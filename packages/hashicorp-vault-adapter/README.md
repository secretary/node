# Secretary - Hashicorp Vault Adapter

____

This is the [Hashicorp Vault](https://www.vaultproject.io/) adapter for [Secretary](https://github.com/secretarysecrets/node)

## Installation 

```bash
$ npm install @secretary/core @secretary/vault
```

## Usage

### Creating the manager
```typescript
import Secretary from '@secretary/core';
import Adapter from '@secretary/vault';
import * as nodeVault from 'node-vault';

const manager = new Secretary(new Adapter({client: nodeVault()}));
```

### Fetching a secret

```typescript
const someSecret = await manager.getSecret({path: 'databases/redis', key: 'dsn'});
console.log(someSecret); // redis://localhost:6379
```

### Fetching a secret path

```typescript
const someSecrets = await manager.getSecrets({path: 'databases/redis'});
console.log(someSecrets); // {dsn: 'redis://localhost:6379', auth: 'foo'}
```

### Create / Update a secret

```typescript
await manager.putSecret({path: 'databases/redis', key: 'dsn', value: 'redis://localhost:6379'});
await manager.putSecret({path: 'databases/redis', key: 'auth', value: 'foo'});
```

### Create / Update multiple secrets

> Note, this fires off a request for every secret that you send. 


```typescript
await manager.putSecrets([
    {path: 'databases/redis', key: 'dsn', value: 'redis://localhost:6379'},
    {path: 'databases/redis', key: 'auth', value: 'foo'},
]);
```
