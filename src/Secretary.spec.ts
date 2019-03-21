import {expect, use} from 'chai';
import 'mocha';
import * as sinonChai from 'sinon-chai';

import MemoryAdapter from '../test/MemoryAdapter';
import MemoryPathAdapter from '../test/MemoryPathAdapter';
import {AbstractPathAdapter, Secretary, SecretWithPathInterface as Secret} from './';

use(sinonChai);

const getMemoryAdapter: any     = (secrets: Secret[] = []) => {
    return new MemoryAdapter(secrets);
};
const getMemoryPathAdapter: any = (secrets: Secret[] = []) => {
    return new MemoryPathAdapter(secrets);
};
const getManager                = (adapter?: AbstractPathAdapter) => {
    return new Secretary(adapter || getMemoryPathAdapter());
};

const getPathSecret = async (
    manager: Secretary<MemoryPathAdapter>,
    key: string,
    path: string,
    expected: string,
): Promise<string> => {
    const secret = await manager.getSecret({key, path});

    expect(secret).to.be.deep.equal({key, path, value: expected});

    return secret.value;
};

describe('src/Secretary.ts', () => {
    it('should be able to construct', () => {
        expect(getManager()).to.be.instanceOf(Secretary);
    });

    it('should be able fetch a single secret from a path adapter', async () => {
        const adapter = getMemoryPathAdapter([
            {key: 'key', path: 'path', value: 'baz'},
            {key: 'key2', path: 'path', value: 'bar'},
        ]);
        const manager = getManager(adapter);

        await getPathSecret(manager, 'key', 'path', 'baz');
        await getPathSecret(manager, 'key2', 'path', 'bar');
        await getPathSecret(manager, 'key', 'path', 'baz');
    });

    it('should be able fetch a group of secret from a path adapter', async () => {
        const secrets: Secret[] = [
            {key: 'key', path: 'path', value: 'baz'},
            {key: 'key2', path: 'path', value: 'bar'},
            {key: 'key2', path: 'otherPath', value: 'bar'},
        ];
        const adapter         = getMemoryPathAdapter(secrets);
        const manager         = getManager(adapter);

        expect(await manager.getSecrets({path: 'path'})).to.deep.equal([secrets[0], secrets[1]]);
    });

    it('should be able fetch a single secret from a non-path adapter', async () => {
        const adapter = getMemoryAdapter([
            {key: 'key', value: 'baz'},
            {key: 'foo', value: 'bar'},
            {key: 'foo', value: 'test'},
        ]);
        const manager = getManager(adapter);

        expect(await manager.getSecret({key: 'key'})).to.deep.equal({key: 'key', value: 'baz'});
        expect(await manager.getSecret({key: 'foo'})).to.deep.equal({key: 'foo', value: 'bar'});
    });

    it('should be able fetch a group of secret from a non-path adapter', async () => {
        const adapter = getMemoryAdapter([
            {key: 'key', value: 'baz'},
            {key: 'foo', value: 'bar'},
            {key: 'foo', value: 'baz'},
        ]);
        const manager = getManager(adapter);

        expect(await manager.getSecrets({key: 'foo'})).to.deep.equal([
            {key: 'foo', value: 'bar'},
            {key: 'foo', value: 'baz'},
        ]);
    });
});
