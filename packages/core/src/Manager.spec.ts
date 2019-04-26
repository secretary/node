import {expect, use} from 'chai';
import 'mocha';
import * as sinonChai from 'sinon-chai';
import sinon from 'ts-sinon';

import {AdapterInterface, Manager, Secret} from './';

use(sinonChai);

const getManager = (adapter?: AdapterInterface) => new Manager(adapter);

describe('src/Secretary.ts', () => {
    it('should be able to construct', () => {
        expect(getManager()).to.be.instanceOf(Manager);
    });

    it('should be able fetch a secret from an adapter', async () => {
        const adapter = sinon.spy();
        const manager = getManager(adapter as any);

        // @todo Finish test
    });

    it('should be able to add a secret', async () => {
        const adapter = sinon.spy();
        const manager = getManager(adapter as any);

        // @todo Finish test
    });

    it('should be able to delete a secret', async () => {
        const adapter = sinon.spy();
        const manager = getManager(adapter as any);

        // @todo Finish test
    });
});
