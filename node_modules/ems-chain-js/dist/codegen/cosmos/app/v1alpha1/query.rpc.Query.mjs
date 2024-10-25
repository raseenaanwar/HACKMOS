import { BinaryReader } from "../../../binary";
import { createProtobufRpcClient } from "@cosmjs/stargate";
import { QueryConfigRequest, QueryConfigResponse } from "./query";
export class QueryClientImpl {
    rpc;
    constructor(rpc) {
        this.rpc = rpc;
        this.config = this.config.bind(this);
    }
    config(request = {}) {
        const data = QueryConfigRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.app.v1alpha1.Query", "Config", data);
        return promise.then(data => QueryConfigResponse.decode(new BinaryReader(data)));
    }
}
export const createRpcQueryExtension = (base) => {
    const rpc = createProtobufRpcClient(base);
    const queryService = new QueryClientImpl(rpc);
    return {
        config(request) {
            return queryService.config(request);
        }
    };
};
//# sourceMappingURL=query.rpc.Query.js.map