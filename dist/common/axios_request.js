"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosRequestClient = void 0;
const axios_1 = require("axios");
class AxiosRequestClient {
    constructor(userAgent) {
        this.userAgent = userAgent;
    }
    get(request) {
        return new Promise((resolve, reject) => {
            var _a, _b;
            axios_1.default.get(request.url, {
                headers: {
                    'Accept-Encoding': ((_a = request.headers) === null || _a === void 0 ? void 0 : _a.acceptEncoding) || 'gzip',
                    'User-Agent': ((_b = request.headers) === null || _b === void 0 ? void 0 : _b.userAgent) || this.userAgent
                }
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    }
}
exports.AxiosRequestClient = AxiosRequestClient;
