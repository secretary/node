import PutSinglePathOptionsInterface from './PutSinglePathOptionsInterface';

export default interface PutMultiplePathOptionsInterface {
    secrets: PutSinglePathOptionsInterface[];
    [key: string]: any;
}
