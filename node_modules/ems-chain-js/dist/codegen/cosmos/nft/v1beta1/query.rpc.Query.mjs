import { BinaryReader } from "../../../binary";
import { createProtobufRpcClient } from "@cosmjs/stargate";
import { QueryBalanceRequest, QueryBalanceResponse, QueryOwnerRequest, QueryOwnerResponse, QuerySupplyRequest, QuerySupplyResponse, QueryNFTsRequest, QueryNFTsResponse, QueryNFTRequest, QueryNFTResponse, QueryClassRequest, QueryClassResponse, QueryClassesRequest, QueryClassesResponse } from "./query";
export class QueryClientImpl {
    rpc;
    constructor(rpc) {
        this.rpc = rpc;
        this.balance = this.balance.bind(this);
        this.owner = this.owner.bind(this);
        this.supply = this.supply.bind(this);
        this.nFTs = this.nFTs.bind(this);
        this.nFT = this.nFT.bind(this);
        this.class = this.class.bind(this);
        this.classes = this.classes.bind(this);
    }
    balance(request) {
        const data = QueryBalanceRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.nft.v1beta1.Query", "Balance", data);
        return promise.then(data => QueryBalanceResponse.decode(new BinaryReader(data)));
    }
    owner(request) {
        const data = QueryOwnerRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.nft.v1beta1.Query", "Owner", data);
        return promise.then(data => QueryOwnerResponse.decode(new BinaryReader(data)));
    }
    supply(request) {
        const data = QuerySupplyRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.nft.v1beta1.Query", "Supply", data);
        return promise.then(data => QuerySupplyResponse.decode(new BinaryReader(data)));
    }
    nFTs(request) {
        const data = QueryNFTsRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.nft.v1beta1.Query", "NFTs", data);
        return promise.then(data => QueryNFTsResponse.decode(new BinaryReader(data)));
    }
    nFT(request) {
        const data = QueryNFTRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.nft.v1beta1.Query", "NFT", data);
        return promise.then(data => QueryNFTResponse.decode(new BinaryReader(data)));
    }
    class(request) {
        const data = QueryClassRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.nft.v1beta1.Query", "Class", data);
        return promise.then(data => QueryClassResponse.decode(new BinaryReader(data)));
    }
    classes(request = {
        pagination: undefined
    }) {
        const data = QueryClassesRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.nft.v1beta1.Query", "Classes", data);
        return promise.then(data => QueryClassesResponse.decode(new BinaryReader(data)));
    }
}
export const createRpcQueryExtension = (base) => {
    const rpc = createProtobufRpcClient(base);
    const queryService = new QueryClientImpl(rpc);
    return {
        balance(request) {
            return queryService.balance(request);
        },
        owner(request) {
            return queryService.owner(request);
        },
        supply(request) {
            return queryService.supply(request);
        },
        nFTs(request) {
            return queryService.nFTs(request);
        },
        nFT(request) {
            return queryService.nFT(request);
        },
        class(request) {
            return queryService.class(request);
        },
        classes(request) {
            return queryService.classes(request);
        }
    };
};
//# sourceMappingURL=query.rpc.Query.js.map