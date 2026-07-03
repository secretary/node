import {SSM} from '@aws-sdk/client-ssm';
import AdapterTest from '@secretary/core/dist/AdapterTest';
import {use} from 'chai';
import 'mocha';
import * as sinonChai from 'sinon-chai';
import * as TypeMoq from 'typemoq';
import Adapter from './Adapter';

const {isValue} = TypeMoq.It;

use(sinonChai);

const mock = TypeMoq.Mock.ofInstance(new SSM({}), TypeMoq.MockBehavior.Strict);

const getAdapter: any = () => new Adapter(mock.object);

beforeEach(() => mock.reset());
afterEach(() => mock.verifyAll());

const param = (value?: any): any => (value === undefined ? {} : {Parameter: {Value: value}});

const reject = (): any => {
    const err: any = new Error('ParameterNotFound');
    err.name = 'ParameterNotFound';
    err.__type = 'ParameterNotFound';

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
                .setup((x) => x.getParameter(isValue({Name: exp[0][0], WithDecryption: true}), TypeMoq.It.isAny()))
                .returns(() => param(exp[0][1].value));
            mock
                .setup((x) => x.getParameter(isValue({Name: exp[1][0], WithDecryption: true}), TypeMoq.It.isAny()))
                .returns(() => param(JSON.stringify(exp[1][1].value)));
            mock
                .setup((x) => x.getParameter(isValue({Name: exp[2][0], WithDecryption: true}), TypeMoq.It.isAny()))
                .returns(() => reject());
        },
        putSecret: (_: Adapter, exp: any[]) => {
            mock
                .setup((x) => x.putParameter(isValue({
                    Name:      exp[0][0].key,
                    Value:     exp[0][0].value,
                    Type:      'SecureString',
                    Overwrite: true,
                })))
                .returns(() => param({}));
            mock
                .setup((x) => x.putParameter(isValue({
                    Name:      exp[1][0].key,
                    Value:     exp[1][0].value,
                    Type:      'SecureString',
                    Overwrite: true,
                })))
                .returns(() => param({}));
            mock
                .setup((x) => x.putParameter(isValue({
                    Name:      exp[1][0].key,
                    Value:     exp[1][1],
                    Type:      'SecureString',
                    Overwrite: true,
                })))
                .returns(() => param({}));
        },
        deleteSecret: (_: Adapter, exp: any[]) => {
            mock
                .setup((x) => x.putParameter(isValue({
                    Name:      exp[0][0].key,
                    Value:     exp[0][0].value,
                    Type:      'SecureString',
                    Overwrite: true,
                })))
                .returns(() => param({}));
            mock
                .setup((x) => x.deleteParameter(isValue({Name: exp[0][0].key})))
                .returns(() => param({}))
                .verifiable(TypeMoq.Times.exactly(2));
            mock
                .setup((x) => x.getParameter(isValue({Name: exp[0][0].key, WithDecryption: true})))
                .returns(() => reject());
            mock
                .setup((x) => x.deleteParameter(isValue({Name: exp[0][0].key})))
                .returns(() => reject())
                .verifiable(TypeMoq.Times.exactly(2));
        },
    },
);
