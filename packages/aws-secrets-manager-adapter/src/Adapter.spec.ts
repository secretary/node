import * as AWS from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';
import {expect, use} from 'chai';
import 'mocha';
import * as sinonChai from 'sinon-chai';

import Adapter from './Adapter';

use(sinonChai);

const getAdapter: any = () => {
    return new Adapter({versionId: 'a', versionStage: 'b', client: new AWS.SecretsManager({})});
};

describe('src/Secretary.ts', () => {
    it('should be able to construct', () => {
        expect(getAdapter()).to.be.instanceOf(Adapter);
    });

    it('should be able fetch a single secret from the adapter', async () => {
        AWSMock.mock('SecretsManager', 'getSecretValue', ({SecretId}) => {
            expect(SecretId).to.equal('path');

            return Promise.resolve({SecretString: JSON.stringify({key: 'baz', key2: 'bar'})});
        });

        const adapter = getAdapter();

        expect(await adapter.getSecret({key: 'key', path: 'path'})).to.deep.equal({
            key: 'key', path: 'path', value: 'baz',
        });
        expect(await adapter.getSecret({key: 'key2', path: 'path'})).to.deep.equal({
            key: 'key2', path: 'path', value: 'bar',
        });

        AWSMock.restore();
    });

    it('should be able fetch a group of secret from the adapter', async () => {
        AWSMock.mock('SecretsManager', 'getSecretValue', ({SecretId}) => {
            expect(SecretId).to.equal('path');

            return Promise.resolve({SecretString: JSON.stringify({key: 'baz', key2: 'bar'})});
        });

        const adapter = getAdapter();

        expect(await adapter.getSecrets({path: 'path'})).to.deep.equal([
            {key: 'key', path: 'path', value: 'baz'},
            {key: 'key2', path: 'path', value: 'bar'},
        ]);

        AWSMock.restore();
    });

    it('should be able to add a secret', async () => {
        AWSMock.mock('SecretsManager', 'getSecretValue', ({SecretId}) => {
            expect(SecretId).to.equal('path');

            return Promise.reject();
        });
        AWSMock.mock('SecretsManager', 'createSecret', ({Name, SecretString}) => {
            expect(Name).to.equal('path');
            expect(JSON.parse(SecretString)).to.deep.equal({key: 'baz'});

            return Promise.resolve();
        });

        const adapter = getAdapter();

        await adapter.putSecret({
            path:        'path',
            key:         'key',
            value:       'baz',
            KmsKeyId:    'a',
            Description: 'test',
            Tags:        {foo: 'bar'},
        });

        AWSMock.restore();
    });

    it('should be able to update a secret', async () => {
        AWSMock.mock('SecretsManager', 'getSecretValue', ({SecretId}) => {
            expect(SecretId).to.equal('path');

            return Promise.resolve({SecretString: JSON.stringify({key: 'baz'})});
        });
        AWSMock.mock('SecretsManager', 'updateSecret', ({SecretId, SecretString}) => {
            expect(SecretId).to.equal('path');
            expect(JSON.parse(SecretString)).to.deep.equal({key: 'baz', key2: 'bar'});

            return Promise.resolve();
        });

        const adapter = getAdapter();

        await adapter.putSecret({
            path:        'path',
            key:         'key2',
            value:       'bar',
            KmsKeyId:    'a',
            Description: 'test',
        });

        AWSMock.restore();
    });

    it('should be able to add multiple secrets', async () => {
        AWSMock.mock('SecretsManager', 'getSecretValue', ({SecretId}) => {
            expect(SecretId).to.equal('path');

            return Promise.reject();
        });
        AWSMock.mock('SecretsManager', 'createSecret', ({Name, SecretString}) => {
            expect(Name).to.equal('path');
            expect(JSON.parse(SecretString)).to.deep.equal({key: 'baz'});

            return Promise.resolve();
        });

        const adapter = getAdapter();

        await adapter.putSecrets({secrets: [{path: 'path', key: 'key', value: 'baz'}]});

        AWSMock.restore();
    });

    it('should be able to update multiple secrets', async () => {
        AWSMock.mock('SecretsManager', 'getSecretValue', ({SecretId}) => {
            expect(SecretId).to.equal('path');

            return Promise.resolve({SecretString: JSON.stringify({key: 'baz'})});
        });
        AWSMock.mock('SecretsManager', 'updateSecret', ({SecretId, SecretString}) => {
            expect(SecretId).to.equal('path');
            expect(JSON.parse(SecretString)).to.deep.equal({key: 'baz', key2: 'bar'});

            return Promise.resolve();
        });

        const adapter = getAdapter();

        await adapter.putSecrets({secrets: [{path: 'path', key: 'key2', value: 'bar'}]});

        AWSMock.restore();
    });
});
