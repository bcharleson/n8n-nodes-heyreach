"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeyReachApi = void 0;
const generic_functions_1 = require("../generic.functions");
const OperationRouter_1 = require("./operations/OperationRouter");
// Import parameter definitions (will be created in Phase 2)
const CampaignParameters_1 = require("./parameters/CampaignParameters");
const LeadParameters_1 = require("./parameters/LeadParameters");
const ListParameters_1 = require("./parameters/ListParameters");
const AnalyticsParameters_1 = require("./parameters/AnalyticsParameters");
const ConversationParameters_1 = require("./parameters/ConversationParameters");
const NetworkParameters_1 = require("./parameters/NetworkParameters");
/**
 * Main HeyReach API Node
 */
class HeyReachApi {
    constructor() {
        this.description = {
            displayName: 'HeyReach',
            name: 'heyreach',
            icon: 'file:heyreach.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
            description: 'Interact with HeyReach API for LinkedIn automation',
            defaults: {
                name: 'HeyReach',
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            credentials: [
                {
                    name: 'heyReachApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Campaign',
                            value: 'campaign',
                            description: 'Manage LinkedIn automation campaigns',
                        },
                        {
                            name: 'Lead',
                            value: 'lead',
                            description: 'Manage individual leads and prospects',
                        },
                        {
                            name: 'List',
                            value: 'list',
                            description: 'Manage lead and company lists',
                        },
                        {
                            name: 'Analytics',
                            value: 'analytics',
                            description: 'Access campaign performance analytics',
                        },
                        {
                            name: 'Conversation',
                            value: 'conversation',
                            description: 'Manage LinkedIn conversations and inbox',
                        },
                        {
                            name: 'Network',
                            value: 'network',
                            description: 'Access LinkedIn network connections',
                        },
                    ],
                    default: 'campaign',
                },
                // Import all parameter definitions from modular files
                ...CampaignParameters_1.campaignParameters,
                ...LeadParameters_1.leadParameters,
                ...ListParameters_1.listParameters,
                ...AnalyticsParameters_1.analyticsParameters,
                ...ConversationParameters_1.conversationParameters,
                ...NetworkParameters_1.networkParameters,
            ],
        };
        this.methods = {
            listSearch: {
                // Search campaigns for resource locator
                async getCampaigns(filter) {
                    try {
                        const campaigns = await generic_functions_1.heyReachApiRequest.call(this, 'POST', '/campaign/GetAll', {
                            offset: 0,
                            limit: 100,
                        });
                        const results = [];
                        if (campaigns.items && Array.isArray(campaigns.items)) {
                            for (const campaign of campaigns.items) {
                                const name = `${campaign.name} (${campaign.status})`;
                                // Apply filter if provided
                                if (!filter || name.toLowerCase().includes(filter.toLowerCase())) {
                                    results.push({
                                        name,
                                        value: campaign.id.toString(),
                                        description: `Campaign ID: ${campaign.id}, Status: ${campaign.status}`,
                                    });
                                }
                            }
                        }
                        return {
                            results: results.sort((a, b) => a.name.localeCompare(b.name)),
                        };
                    }
                    catch (error) {
                        console.error('Error fetching campaigns for resource locator:', error);
                        return { results: [] };
                    }
                },
                // Search lists for resource locator
                async getLists(filter) {
                    try {
                        const lists = await generic_functions_1.heyReachApiRequest.call(this, 'POST', '/list/GetAll', {
                            offset: 0,
                            limit: 100,
                        });
                        const results = [];
                        if (lists.items && Array.isArray(lists.items)) {
                            for (const list of lists.items) {
                                const name = `${list.name} (${list.totalItemsCount || 0} items)`;
                                // Apply filter if provided
                                if (!filter || name.toLowerCase().includes(filter.toLowerCase())) {
                                    results.push({
                                        name,
                                        value: list.id.toString(),
                                        description: `List ID: ${list.id}, Items: ${list.totalItemsCount || 0}`,
                                    });
                                }
                            }
                        }
                        return {
                            results: results.sort((a, b) => a.name.localeCompare(b.name)),
                        };
                    }
                    catch (error) {
                        console.error('Error fetching lists for resource locator:', error);
                        return { results: [] };
                    }
                },
            },
            loadOptions: {
                // Get campaigns for dropdown selection
                async getCampaigns() {
                    try {
                        const campaigns = await generic_functions_1.heyReachApiRequest.call(this, 'POST', '/campaign/GetAll', {
                            offset: 0,
                            limit: 100,
                        });
                        const campaignOptions = [];
                        if (campaigns.items && Array.isArray(campaigns.items)) {
                            for (const campaign of campaigns.items) {
                                campaignOptions.push({
                                    name: `${campaign.name} (${campaign.status})`,
                                    value: campaign.id,
                                    description: `Campaign ID: ${campaign.id}, Status: ${campaign.status}`,
                                });
                            }
                        }
                        return campaignOptions.sort((a, b) => a.name.localeCompare(b.name));
                    }
                    catch (error) {
                        console.error('Error fetching campaigns for dropdown:', error);
                        return [];
                    }
                },
                // Get lists for dropdown selection
                async getLists() {
                    try {
                        const lists = await generic_functions_1.heyReachApiRequest.call(this, 'POST', '/list/GetAll', {
                            offset: 0,
                            limit: 100,
                        });
                        const listOptions = [];
                        if (lists.items && Array.isArray(lists.items)) {
                            for (const list of lists.items) {
                                listOptions.push({
                                    name: `${list.name} (${list.listType})`,
                                    value: list.id,
                                    description: `List ID: ${list.id}, Type: ${list.listType}, Count: ${list.count || 0}`,
                                });
                            }
                        }
                        return listOptions.sort((a, b) => a.name.localeCompare(b.name));
                    }
                    catch (error) {
                        console.error('Error fetching lists for dropdown:', error);
                        return [];
                    }
                },
            },
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i);
                const operation = this.getNodeParameter('operation', i);
                // Route to appropriate operation handler using the modular system
                const responseData = await OperationRouter_1.OperationRouter.execute(this, i, resource, operation);
                // Handle array responses (like getMany operations) vs single item responses
                let jsonArray;
                if (Array.isArray(responseData)) {
                    // For getMany operations, responseData is already an array of items
                    jsonArray = responseData.map(item => ({ json: item }));
                }
                else {
                    // For single item operations, wrap in array
                    jsonArray = this.helpers.returnJsonArray(responseData);
                }
                const executionData = this.helpers.constructExecutionMetaData(jsonArray, { itemData: { item: i } });
                returnData.push(...executionData);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const executionData = this.helpers.constructExecutionMetaData([{ json: { error: error.message } }], { itemData: { item: i } });
                    returnData.push(...executionData);
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.HeyReachApi = HeyReachApi;
//# sourceMappingURL=HeyReachApi.node.js.map