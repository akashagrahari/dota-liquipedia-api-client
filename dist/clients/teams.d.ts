import IRequestClient from '../interfaces/request';
import { ITeam, ITeamClient } from '../interfaces/teams';
export declare class TeamClient implements ITeamClient {
    private requestClient;
    constructor(requestClient: IRequestClient);
    getTeam(teamName: string): Promise<ITeam>;
    private _parseTeam;
    private _cleanupName;
}
