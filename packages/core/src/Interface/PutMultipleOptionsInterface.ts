import PutSingleOptionsInterface from './PutSingleOptionsInterface';

export default interface PutMultipleOptionsInterface {
    secrets: PutSingleOptionsInterface[];
    [key: string]: any;
}
