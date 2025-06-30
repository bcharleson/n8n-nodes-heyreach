import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeListSearchResult,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	INodeListSearchItems,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import { heyReachApiRequest } from '../generic.functions';
import { OperationRouter } from './operations/OperationRouter';
import { ResourceType, OperationType } from './types/common';

// Import parameter definitions (will be created in Phase 2)
import { campaignParameters } from './parameters/CampaignParameters';
import { leadParameters } from './parameters/LeadParameters';
import { listParameters } from './parameters/ListParameters';
import { analyticsParameters } from './parameters/AnalyticsParameters';
import { conversationParameters } from './parameters/ConversationParameters';
import { networkParameters } from './parameters/NetworkParameters';

/**
 * Main HeyReach API Node
 */
export class HeyReachApi implements INodeType {
	description: INodeTypeDescription = {
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
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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
			...campaignParameters,
			...leadParameters,
			...listParameters,
			...analyticsParameters,
			...conversationParameters,
			...networkParameters,
		],
	};

	methods = {
		listSearch: {
			// Search campaigns for resource locator
			async getCampaigns(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				try {
					const campaigns = await heyReachApiRequest.call(this, 'POST', '/campaign/GetAll', {
						offset: 0,
						limit: 100,
					});

					const results: INodeListSearchItems[] = [];
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
				} catch (error) {
					console.error('Error fetching campaigns for resource locator:', error);
					return { results: [] };
				}
			},

			// Search lists for resource locator
			async getLists(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				try {
					const lists = await heyReachApiRequest.call(this, 'POST', '/list/GetAll', {
						offset: 0,
						limit: 100,
					});

					const results: INodeListSearchItems[] = [];
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
				} catch (error) {
					console.error('Error fetching lists for resource locator:', error);
					return { results: [] };
				}
			},
		},

		loadOptions: {
			// Get campaigns for dropdown selection
			async getCampaigns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const campaigns = await heyReachApiRequest.call(this, 'POST', '/campaign/GetAll', {
						offset: 0,
						limit: 100,
					});

					const campaignOptions: INodePropertyOptions[] = [];
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
				} catch (error) {
					console.error('Error fetching campaigns for dropdown:', error);
					return [];
				}
			},

			// Get lists for dropdown selection
			async getLists(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const lists = await heyReachApiRequest.call(this, 'POST', '/list/GetAll', {
						offset: 0,
						limit: 100,
					});

					const listOptions: INodePropertyOptions[] = [];
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
				} catch (error) {
					console.error('Error fetching lists for dropdown:', error);
					return [];
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as ResourceType;
				const operation = this.getNodeParameter('operation', i) as OperationType;

				// Route to appropriate operation handler using the modular system
				const responseData = await OperationRouter.execute(this, i, resource, operation);

				// Handle array responses (like getMany operations) vs single item responses
				let jsonArray;
				if (Array.isArray(responseData)) {
					// For getMany operations, responseData is already an array of items
					jsonArray = responseData.map(item => ({ json: item }));
				} else {
					// For single item operations, wrap in array
					jsonArray = this.helpers.returnJsonArray(responseData as any);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					jsonArray,
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						[{ json: { error: (error as Error).message } }],
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
