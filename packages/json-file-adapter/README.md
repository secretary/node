# Secretary - JSON File Adapter

This is the JSON File adapter for [Secretary](https://github.com/secretarysecrets/node)

### Important

This adapter does NOT use any encryption. It should ***NOT*** be used in production.

## Installation

```bash
$ npm install @secretary/core @secretary/json-file-adapter
```

## Usage

### Creating the manager

```typescript
import {Manager} from '@secretary/core';
import {Adapter} from '@secretary/hashicorp-vault-adapter';

const manager = new Manager({file: new Adapter({file: '../path/to/my/secrets'})});
```
