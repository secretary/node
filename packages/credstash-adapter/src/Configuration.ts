import {ConfigurationInterface} from '@secretary/core';
import Credstash from 'nodecredstash';

export default interface Configuration extends ConfigurationInterface {
    client: Credstash;
}
