"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageComposer = exports.load = exports.registry = void 0;
const tx_1 = require("./tx");
exports.registry = [["/cosmos.nft.v1beta1.MsgSend", tx_1.MsgSend]];
const load = (protoRegistry) => {
    exports.registry.forEach(([typeUrl, mod]) => {
        protoRegistry.register(typeUrl, mod);
    });
};
exports.load = load;
exports.MessageComposer = {
    encoded: {
        send(value) {
            return {
                typeUrl: "/cosmos.nft.v1beta1.MsgSend",
                value: tx_1.MsgSend.encode(value).finish()
            };
        }
    },
    withTypeUrl: {
        send(value) {
            return {
                typeUrl: "/cosmos.nft.v1beta1.MsgSend",
                value
            };
        }
    },
    fromPartial: {
        send(value) {
            return {
                typeUrl: "/cosmos.nft.v1beta1.MsgSend",
                value: tx_1.MsgSend.fromPartial(value)
            };
        }
    }
};
//# sourceMappingURL=tx.registry.js.map