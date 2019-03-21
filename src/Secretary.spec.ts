import {expect, use} from 'chai';
import 'mocha';
import * as sinonChai from 'sinon-chai';

import MemoryContextAdapter, {Secret} from '../test/MemoryContextAdapter';
import MemoryPathAdapter from '../test/MemoryPathAdapter';
import {AbstractContextAdapter, AbstractPathAdapter, PathResult} from './Adapter';
import Secretary from './Secretary';

use(sinonChai);

const getMemoryPathAdapter: any    = (secrets: PathResult = {}) => {
    return new MemoryPathAdapter(secrets);
};
const getMemoryContextAdapter: any = (secrets: Secret[] = []) => {
    return new MemoryContextAdapter(secrets);
};
const getManager                   = (adapter?: AbstractPathAdapter | AbstractContextAdapter) => {
    return new Secretary(adapter || getMemoryPathAdapter());
};

describe('src/Secretary.ts', () => {
    it('should be able to construct', () => {
        expect(getManager()).to.be.instanceOf(Secretary);
    });

    it('should be able fetch a single secret from a path adapter', async () => {
        const adapter = getMemoryPathAdapter({path: {key: 'baz'}});
        const manager = getManager(adapter);

        expect(await manager.getSecret('key', 'path')).to.equal('baz');
    });

    it('should be able fetch a group of secret from a path adapter', async () => {
        const adapter = getMemoryPathAdapter({path: {key: 'baz'}});
        const manager = getManager(adapter);

        expect(await manager.getSecrets('path')).to.deep.equal({key: 'baz'});
    });

    it('should be able fetch a single secret from a context adapter', async () => {
        const adapter = getMemoryContextAdapter([
            {name: 'key', value: 'baz', type: 'test'},
            {name: 'foo', value: 'bar', type: 'test'},
            {name: 'foo', value: 'test', type: 'foobar'},
        ]);
        const manager = getManager(adapter);

        expect(await manager.getSecret('key')).to.equal('baz');
        expect(await manager.getSecret('foo', {type: 'test'})).to.equal('bar');
        expect(await manager.getSecret('foo', {type: 'foobar'})).to.equal('test');
    });

    it('should be able fetch a group of secret from a context adapter', async () => {
        const adapter = getMemoryContextAdapter([
            {name: 'key', value: 'baz', type: 'test'},
            {name: 'foo', value: 'test', type: 'test'},
        ]);
        const manager = getManager(adapter);

        expect(await manager.getSecrets({type: 'test'})).to.deep.equal({key: 'baz', foo: 'test'});
    });
});
