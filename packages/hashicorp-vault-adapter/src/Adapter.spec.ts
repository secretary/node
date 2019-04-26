import {AdapterTest} from '@secretary/core';
import {use} from 'chai';
import 'mocha';
import * as nodeVault from 'node-vault';
import * as sinonChai from 'sinon-chai';
import * as TypeMoq from 'typemoq';

import Adapter from './Adapter';

use(sinonChai);

const mock = TypeMoq.Mock.ofInstance(nodeVault(), TypeMoq.MockBehavior.Strict);

const getAdapter = () => {
    return new Adapter({client: mock.object});
};

afterEach(() => mock.verifyAll());

AdapterTest(
    'src/Adapter.ts',
    getAdapter,
    {
        constructor:  (_) => {
            mock.reset();
        },
        getSecret:    (_: Adapter, expected: any[]) => {
            mock.reset();
            mock
                .setup((x) => x.read(TypeMoq.It.isValue('secret/' + expected[0][0]), TypeMoq.It.isAny()))
                .returns(() => Promise.resolve({data: expected[0][1].value}));

            mock
                .setup((x) => x.read(TypeMoq.It.isValue('secret/' + expected[1][0]), TypeMoq.It.isAny()))
                .returns(() => Promise.resolve({data: expected[1][1].value}));

            mock
                .setup((x) => x.read(TypeMoq.It.isValue('secret/' + expected[2][0]), TypeMoq.It.isAny()))
                .returns(() => Promise.reject());

        },
        putSecret:    (_: Adapter, expected: any[]) => {
            mock.reset();
            mock
                .setup((x) => x.write(
                    TypeMoq.It.isValue('secret/' + expected[0][0].key),
                    TypeMoq.It.isValue(expected[0][0].value),
                    TypeMoq.It.isAny(),
                ))
                .returns(() => Promise.resolve({data: expected[0][0].value}));

            mock
                .setup((x) => x.write(
                    TypeMoq.It.isValue('secret/' + expected[1][0].key),
                    TypeMoq.It.isValue(expected[1][0].value),
                    TypeMoq.It.isAny(),
                ))
                .returns(() => Promise.resolve({data: expected[1][0].value}));

            mock
                .setup((x) => x.write(
                    TypeMoq.It.isValue('secret/' + expected[1][0].key),
                    TypeMoq.It.isValue(expected[1][1]),
                    TypeMoq.It.isAny(),
                ))
                .returns(() => Promise.resolve({data: expected[1][1]}));
        },
        deleteSecret: (_adapter: Adapter, expected: any[]) => {
            mock.reset();

            mock
                .setup((x) => x.write(
                    TypeMoq.It.isValue('secret/' + expected[0][0].key),
                    TypeMoq.It.isValue(expected[0][0].value),
                    TypeMoq.It.isAny(),
                ))
                .returns(() => Promise.resolve({data: expected[0][0].value}));

            mock
                .setup((x) => x.delete(TypeMoq.It.isValue('secret/' + expected[0][0].key), TypeMoq.It.isAny()))
                .verifiable(TypeMoq.Times.exactly(2));

            mock
                .setup((x) => x.read(TypeMoq.It.isValue('secret/' + expected[0][0].key), TypeMoq.It.isAny()))
                .returns(() => Promise.reject());
            mock
                .setup((x) => x.delete(TypeMoq.It.isValue('secret/' + expected[0][0].key), TypeMoq.It.isAny()))
                .returns(() => Promise.reject())
                .verifiable(TypeMoq.Times.exactly(2));
        },
    },
);
