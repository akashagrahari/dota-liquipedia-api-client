export enum TournamentStatus {
    Upcoming,
    Ongoing,
}

export type ITournament = {
    name: string;
    type: string;
    subtype?: string;
    prizePool?: string;
    dates?: string;
    participantCount?: string;
    status: TournamentStatus;
    // winner?: string;
    // runnerUp?: string;
}

export interface ITournamentClient {
    getTournaments(): Promise<Map<TournamentStatus, ITournament[]>>;
    getUpcomingTournaments(): Promise<undefined | Array<ITournament>>;
    getOngoingTournaments(): Promise<undefined | Array<ITournament>>;
}