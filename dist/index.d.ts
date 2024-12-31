import { MatchClient } from './clients/matches';
import { TeamClient } from './clients/teams';
import { ITeam } from './interfaces/teams';
import { IMatch } from './interfaces/matches';
import { TournamentClient } from './clients/tournaments';
import { TournamentStatus, ITournament } from './interfaces/tournaments';
export default class DotaLiquipediaClient {
    private requestClient;
    private matchesClient;
    private teamClient;
    private tournamentClient;
    constructor(userAgent: string);
    getTeamByName(teamName: string): Promise<ITeam>;
    getMatches(): Promise<Array<IMatch>>;
    getUpcomingMatches(): Promise<Array<IMatch>>;
    getLiveMatches(): Promise<Array<IMatch>>;
    getCompletedMatches(): Promise<Array<IMatch>>;
    getTournaments(): Promise<Map<TournamentStatus, ITournament[]>>;
    getUpcomingTournaments(): Promise<undefined | ITournament[]>;
}
export { MatchClient, TeamClient, TournamentClient, ITeam, IMatch, ITournament, TournamentStatus };
