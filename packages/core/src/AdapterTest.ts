/* istanbul ignore file */
import {expect, should, use} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as sinonChai from 'sinon-chai';

import {AbstractAdapter, Secret, SecretNotFoundError} from './';

use(sinonChai);
use(chaiAsPromised);
should();

const expected: { [key: string]: any[] } = {
    constructor:  [],
    getSecret:    [
        ['foo', new Secret('foo', 'bar')],
        ['baz', new Secret('baz', {foobar: 'baz'})],
        ['bar'],
    ],
    putSecret:    [
        [new Secret('test', 'foobar')], // Add New
        [new Secret('test2', 'foobar'), 'baz'], // Update
    ],
    deleteSecret: [
        [new Secret('test', 'foobar')],
    ],
};

export default (
    name: string,
    getAdapter: () => AbstractAdapter,
    callbacks: { [key: string]: (adapter: AbstractAdapter, expected: any[]) => void },
) => {
    describe(name, () => {
        it('constructor', () => {
            const adapter = getAdapter();
            callbacks.constructor(adapter, expected.constructor);

            expect(adapter).to.be.instanceOf(AbstractAdapter);
        });

        it('getSecret', async () => {
            const e       = expected.getSecret;
            const adapter = getAdapter();
            callbacks.getSecret(adapter, e);

            await Promise.all([
                adapter.getSecret(e[0][0]).should.eventually.deep.equal(e[0][1]),
                adapter.getSecret(e[1][0]).should.eventually.deep.equal(e[1][1]),
                adapter.getSecret(e[2][0]).should.be.rejectedWith(SecretNotFoundError),
            ]);
        });

        it('putSecret', async () => {
            const e       = expected.putSecret;
            const adapter = getAdapter();
            callbacks.putSecret(adapter, e);

            await adapter.putSecret(e[0][0]).should.eventually.deep.equal(e[0][0]);

            const oldSecret     = await adapter.putSecret(e[1][0]);
            const updatedSecret = await adapter.putSecret(oldSecret.withValue(e[1][1]));

            oldSecret.should.not.deep.equal(updatedSecret);
            updatedSecret.value.should.deep.equal(e[1][1]);
        });

        it('deleteSecret', async () => {
            const e       = expected.deleteSecret;
            const adapter = getAdapter();
            callbacks.deleteSecret(adapter, e);

            const secret = await adapter.putSecret(e[0][0]);
            await adapter.deleteSecret(secret);

            await Promise.all([
                adapter.getSecret(secret.key).should.be.rejectedWith(SecretNotFoundError),
                adapter.deleteSecret(secret).should.be.rejectedWith(SecretNotFoundError),
            ]);
        });
    });
};
