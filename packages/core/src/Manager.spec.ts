import {expect, should, use} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as sinonChai from 'sinon-chai';
import * as TypeMoq from 'typemoq';
import {AbstractAdapter, AdapterInterface, Manager, Secret, SecretNotFoundError} from './';

const {isValue} = TypeMoq.It;

use(sinonChai);
use(chaiAsPromised);
should();

const mock = TypeMoq.Mock.ofType<AbstractAdapter>(undefined, TypeMoq.MockBehavior.Strict);
const getManager = (adapter?: AdapterInterface) => new Manager({default: adapter || mock.object});

beforeEach(() => mock.reset());
afterEach(() => mock.verifyAll());

describe('src/Manager.ts', () => {
    it('constructor', () => {
        expect(getManager()).to.be.instanceOf(Manager);
    });

    it('getSecret', async () => {
        const manager = getManager();

        const secret = new Secret('foo', 'bar');
        mock.setup((x) => x.getSecret(isValue(secret.key), isValue(undefined))).returns(() => Promise.resolve(secret));
        mock.setup((x) => x.getSecret(isValue('bar'), isValue(undefined)))
            .returns(() => Promise.reject(new SecretNotFoundError('bar')));

        const result = await manager.getSecret('foo');

        await Promise.all([
            result.key.should.equal(secret.key),
            result.value.should.equal(secret.value),
            result.metadata.should.equal(secret.metadata),
            result.should.deep.equal(secret),
            manager.getSecret('bar').should.rejectedWith(SecretNotFoundError),
        ]);
    });

    it('putSecret', async () => {
        const manager = getManager();

        const secret = new Secret('foo', 'bar');
        mock.setup((x) => x.putSecret(isValue(secret), isValue(undefined))).returns(() => Promise.resolve(secret));

        await manager.putSecret(secret).should.eventually.deep.equal(secret);
    });

    it('deleteSecret', async () => {
        const manager = getManager();

        const secret = new Secret('foo', 'bar');
        const badSecret = new Secret('bar', 'foo');
        mock.setup((x) => x.deleteSecret(isValue(secret), isValue(undefined))).returns(() => Promise.resolve());
        mock.setup((x) => x.deleteSecret(isValue(badSecret), isValue(undefined)))
            .returns(() => Promise.reject(new SecretNotFoundError('bar')));

        await manager.deleteSecret(secret);
        await manager.deleteSecret(badSecret).should.rejectedWith(SecretNotFoundError);
    });

    it('deleteSecretByKey', async () => {
        const manager = getManager();

        const secret = new Secret('foo', 'bar');
        const badSecret = new Secret('bar', 'foo');
        mock.setup((x) => x.getSecret(isValue(secret.key), isValue(undefined))).returns(() => Promise.resolve(secret));
        mock.setup((x) => x.deleteSecret(isValue(secret), isValue(undefined))).returns(() => Promise.resolve());
        mock.setup((x) => x.getSecret(isValue(badSecret.key), isValue(undefined)))
            .returns(() => Promise.reject(new SecretNotFoundError('bar')));

        await manager.deleteSecretByKey(secret.key);
        await manager.deleteSecretByKey(badSecret.key).should.rejectedWith(SecretNotFoundError);
    });
});
