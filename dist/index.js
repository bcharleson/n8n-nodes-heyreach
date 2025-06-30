"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentialTypes = exports.nodeTypes = void 0;
const HeyReachApi_node_1 = require("./nodes/HeyReachApi/HeyReachApi.node");
const HeyReachApi_credentials_1 = require("./credentials/HeyReachApi.credentials");
// This exports the nodes for n8n to load
exports.nodeTypes = {
    'heyreach': HeyReachApi_node_1.HeyReachApi,
};
exports.credentialTypes = {
    'heyReachApi': HeyReachApi_credentials_1.HeyReachApi,
};
//# sourceMappingURL=index.js.map