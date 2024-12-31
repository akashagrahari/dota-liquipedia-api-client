export type IMatchTeam = {
    name: string;
    shortName?: string;
    currentScore?: number;
};
export declare enum MatchStatus {
    Upcoming = "Upcoming",
    Live = "Live",
    Completed = "Completed"
}
export type IMatch = {
    homeTeam: IMatchTeam;
    awayTeam: IMatchTeam;
    bestOf: number;
    status: MatchStatus;
    startTime?: Date;
    twitchStream?: string;
    youtubeStream?: string;
    tournamentName?: string;
};
export interface IMatchClient {
    getMatches(): Promise<Array<IMatch>>;
    getUpcomingMatches(): Promise<Array<IMatch>>;
    getLiveMatches(): Promise<Array<IMatch>>;
}
