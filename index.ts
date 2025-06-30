import { INodeTypes, NodeConnectionType } from 'n8n-workflow';

import { HeyReachApi } from './nodes/HeyReachApi/HeyReachApi.node';
import { HeyReachApi as HeyReachApiCredentials } from './credentials/HeyReachApi.credentials';

// This exports the nodes for n8n to load
export const nodeTypes = {
	'heyreach': HeyReachApi,
};

export const credentialTypes = {
	'heyReachApi': HeyReachApiCredentials,
};
