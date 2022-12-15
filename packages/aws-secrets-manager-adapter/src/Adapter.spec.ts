import {SecretsManager} from '@aws-sdk/client-secrets-manager';
import AdapterTest from '@secretary/core/dist/AdapterTest';
import {use} from 'chai';
import 'mocha';
import * as sinonChai from 'sinon-chai';
import * as TypeMoq from 'typemoq';
import Adapter from './Adapter';

const {isValue} = TypeMoq.It;

use(sinonChai);

const mock = TypeMoq.Mock.ofInstance(new SecretsManager({}), TypeMoq.MockBehavior.Strict);

const getAdapter: any = () => new Adapter(mock.object);

beforeEach(() => mock.reset());
afterEach(() => mock.verifyAll());

const response = (data?: any): any => {
    if (typeof data === 'string') {
        data = {SecretString: data};
    }

    return data;
};

const reject = (): any => {
    const err: any = new Error();
    err.code = 'ResourceNotFoundException';

    throw err;
};

AdapterTest(
    'src/Adapter.ts',
    getAdapter,
    {
        constructor: (_) => {
        },
        getSecret: (_: Adapter, exp: any[]) => {
            mock
                .setup((x) => x.getSecretValue(isValue({SecretId: exp[0][0]}), TypeMoq.It.isAny()))
                .returns(() => response(exp[0][1].value));
            mock
                .setup((x) => x.getSecretValue(isValue({SecretId: exp[1][0]}), TypeMoq.It.isAny()))
                .returns(() => response(JSON.stringify(exp[1][1].value)));
            mock
                .setup((x) => x.getSecretValue(isValue({SecretId: exp[2][0]}), TypeMoq.It.isAny()))
                .returns(() => reject());

        },
        putSecret: (_: Adapter, exp: any[]) => {
            mock
                .setup((x) => x.updateSecret(isValue({SecretId: exp[0][0].key, SecretString: exp[0][0].value})))
                .returns(() => reject());
            mock
                .setup((x) => x.createSecret(isValue({Name: exp[0][0].key, SecretString: exp[0][0].value})))
                .returns(() => response({}));
            mock
                .setup((x) => x.updateSecret(isValue({SecretId: exp[1][0].key, SecretString: exp[1][0].value})))
                .returns(() => reject());
            mock
                .setup((x) => x.createSecret(isValue({Name: exp[1][0].key, SecretString: exp[1][0].value})))
                .returns(() => response({}));
            mock
                .setup((x) => x.updateSecret(isValue({SecretId: exp[1][0].key, SecretString: exp[1][1]})))
                .returns(() => response({}));
        },
        deleteSecret: (_: Adapter, exp: any[]) => {
            mock
                .setup((x) => x.createSecret(isValue({Name: exp[0][0].key, SecretString: exp[0][0].value})))
                .returns(() => response({}));

            mock
                .setup((x) => x.deleteSecret(isValue({SecretId: exp[0][0].key})))
                .returns(() => response({}))
                .verifiable(TypeMoq.Times.exactly(2));

            mock
                .setup((x) => x.getSecretValue(isValue({SecretId: exp[0][0].key})))
                .returns(() => reject());

            mock
                .setup((x) => x.deleteSecret(isValue({SecretId: exp[0][0].key})))
                .returns(() => reject())
                .verifiable(TypeMoq.Times.exactly(2));
        },
    },
);
