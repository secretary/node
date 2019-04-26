import {AdapterTest} from '@secretary/core';
import {use} from 'chai';
import 'mocha';
import * as mockFs from 'mock-fs';
import * as sinonChai from 'sinon-chai';

import Adapter from './Adapter';

use(sinonChai);

const filePath = 'test.json';

const getAdapter = () => {
    return new Adapter({file: filePath});
};

AdapterTest(
    'src/Adapter.ts',
    getAdapter,
    {
        constructor:  () => {
        },
        getSecret:    (_: Adapter, expected: any[]) => {
            mockFs({
                [filePath]: JSON.stringify([expected[0][1], expected[1][1]]),
            });
        },
        putSecret:    () => {
            mockFs({
                [filePath]: '[]',
            });
        },
        deleteSecret: (_adapter: Adapter, _expected: any[]) => {
        },
    },
);
