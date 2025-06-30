"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeyReachApi = void 0;
class HeyReachApi {
    constructor() {
        this.name = 'heyReachApi';
        this.displayName = 'HeyReach API';
        this.documentationUrl = 'https://documenter.getpostman.com/view/23808049/2sA2xb5F75';
        this.properties = [
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
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'X-API-KEY': '={{$credentials.apiKey}}',
                },
            },
        };
    }
}
exports.HeyReachApi = HeyReachApi;
//# sourceMappingURL=HeyReachApi.credentials.js.map