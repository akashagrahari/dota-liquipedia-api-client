export declare enum TournamentStatus {
    Upcoming = "Upcoming_Tournaments",
    Ongoing = "Ongoing_Tournaments"
}
export type ITournament = {
    name: string;
    type: string;
    subtype?: string;
    prizePool?: string;
    dates?: string;
    participantCount?: string;
    status: TournamentStatus;
};
export interface ITournamentClient {
    getTournaments(): Promise<Map<TournamentStatus, ITournament[]>>;
    getUpcomingTournaments(): Promise<undefined | Array<ITournament>>;
    getOngoingTournaments(): Promise<undefined | Array<ITournament>>;
}
