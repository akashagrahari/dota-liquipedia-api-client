"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentStatus = exports.TournamentClient = exports.TeamClient = exports.MatchClient = void 0;
const matches_1 = require("./clients/matches");
Object.defineProperty(exports, "MatchClient", { enumerable: true, get: function () { return matches_1.MatchClient; } });
const teams_1 = require("./clients/teams");
Object.defineProperty(exports, "TeamClient", { enumerable: true, get: function () { return teams_1.TeamClient; } });
const axios_request_1 = require("./common/axios_request");
const tournaments_1 = require("./clients/tournaments");
Object.defineProperty(exports, "TournamentClient", { enumerable: true, get: function () { return tournaments_1.TournamentClient; } });
const tournaments_2 = require("./interfaces/tournaments");
Object.defineProperty(exports, "TournamentStatus", { enumerable: true, get: function () { return tournaments_2.TournamentStatus; } });
class DotaLiquipediaClient {
    constructor(userAgent) {
        this.requestClient = new axios_request_1.AxiosRequestClient(userAgent);
        this.matchesClient = new matches_1.MatchClient(this.requestClient);
        this.teamClient = new teams_1.TeamClient(this.requestClient);
        this.tournamentClient = new tournaments_1.TournamentClient(this.requestClient);
    }
    getTeamByName(teamName) {
        return this.teamClient.getTeam(teamName);
    }
    getMatches() {
        return this.matchesClient.getMatches();
    }
    getUpcomingMatches() {
        return this.matchesClient.getUpcomingMatches();
    }
    getLiveMatches() {
        return this.matchesClient.getLiveMatches();
    }
    getCompletedMatches() {
        return this.matchesClient.getCompletedMatches();
    }
    getTournaments() {
        return this.tournamentClient.getTournaments();
    }
    getUpcomingTournaments() {
        return this.tournamentClient.getUpcomingTournaments();
    }
}
exports.default = DotaLiquipediaClient;
