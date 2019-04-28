import {AdapterTest} from '@secretary/core';
import {KeyVaultClient} from 'azure-keyvault';
import {use} from 'chai';
import 'mocha';
import {ApplicationTokenCredentials} from 'ms-rest-azure';
import * as sinonChai from 'sinon-chai';
import * as TypeMoq from 'typemoq';

const {isValue} = TypeMoq.It;

import Adapter from './Adapter';

use(sinonChai);

const credentials = TypeMoq.Mock.ofType<ApplicationTokenCredentials>();
const mock        = TypeMoq.Mock.ofInstance(new KeyVaultClient(credentials.object), TypeMoq.MockBehavior.Strict);

const getAdapter: any = () => new Adapter(mock.object, '');

beforeEach(() => mock.reset());
afterEach(() => mock.verifyAll());

const reject = (): any => Promise.reject();

AdapterTest(
    'src/Adapter.ts',
    getAdapter,
    {
        constructor:  (_) => {
        },
        getSecret:    (_: Adapter, exp: any[]) => {
            mock
                .setup((x) => x.getSecret('', isValue(exp[0][0]), TypeMoq.It.isAny()))
                .returns(() => Promise.resolve({id: exp[0][1].key, value: exp[0][1].value}));

            mock
                .setup((x) => x.getSecret('', isValue(exp[1][0]), TypeMoq.It.isAny()))
                .returns(() => Promise.resolve({id: exp[1][1].key, value: exp[1][1].value}));

            mock
                .setup((x) => x.getSecret('', isValue(exp[2][0]), TypeMoq.It.isAny()))
                .returns(() => reject());

        },
        putSecret:    (_: Adapter, exp: any[]) => {
            mock
                .setup((x) => x.setSecret('', isValue(exp[0][0].key), isValue(exp[0][0].value), TypeMoq.It.isAny()))
                .returns(() => Promise.resolve({id: exp[0][0].key, value: exp[0][0].value}));

            mock
                .setup((x) => x.setSecret('', isValue(exp[1][0].key), isValue(exp[1][0].value), TypeMoq.It.isAny()))
                .returns(() => Promise.resolve({id: exp[1][0].key, value: exp[1][0].value}));

            mock
                .setup((x) => x.setSecret('', isValue(exp[1][0].key), isValue(exp[1][1]), TypeMoq.It.isAny()))
                .returns(() => Promise.resolve({id: exp[1][0].key, value: exp[1][1]}));
        },
        deleteSecret: (_: Adapter, exp: any[]) => {
            mock
                .setup((x) => x.setSecret('', isValue(exp[0][0].key), isValue(exp[0][0].value), TypeMoq.It.isAny()))
                .returns(() => Promise.resolve({id: exp[0][0].key, value: exp[0][0].value}));

            mock
                .setup((x) => x.deleteSecret('', isValue(exp[0][0].key), TypeMoq.It.isAny()))
                .returns(() => Promise.resolve({}))
                .verifiable(TypeMoq.Times.exactly(2));

            mock
                .setup((x) => x.getSecret('', isValue(exp[0][0].key), TypeMoq.It.isAny()))
                .returns(() => reject());

            mock
                .setup((x) => x.deleteSecret('', isValue(exp[0][0].key), TypeMoq.It.isAny()))
                .returns(() => reject())
                .verifiable(TypeMoq.Times.exactly(2));
        },
    },
);
