"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamClient = void 0;
const node_html_parser_1 = require("node-html-parser");
class TeamClient {
    constructor(requestClient) {
        this.requestClient = requestClient;
    }
    getTeam(teamName) {
        return new Promise((resolve, reject) => {
            const encodedTeamName = teamName.replace(/ /g, '_');
            this.requestClient.get({
                url: `https://liquipedia.net/dota2/api.php?action=parse&origin=*&format=json&page=${encodedTeamName}`
            }).then((response) => {
                const team = this._parseTeam(response);
                resolve(team);
            }).catch(reason => {
                reject(reason);
            });
        });
    }
    _parseTeam(response) {
        var _a, _b, _c, _d, _e, _f;
        const htmlRoot = (0, node_html_parser_1.parse)(response.parse.text['*']);
        let teamRegion = '';
        let teamCaptain;
        const teamDetails = htmlRoot.querySelectorAll('.infobox-description');
        for (const detail of teamDetails) {
            const detailLabel = detail.innerText;
            const detailValue = (_a = detail.nextElementSibling.querySelector(':scope > a')) === null || _a === void 0 ? void 0 : _a.innerText;
            if (detailLabel == 'Region:') {
                teamRegion = detailValue || '';
            }
            else if (detailLabel == 'Team Captain:') {
                teamCaptain = detailValue;
            }
        }
        const rosterRoot = (_b = htmlRoot.querySelector('.table-responsive > .wikitable-striped.roster-card')) === null || _b === void 0 ? void 0 : _b.querySelectorAll('tr.Player');
        const roster = [];
        if (rosterRoot) {
            for (const memberRoot of rosterRoot) {
                const nickname = (_c = memberRoot.querySelector('.ID #player a')) === null || _c === void 0 ? void 0 : _c.innerText;
                const fullName = (_d = memberRoot.querySelector('.Name')) === null || _d === void 0 ? void 0 : _d.innerText;
                const date = (_e = memberRoot.querySelector('div.Date')) === null || _e === void 0 ? void 0 : _e.innerText;
                const position = (_f = memberRoot.querySelector('.PositionWoTeam2')) === null || _f === void 0 ? void 0 : _f.innerText;
                roster.push({
                    nickname: nickname || '',
                    fullName: fullName ? this._cleanupName(fullName) : '',
                    joinDate: date ? new Date(Date.parse(date.substring(0, 10))) : new Date(),
                    position: position || ''
                });
            }
        }
        return {
            name: response.parse.displaytitle,
            region: teamRegion,
            roster,
            captain: teamCaptain
        };
    }
    _cleanupName(fullName) {
        const cleanedUp = /\((.+)\)/.exec(fullName);
        return cleanedUp ? cleanedUp[1] : fullName;
    }
}
exports.TeamClient = TeamClient;
