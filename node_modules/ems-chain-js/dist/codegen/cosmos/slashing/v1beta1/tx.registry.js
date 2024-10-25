"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageComposer = exports.load = exports.registry = void 0;
const tx_1 = require("./tx");
exports.registry = [["/cosmos.slashing.v1beta1.MsgUnjail", tx_1.MsgUnjail]];
const load = (protoRegistry) => {
    exports.registry.forEach(([typeUrl, mod]) => {
        protoRegistry.register(typeUrl, mod);
    });
};
exports.load = load;
exports.MessageComposer = {
    encoded: {
        unjail(value) {
            return {
                typeUrl: "/cosmos.slashing.v1beta1.MsgUnjail",
                value: tx_1.MsgUnjail.encode(value).finish()
            };
        }
    },
    withTypeUrl: {
        unjail(value) {
            return {
                typeUrl: "/cosmos.slashing.v1beta1.MsgUnjail",
                value
            };
        }
    },
    fromPartial: {
        unjail(value) {
            return {
                typeUrl: "/cosmos.slashing.v1beta1.MsgUnjail",
                value: tx_1.MsgUnjail.fromPartial(value)
            };
        }
    }
};
//# sourceMappingURL=tx.registry.js.map