import * as fs from 'fs';
import { parse } from 'node-html-parser';
import { ITournament, ITournamentClient, TournamentStatus } from '../interfaces/tournaments';
import IRequestClient, { IResponse } from '../interfaces/request';
import { HTMLElement } from 'node-html-parser';

/**
 * Client for retrieving Tournament data specifically
 * @class TournamentClient
 */
export class TournamentClient implements ITournamentClient {
    private requestClient: IRequestClient;

    /**
     * Create a new TournamentClient
     * @param requestClient Instance of a type of IRequestClient this will use to retrieve data from Liquipedia
     */
    constructor(requestClient: IRequestClient) {
        this.requestClient = requestClient;
    }

    /**
     * Get all tournaments
     * @returns A Promise, if successful will contain an array of ITournamemt objects with all details
     */
    getTournaments(): Promise<Map<TournamentStatus, ITournament[]>> {
        return new Promise((resolve, reject) => {
            this.requestClient.get({
                url: `https://liquipedia.net/dota2/api.php?action=parse&origin=*&format=json&page=Portal:Tournaments`
            }).then(response => {
                const tournaments = this._parseTournaments(response);
                resolve(tournaments);
            }).catch(reason => {
                reject(reason);
            });
        });
    }

    getUpcomingTournaments(): Promise<undefined | ITournament[]> {
        return new Promise((resolve, reject) => {
            this.getTournaments().then(tournamentsMap => {
                resolve(tournamentsMap.get(TournamentStatus.Upcoming));
            }).catch(reason => {
                reject(reason);
            });
        });
    }
    getOngoingTournaments(): Promise<undefined | ITournament[]> {
        return new Promise((resolve, reject) => {
            this.getTournaments().then(tournamentsMap => {
                resolve(tournamentsMap.get(TournamentStatus.Ongoing));
            }).catch(reason => {
                reject(reason);
            });
        });
    }

    // move to utils
    private _removeExtraSpaces(input: string): string {
        return input.replace(/\s+/g, ' ').trim();
    }

    private _getTournamentObject(tournamentBox: HTMLElement, status: TournamentStatus): ITournament[] {
        const tournamentRows = tournamentBox.querySelectorAll('.gridRow');

        const tournaments: ITournament[] = [];
        for (const tournamentRow of tournamentRows) {
            const typesBox = tournamentRow.querySelectorAll('.Tier > span > a');
            const type = this._removeExtraSpaces(typesBox[typesBox.length - 1].innerHTML);
            const subType = typesBox.length == 2 ? this._removeExtraSpaces(typesBox[0].innerHTML) : undefined;
            const tournamentName = tournamentRow.querySelector('.Tournament > a')?.innerHTML.replace(/\s+/g, ' ').trim();
            const dates = tournamentRow.querySelector('.Date')?.innerHTML.replace(/\s+/g, ' ').trim();
            const prizePool = tournamentRow.querySelector('.Prize')?.innerHTML.replace(/\s+/g, ' ').trim();
            const participants = tournamentRow.querySelector('.PlayerNumber > span')?.innerHTML.replace(/\s+/g, ' ').trim();

            if (!type || !tournamentName) {
                continue;
            }

            const tournament: ITournament = {
                name: tournamentName,
                type: type,
                subtype: subType,
                prizePool: prizePool,
                dates: dates,
                participantCount: participants,
                status: status,
            };
            // console.log(tournament);
            tournaments.push(tournament);
        }
        return tournaments;
    }

    private _parseTournaments(response: IResponse): Map<TournamentStatus, ITournament[]> {
        // const htmlRoot = parse(response.parse.text['*']);
        const result = new Map<TournamentStatus, ITournament[]>();
        const htmlRoot = parse(response.parse.text['*']);
        const tournamentDetailBoxes = htmlRoot.querySelectorAll('.tournamentCard');
        const upcomingBox = tournamentDetailBoxes[0];
        const ongoingBox = tournamentDetailBoxes[1];

        result.set(TournamentStatus.Ongoing, this._getTournamentObject(ongoingBox, TournamentStatus.Ongoing));
        result.set(TournamentStatus.Upcoming, this._getTournamentObject(upcomingBox, TournamentStatus.Upcoming));

        return result;
    }


}