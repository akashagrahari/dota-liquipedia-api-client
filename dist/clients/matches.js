"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchClient = void 0;
const node_html_parser_1 = require("node-html-parser");
const matches_1 = require("../interfaces/matches");
class MatchClient {
    constructor(requestClient) {
        this.requestClient = requestClient;
    }
    getMatches() {
        return new Promise((resolve, reject) => {
            this.requestClient.get({
                url: `https://liquipedia.net/dota2/api.php?action=parse&origin=*&format=json&page=Liquipedia:Upcoming_and_ongoing_matches`
            }).then(response => {
                const matches = this._parseMatches(response);
                resolve(matches);
            }).catch(reason => {
                reject(reason);
            });
        });
    }
    getUpcomingMatches() {
        return new Promise((resolve, reject) => {
            this.getMatches().then(matches => {
                resolve(matches.filter(match => match.status == matches_1.MatchStatus.Upcoming));
            }).catch(reason => {
                reject(reason);
            });
        });
    }
    getLiveMatches() {
        return new Promise((resolve, reject) => {
            this.getMatches().then(matches => {
                resolve(matches.filter(match => match.status == matches_1.MatchStatus.Live));
            }).catch(reason => {
                reject(reason);
            });
        });
    }
    getCompletedMatches() {
        return new Promise((resolve, reject) => {
            this.getMatches().then(matches => {
                resolve(matches.filter(match => match.status == matches_1.MatchStatus.Completed));
            }).catch(reason => {
                reject(reason);
            });
        });
    }
    _parseMatches(response) {
        var _a, _b, _c, _d, _e;
        const htmlRoot = (0, node_html_parser_1.parse)(response.parse.text['*']);
        const matchDetailBoxes = htmlRoot.querySelectorAll('.infobox_matches_content');
        const matches = [];
        for (const matchDetails of matchDetailBoxes) {
            const homeTeam = matchDetails.querySelector('.team-left > span');
            const homeTeamName = homeTeam === null || homeTeam === void 0 ? void 0 : homeTeam.getAttribute('data-highlightingclass');
            const homeTeamShortName = (_a = homeTeam === null || homeTeam === void 0 ? void 0 : homeTeam.querySelector('a')) === null || _a === void 0 ? void 0 : _a.textContent;
            const awayTeam = matchDetails.querySelector('.team-right > span');
            const awayTeamName = awayTeam === null || awayTeam === void 0 ? void 0 : awayTeam.getAttribute('data-highlightingclass');
            const awayTeamShortName = (_b = awayTeam === null || awayTeam === void 0 ? void 0 : awayTeam.querySelector('a')) === null || _b === void 0 ? void 0 : _b.textContent;
            const bestOf = (_c = matchDetails.querySelector('.versus abbr')) === null || _c === void 0 ? void 0 : _c.textContent;
            const matchTimeContainer = matchDetails.querySelector('.timer-object');
            const matchTime = matchTimeContainer === null || matchTimeContainer === void 0 ? void 0 : matchTimeContainer.getAttribute('data-timestamp');
            const finished = matchTimeContainer === null || matchTimeContainer === void 0 ? void 0 : matchTimeContainer.getAttribute('data-finished');
            const twitchStream = matchTimeContainer === null || matchTimeContainer === void 0 ? void 0 : matchTimeContainer.getAttribute('data-stream-twitch');
            const youtubeStream = matchTimeContainer === null || matchTimeContainer === void 0 ? void 0 : matchTimeContainer.getAttribute('data-stream-youtube');
            const tournamentName = (_d = matchDetails.querySelector('.league-icon-small-image > a')) === null || _d === void 0 ? void 0 : _d.getAttribute('title');
            if (!homeTeamName || !awayTeamName || !bestOf || !matchTime) {
                continue;
            }
            const startTimestamp = parseInt(matchTime) * 1000;
            const startTime = new Date(startTimestamp);
            const match = {
                homeTeam: {
                    name: homeTeamName,
                    shortName: homeTeamShortName
                },
                awayTeam: {
                    name: awayTeamName,
                    shortName: awayTeamShortName
                },
                bestOf: parseInt(bestOf.slice(2)),
                status: matches_1.MatchStatus.Upcoming,
                startTime,
                twitchStream: twitchStream ? `https://twitch.tv/${twitchStream.toLowerCase().replace(/_/g, '')}` : undefined,
                youtubeStream: youtubeStream ? `https://twitch.tv/${youtubeStream.toLowerCase().replace(/_/g, '')}` : undefined,
                tournamentName
            };
            if (startTimestamp < Date.now()) {
                match.status = matches_1.MatchStatus.Live;
                if (finished) {
                    match.status = matches_1.MatchStatus.Completed;
                }
                const score = (_e = matchDetails.querySelector('.versus > div')) === null || _e === void 0 ? void 0 : _e.textContent;
                const scores = score === null || score === void 0 ? void 0 : score.split(':');
                if (scores) {
                    match.homeTeam.currentScore = parseInt(scores[0]);
                    match.awayTeam.currentScore = parseInt(scores[1]);
                }
            }
            matches.push(match);
        }
        return matches;
    }
}
exports.MatchClient = MatchClient;
