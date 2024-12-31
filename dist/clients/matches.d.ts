import { IMatch, IMatchClient } from '../interfaces/matches';
import IRequestClient from '../interfaces/request';
export declare class MatchClient implements IMatchClient {
    private requestClient;
    constructor(requestClient: IRequestClient);
    getMatches(): Promise<IMatch[]>;
    getUpcomingMatches(): Promise<IMatch[]>;
    getLiveMatches(): Promise<IMatch[]>;
    getCompletedMatches(): Promise<IMatch[]>;
    private _parseMatches;
}
