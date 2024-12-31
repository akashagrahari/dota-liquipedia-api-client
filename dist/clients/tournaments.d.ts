import { ITournament, ITournamentClient, TournamentStatus } from '../interfaces/tournaments';
import IRequestClient from '../interfaces/request';
export declare class TournamentClient implements ITournamentClient {
    private requestClient;
    constructor(requestClient: IRequestClient);
    getTournaments(): Promise<Map<TournamentStatus, ITournament[]>>;
    getUpcomingTournaments(): Promise<undefined | ITournament[]>;
    getOngoingTournaments(): Promise<undefined | ITournament[]>;
    private _removeExtraSpaces;
    private _getTournamentObject;
    private _parseTournaments;
}
