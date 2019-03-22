# Secretary - JSON File Adapter
[![Build Status](https://travis-ci.org/secretarysecrets/node-json-file.svg?branch=master)](https://travis-ci.org/secretarysecrets/node-json-file)
[![codecov](https://codecov.io/gh/secretarysecrets/node-json-file/branch/master/graph/badge.svg)](https://codecov.io/gh/secretarysecrets/node-json-file)

____

This is the JSON File adapter for [Secretary](https://github.com/secretarysecrets/node)

## Important

This adapter does NOT use any encryption. It should ***NOT*** be used in production.

## Installation 

```bash
$ npm install @secretary/core @secretary/json-file
```

## Usage

### Creating the manager
```typescript
import Secretary from '@secretary/core';
import Adapter from '@secretary/json-file';

const manager = new Secretary(new Adapter({file: '../path/to/my/secrets'}));
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
