import {expect, use} from 'chai';
import 'mocha';
import * as nodeVault from 'node-vault';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import Adapter from './Adapter';

use(sinonChai);

const vault: nodeVault.client = nodeVault();

const getAdapter: any = () => {
    return new Adapter({client: vault});
};

describe('src/Secretary.ts', () => {
    it('should be able to construct', () => {
        expect(getAdapter()).to.be.instanceOf(Adapter);
    });

    it('should log in', async () => {
        const client = nodeVault();
        const adapter = new Adapter({
            client,
            appRole: {role_id: 'a', secret_id: 'b'},
        });

        const stub = sinon.stub(client, 'approleLogin');
        const readStub = sinon.stub(client, 'read');
        readStub.returns(Promise.resolve({data: {}}));

        await adapter.getSecret({key: 'key', path: 'path'});
        expect(readStub).to.have.been.calledOnceWith('secret/path');
        expect(stub).to.have.been.calledOnceWith({role_id: 'a', secret_id: 'b'});
    });

    it('should be able fetch a single secret from the adapter', async () => {
        let read = sinon.stub(vault, 'read');

        read.returns(Promise.resolve({data: {key: 'baz', key2: 'bar'}}));

        const adapter = getAdapter();

        expect(await adapter.getSecret({key: 'key', path: 'path'})).to.deep.equal({
            key: 'key', path: 'path', value: 'baz',
        });
        expect(read).to.have.been.calledOnceWith('secret/path');

        read.restore();
        read = sinon.stub(vault, 'read');
        read.returns(Promise.resolve({data: {key: 'baz', key2: 'bar'}}));

        expect(await adapter.getSecret({key: 'key2', path: 'path'})).to.deep.equal({
            key: 'key2', path: 'path', value: 'bar',
        });
        expect(read).to.have.been.calledOnceWith('secret/path');

        read.restore();
    });

    it('should be able fetch a group of secret from the adapter', async () => {
        const read = sinon.stub(vault, 'read');

        read.returns(Promise.resolve({data: {key: 'baz', key2: 'bar'}}));

        const adapter = getAdapter();

        expect(await adapter.getSecrets({path: 'path'})).to.deep.equal([
            {key: 'key', path: 'path', value: 'baz'},
            {key: 'key2', path: 'path', value: 'bar'},
        ]);
        expect(read).to.have.been.calledOnceWith('secret/path');

        read.restore();
    });

    it('should be able to add a secret', async () => {
        const read  = sinon.stub(vault, 'read');
        const write = sinon.stub(vault, 'write');

        read.returns(Promise.reject());

        const adapter = getAdapter();

        await adapter.putSecret({path: 'path', key: 'key', value: 'baz'});
        expect(read).to.have.been.calledOnceWith('secret/path');
        expect(write).to.have.been.calledOnceWith('secret/path', {key: 'baz'});

        read.restore();
        write.restore();
    });

    it('should be able to update a secret', async () => {
        const read  = sinon.stub(vault, 'read');
        const write = sinon.stub(vault, 'write');

        read.returns(Promise.resolve({data: {key: 'baz'}}));

        const adapter = getAdapter();

        await adapter.putSecret({path: 'path', key: 'key2', value: 'bar'});
        expect(read).to.have.been.calledOnceWith('secret/path');
        expect(write).to.have.been.calledOnceWith('secret/path', {key: 'baz', key2: 'bar'});

        read.restore();
        write.restore();
    });

    it('should be able to add multiple secrets', async () => {
        const read  = sinon.stub(vault, 'read');
        const write = sinon.stub(vault, 'write');

        read.returns(Promise.reject());

        const adapter = getAdapter();

        await adapter.putSecrets({secrets: [{path: 'path', key: 'key', value: 'baz'}]});
        expect(read).to.have.been.calledOnceWith('secret/path');
        expect(write).to.have.been.calledOnceWith('secret/path', {key: 'baz'});

        read.restore();
        write.restore();
    });

    it('should be able to update multiple secrets', async () => {
        const read  = sinon.stub(vault, 'read');
        const write = sinon.stub(vault, 'write');

        read.returns(Promise.resolve({data: {key: 'baz'}}));

        const adapter = getAdapter();

        await adapter.putSecrets({secrets: [{path: 'path', key: 'key2', value: 'bar'}]});
        expect(read).to.have.been.calledOnceWith('secret/path');
        expect(write).to.have.been.calledOnceWith('secret/path', {key: 'baz', key2: 'bar'});

        read.restore();
        write.restore();
    });
});
