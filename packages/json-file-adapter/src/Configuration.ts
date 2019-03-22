import {ConfigurationInterface} from '@secretary/core';

export default interface Configuration extends ConfigurationInterface {
    /** Specifies the location of the JSON file */
    file: string;
}
