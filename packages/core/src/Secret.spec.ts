import {expect, should, use} from 'chai';
import 'mocha';
import * as sinonChai from 'sinon-chai';

import {Secret} from './';

use(sinonChai);
should();

const secret = new Secret('foo', 'bar', {metaKey: 'foobar'});

describe('src/Secret.ts', () => {
    it('constructor', () => {
        expect(secret).to.be.instanceOf(Secret);
    });

    it('get key', () => {
        secret.key.should.equal('foo');
    });

    it('get value', () => {
        secret.value.should.equal('bar');
    });

    it('get metadata', () => {
        secret.metadata.should.deep.equal({metaKey: 'foobar'});
    });

    it('withValue', () => {
        secret.withValue('baz').value.should.equal('baz');
    });

    it('withMetadata', () => {
        secret.withMetadata({metaKey: 'baz', test: 'bar'}).metadata.should.deep.equal({metaKey: 'baz', test: 'bar'});
    });
});
