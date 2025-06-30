import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HeyReachApi implements ICredentialType {
	name = 'heyReachApi';
	displayName = 'HeyReach API';
	documentationUrl = 'https://documenter.getpostman.com/view/23808049/2sA2xb5F75';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your HeyReach API key. You can find this in your HeyReach dashboard under Settings > API Keys.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-KEY': '={{$credentials.apiKey}}',
			},
		},
	};
}
