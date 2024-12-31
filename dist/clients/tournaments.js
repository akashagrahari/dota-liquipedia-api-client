"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentClient = void 0;
const node_html_parser_1 = require("node-html-parser");
const tournaments_1 = require("../interfaces/tournaments");
class TournamentClient {
    constructor(requestClient) {
        this.requestClient = requestClient;
    }
    getTournaments() {
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
    getUpcomingTournaments() {
        return new Promise((resolve, reject) => {
            this.getTournaments().then(tournamentsMap => {
                resolve(tournamentsMap.get(tournaments_1.TournamentStatus.Upcoming));
            }).catch(reason => {
                reject(reason);
            });
        });
    }
    getOngoingTournaments() {
        return new Promise((resolve, reject) => {
            this.getTournaments().then(tournamentsMap => {
                resolve(tournamentsMap.get(tournaments_1.TournamentStatus.Ongoing));
            }).catch(reason => {
                reject(reason);
            });
        });
    }
    _removeExtraSpaces(input) {
        return input.replace(/\s+/g, ' ').trim();
    }
    _getTournamentObject(tournamentBox, status) {
        var _a, _b, _c, _d;
        const tournamentRows = tournamentBox.querySelectorAll('.gridRow');
        const tournaments = [];
        for (const tournamentRow of tournamentRows) {
            const typesBox = tournamentRow.querySelectorAll('.Tier > span > a');
            const type = this._removeExtraSpaces(typesBox[typesBox.length - 1].innerHTML);
            const subType = typesBox.length == 2 ? this._removeExtraSpaces(typesBox[0].innerHTML) : undefined;
            const tournamentName = (_a = tournamentRow.querySelector('.Tournament > a')) === null || _a === void 0 ? void 0 : _a.innerHTML.replace(/\s+/g, ' ').trim();
            const dates = (_b = tournamentRow.querySelector('.Date')) === null || _b === void 0 ? void 0 : _b.innerHTML.replace(/\s+/g, ' ').trim();
            const prizePool = (_c = tournamentRow.querySelector('.Prize')) === null || _c === void 0 ? void 0 : _c.innerHTML.replace(/\s+/g, ' ').trim();
            const participants = (_d = tournamentRow.querySelector('.PlayerNumber > span')) === null || _d === void 0 ? void 0 : _d.innerHTML.replace(/\s+/g, ' ').trim();
            if (!type || !tournamentName) {
                continue;
            }
            const tournament = {
                name: tournamentName,
                type: type,
                subtype: subType,
                prizePool: prizePool,
                dates: dates,
                participantCount: participants,
                status: status,
            };
            tournaments.push(tournament);
        }
        return tournaments;
    }
    _parseTournaments(response) {
        const result = new Map();
        const htmlRoot = (0, node_html_parser_1.parse)(response.parse.text['*']);
        const tournamentDetailBoxes = htmlRoot.querySelectorAll('.tournamentCard');
        const upcomingBox = tournamentDetailBoxes[0];
        const ongoingBox = tournamentDetailBoxes[1];
        result.set(tournaments_1.TournamentStatus.Ongoing, this._getTournamentObject(ongoingBox, tournaments_1.TournamentStatus.Ongoing));
        result.set(tournaments_1.TournamentStatus.Upcoming, this._getTournamentObject(upcomingBox, tournaments_1.TournamentStatus.Upcoming));
        return result;
    }
}
exports.TournamentClient = TournamentClient;
