import IRequestClient, { IRequestOptions, IResponse } from '../interfaces/request';
export declare class AxiosRequestClient implements IRequestClient {
    private userAgent;
    constructor(userAgent: string);
    get(request: IRequestOptions): Promise<IResponse>;
}
