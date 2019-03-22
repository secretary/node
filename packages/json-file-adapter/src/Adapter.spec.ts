import {expect, use} from 'chai';
import {readFileSync, writeFileSync} from 'fs';
import 'mocha';
import {resolve} from 'path';
import * as sinonChai from 'sinon-chai';

import Adapter from './Adapter';

use(sinonChai);

const filePath = resolve(__dirname, '..', 'test', 'test.json');

const getAdapter: any = () => {
    writeFileSync(filePath + '.test', readFileSync(filePath));

    return new Adapter({cache: {enabled: true}, file: filePath + '.test'});
};

describe('src/Secretary.ts', () => {
    it('should be able to construct', () => {
        expect(getAdapter()).to.be.instanceOf(Adapter);
    });

    it('should be able fetch a single secret from the adapter', async () => {
        const adapter = getAdapter();

        expect(await adapter.getSecret({key: 'key', path: 'foo'})).to.deep.equal({
            key: 'key', path: 'foo', value: 'baz',
        });

        expect(await adapter.getSecret({key: 'baz', path: 'foo/bar/foobar/bar'})).to.deep.equal(
            {key: 'baz', path: 'foo/bar/foobar/bar', value: 'oiunsaf'},
        );
    });

    it('should be able fetch a group of secret from the adapter', async () => {
        const adapter = getAdapter();

        expect(await adapter.getSecrets({path: 'foo/bar/foobar/bar'})).to.deep.equal([
            {key: 'baz', path: 'foo/bar/foobar/bar', value: 'oiunsaf'},
            {key: 'key', path: 'foo/bar/foobar/bar', value: 'baz'},
        ]);
    });

    it('should be able to add a secret', async () => {
        const adapter = getAdapter();

        await adapter.putSecret({path: 'test', key: 'key', value: 'foobar'});
        expect(await adapter.getSecret({key: 'key', path: 'test'})).to.deep.equal({
            key: 'key', path: 'test', value: 'foobar',
        });
    });

    it('should be able to update a secret', async () => {
        const adapter = getAdapter();

        await adapter.putSecret({path: 'foo/baz', key: 'foobar', value: 'bar'});
        expect(await adapter.getSecret({key: 'foobar', path: 'foo/baz'})).to.deep.equal({
            key: 'foobar', path: 'foo/baz', value: 'bar',
        });
    });

    it('should be able to add multiple secrets', async () => {
        const adapter = getAdapter();

        await adapter.putSecrets({
            secrets: [
                {path: 'a', key: 'key1', value: 'value1'},
                {path: 'b', key: 'key2', value: 'value2'},
            ],
        });
        expect(await adapter.getSecret({key: 'key1', path: 'a'})).to.deep.equal({
            key: 'key1', path: 'a', value: 'value1',
        });
        expect(await adapter.getSecret({key: 'key2', path: 'b'})).to.deep.equal({
            key: 'key2', path: 'b', value: 'value2',
        });
    });

    it('should be able to update multiple secrets', async () => {
        const adapter = getAdapter();

        await adapter.putSecrets({
            secrets: [
                {path: 'foo', key: 'key', value: 'value1'},
                {path: 'foo/bar', key: 'baz', value: 'value2'},
            ],
        });
        expect(await adapter.getSecret({key: 'key', path: 'foo'})).to.deep.equal({
            key: 'key', path: 'foo', value: 'value1',
        });
        expect(await adapter.getSecret({key: 'baz', path: 'foo/bar'})).to.deep.equal({
            key: 'baz', path: 'foo/bar', value: 'value2',
        });
    });
});
