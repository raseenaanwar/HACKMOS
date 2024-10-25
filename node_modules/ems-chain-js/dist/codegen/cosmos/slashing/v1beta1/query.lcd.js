"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LCDQueryClient = void 0;
const helpers_1 = require("../../../helpers");
class LCDQueryClient {
    req;
    constructor({ requestClient }) {
        this.req = requestClient;
        this.params = this.params.bind(this);
        this.signingInfo = this.signingInfo.bind(this);
        this.signingInfos = this.signingInfos.bind(this);
    }
    /* Params queries the parameters of slashing module */
    async params(_params = {}) {
        const endpoint = `cosmos/slashing/v1beta1/params`;
        return await this.req.get(endpoint);
    }
    /* SigningInfo queries the signing info of given cons address */
    async signingInfo(params) {
        const endpoint = `cosmos/slashing/v1beta1/signing_infos/${params.consAddress}`;
        return await this.req.get(endpoint);
    }
    /* SigningInfos queries signing info of all validators */
    async signingInfos(params = {
        pagination: undefined
    }) {
        const options = {
            params: {}
        };
        if (typeof params?.pagination !== "undefined") {
            (0, helpers_1.setPaginationParams)(options, params.pagination);
        }
        const endpoint = `cosmos/slashing/v1beta1/signing_infos`;
        return await this.req.get(endpoint, options);
    }
}
exports.LCDQueryClient = LCDQueryClient;
//# sourceMappingURL=query.lcd.js.map