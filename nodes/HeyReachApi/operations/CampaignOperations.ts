import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import {
	heyReachApiRequest,
	heyReachApiRequestAllItems,
	validateCampaignStatus,
	validateLinkedInProfileUrl,
	validateCustomFieldName
} from '../../generic.functions';
import { Campaign, AccountLeadPair, CustomUserField } from '../types/common';

/**
 * Campaign operations for HeyReach API
 */
export class CampaignOperations {
	/**
	 * Get a single campaign by ID
	 */
	static async get(context: IExecuteFunctions, itemIndex: number): Promise<Campaign> {
		const campaignId = this.getCampaignId(context, itemIndex);

		const response = await heyReachApiRequest.call(
			context,
			'GET',
			`/campaign/GetById?campaignId=${campaignId}`
		);

		// The GetById endpoint returns campaign data directly in response.data
		// (not wrapped in an items array like GetAll does)
		if (response && typeof response === 'object') {
			return response as Campaign;
		}

		throw new NodeOperationError(
			context.getNode(),
			`Campaign with ID ${campaignId} not found`,
			{ itemIndex }
		);
	}

	/**
	 * Get many campaigns with pagination support
	 */
	static async getMany(context: IExecuteFunctions, itemIndex: number): Promise<Campaign[]> {
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as any;

		// Validate limit doesn't exceed 100
		if (limit > 100) {
			throw new NodeOperationError(
				context.getNode(),
				'Limit cannot exceed 100. HeyReach API has a maximum limit of 100.',
				{ itemIndex }
			);
		}

		// Build request body
		const body: any = {
			offset: 0,
			limit: returnAll ? 100 : limit,
		};

		// Add optional filters
		if (additionalFields.keyword) {
			body.keyword = additionalFields.keyword;
		}

		if (additionalFields.statuses && additionalFields.statuses.length > 0) {
			body.statuses = additionalFields.statuses;
		}

		if (additionalFields.accountIds) {
			// Parse comma-separated account IDs
			const accountIds = additionalFields.accountIds
				.split(',')
				.map((id: string) => parseInt(id.trim(), 10))
				.filter((id: number) => !isNaN(id));

			if (accountIds.length > 0) {
				body.accountIds = accountIds;
			}
		}

		if (returnAll) {
			const campaigns = await heyReachApiRequestAllItems.call(
				context,
				'POST',
				'/campaign/GetAll',
				body
			);
			return campaigns;
		} else {
			const response = await heyReachApiRequest.call(
				context,
				'POST',
				'/campaign/GetAll',
				body
			);
			return response.items || [];
		}
	}

	/**
	 * Pause a campaign
	 * Note: HeyReach API sometimes returns 400 "You cannot pause an inactive campaign"
	 * but still successfully pauses the campaign. We handle this inconsistency.
	 */
	static async pause(context: IExecuteFunctions, itemIndex: number): Promise<Campaign> {
		const campaignId = this.getCampaignId(context, itemIndex);

		try {
			const response = await heyReachApiRequest.call(
				context,
				'POST',
				`/campaign/Pause?campaignId=${campaignId}`
			);

			// Check if response has the expected structure
			if (response && typeof response === 'object') {
				// If response has items array, use first item
				if (response.items && Array.isArray(response.items) && response.items.length > 0) {
					return response.items[0];
				}
				// If response is the campaign object itself
				if (response.id) {
					return response;
				}
			}

			// Fallback: return basic campaign info
			return { id: campaignId, status: 'PAUSED' } as Campaign;

		} catch (error: any) {
			// Handle the specific HeyReach API inconsistency
			if (error.message && error.message.includes('You cannot pause an inactive campaign')) {
				console.log(`⚠️  HeyReach API returned pause error, but checking if campaign was actually paused...`);

				try {
					// Check the current campaign status
					const currentCampaign = await this.get(context, itemIndex);

					if (currentCampaign.status === 'PAUSED') {
						console.log(`✅ Campaign ${campaignId} was successfully paused despite API error`);
						return currentCampaign;
					} else {
						console.log(`❌ Campaign ${campaignId} was not paused. Current status: ${currentCampaign.status}`);
						// Re-throw the original error since the campaign wasn't actually paused
						throw error;
					}
				} catch (statusCheckError) {
					console.log(`❌ Failed to verify campaign status after pause error:`, statusCheckError);
					// Re-throw the original pause error
					throw error;
				}
			}

			// For any other errors, re-throw them
			throw error;
		}
	}

	/**
	 * Resume a campaign
	 * Note: HeyReach API might have similar inconsistencies as pause operation
	 */
	static async resume(context: IExecuteFunctions, itemIndex: number): Promise<Campaign> {
		const campaignId = this.getCampaignId(context, itemIndex);

		try {
			const response = await heyReachApiRequest.call(
				context,
				'POST',
				`/campaign/Resume?campaignId=${campaignId}`
			);

			// Check if response has the expected structure
			if (response && typeof response === 'object') {
				// If response has items array, use first item
				if (response.items && Array.isArray(response.items) && response.items.length > 0) {
					return response.items[0];
				}
				// If response is the campaign object itself
				if (response.id) {
					return response;
				}
			}

			// Fallback: return basic campaign info
			return { id: campaignId, status: 'IN_PROGRESS' } as Campaign;

		} catch (error: any) {
			// Handle potential HeyReach API inconsistencies for resume as well
			if (error.message && (error.message.includes('cannot resume') || error.message.includes('inactive campaign'))) {
				console.log(`⚠️  HeyReach API returned resume error, but checking if campaign was actually resumed...`);

				try {
					// Check the current campaign status
					const currentCampaign = await this.get(context, itemIndex);

					if (currentCampaign.status === 'IN_PROGRESS') {
						console.log(`✅ Campaign ${campaignId} was successfully resumed despite API error`);
						return currentCampaign;
					} else {
						console.log(`❌ Campaign ${campaignId} was not resumed. Current status: ${currentCampaign.status}`);
						// Re-throw the original error since the campaign wasn't actually resumed
						throw error;
					}
				} catch (statusCheckError) {
					console.log(`❌ Failed to verify campaign status after resume error:`, statusCheckError);
					// Re-throw the original resume error
					throw error;
				}
			}

			// For any other errors, re-throw them
			throw error;
		}
	}

	/**
	 * Add leads to a campaign
	 */
	static async addLeads(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const campaignId = this.getCampaignId(context, itemIndex);
		const leadsInputMode = context.getNodeParameter('leadsInputMode', itemIndex) as string;

		// First, validate the campaign status
		const campaign = await this.get(context, itemIndex);
		validateCampaignStatus(campaign, 'add leads');

		let accountLeadPairs: AccountLeadPair[] = [];

		if (leadsInputMode === 'single') {
			// Single lead input
			const profileUrl = context.getNodeParameter('profileUrl', itemIndex) as string;
			const firstName = context.getNodeParameter('firstName', itemIndex) as string;
			const lastName = context.getNodeParameter('lastName', itemIndex) as string;
			const additionalLeadFields = context.getNodeParameter('additionalLeadFields', itemIndex, {}) as any;

			// Validate LinkedIn profile URL
			if (!validateLinkedInProfileUrl(profileUrl)) {
				throw new NodeOperationError(
					context.getNode(),
					'Invalid LinkedIn profile URL format. Please use format: https://www.linkedin.com/in/username',
					{ itemIndex }
				);
			}

			// Build lead object
			const lead: any = {
				profileUrl,
				firstName,
				lastName,
			};

			// Add optional fields
			if (additionalLeadFields.location) lead.location = additionalLeadFields.location;
			if (additionalLeadFields.companyName) lead.companyName = additionalLeadFields.companyName;
			if (additionalLeadFields.position) lead.position = additionalLeadFields.position;
			if (additionalLeadFields.summary) lead.summary = additionalLeadFields.summary;
			if (additionalLeadFields.about) lead.about = additionalLeadFields.about;
			if (additionalLeadFields.emailAddress) lead.emailAddress = additionalLeadFields.emailAddress;

			// Handle custom fields
			if (additionalLeadFields.customUserFields && additionalLeadFields.customUserFields.field) {
				const customFields: CustomUserField[] = [];
				for (const field of additionalLeadFields.customUserFields.field) {
					if (field.name && field.value) {
						// Validate custom field name format
						if (!validateCustomFieldName(field.name)) {
							throw new NodeOperationError(
								context.getNode(),
								`Invalid custom field name "${field.name}". Name must contain only alphanumeric characters and underscores.`,
								{ itemIndex }
							);
						}
						customFields.push({
							name: field.name,
							value: field.value,
						});
					}
				}
				if (customFields.length > 0) {
					lead.customUserFields = customFields;
				}
			}

			// Create account lead pair
			const accountLeadPair: AccountLeadPair = { lead };
			if (additionalLeadFields.linkedInAccountId) {
				accountLeadPair.linkedInAccountId = additionalLeadFields.linkedInAccountId;
			}

			accountLeadPairs = [accountLeadPair];
		} else {
			// JSON input mode
			const leadsJson = context.getNodeParameter('leadsJson', itemIndex) as string;

			try {
				const leadsData = JSON.parse(leadsJson);

				if (!Array.isArray(leadsData)) {
					throw new NodeOperationError(
						context.getNode(),
						'Leads JSON must be an array of lead objects',
						{ itemIndex }
					);
				}

				// Validate and process each lead
				for (const leadData of leadsData) {
					if (!leadData.profileUrl || !leadData.firstName || !leadData.lastName) {
						throw new NodeOperationError(
							context.getNode(),
							'Each lead must have profileUrl, firstName, and lastName',
							{ itemIndex }
						);
					}

					// Validate LinkedIn profile URL
					if (!validateLinkedInProfileUrl(leadData.profileUrl)) {
						throw new NodeOperationError(
							context.getNode(),
							`Invalid LinkedIn profile URL format: ${leadData.profileUrl}`,
							{ itemIndex }
						);
					}

					// Validate custom fields if present
					if (leadData.customUserFields) {
						for (const field of leadData.customUserFields) {
							if (field.name && !validateCustomFieldName(field.name)) {
								throw new NodeOperationError(
									context.getNode(),
									`Invalid custom field name "${field.name}". Name must contain only alphanumeric characters and underscores.`,
									{ itemIndex }
								);
							}
						}
					}

					const accountLeadPair: AccountLeadPair = { lead: leadData };
					if (leadData.linkedInAccountId) {
						accountLeadPair.linkedInAccountId = leadData.linkedInAccountId;
					}

					accountLeadPairs.push(accountLeadPair);
				}
			} catch (error) {
				if (error instanceof NodeOperationError) {
					throw error;
				}
				throw new NodeOperationError(
					context.getNode(),
					`Invalid JSON format: ${error.message}`,
					{ itemIndex }
				);
			}
		}

		// Validate we have leads to add
		if (accountLeadPairs.length === 0) {
			throw new NodeOperationError(
				context.getNode(),
				'No valid leads to add to campaign',
				{ itemIndex }
			);
		}

		// Add leads to campaign using V2 endpoint for better response data
		const response = await heyReachApiRequest.call(
			context,
			'POST',
			'/campaign/AddLeadsToCampaignV2',
			{
				campaignId,
				accountLeadPairs,
			}
		);

		return {
			campaignId,
			campaignName: campaign.name,
			campaignStatus: campaign.status,
			leadsProcessed: accountLeadPairs.length,
			addedLeadsCount: response.addedLeadsCount || 0,
			updatedLeadsCount: response.updatedLeadsCount || 0,
			failedLeadsCount: response.failedLeadsCount || 0,
		};
	}

	/**
	 * Helper method to get campaign ID from resource locator
	 */
	private static getCampaignId(context: IExecuteFunctions, itemIndex: number): number {
		const campaignId = context.getNodeParameter('campaignId', itemIndex) as any;

		if (typeof campaignId === 'object' && campaignId.value) {
			return parseInt(campaignId.value, 10);
		}

		if (typeof campaignId === 'number') {
			return campaignId;
		}

		if (typeof campaignId === 'string') {
			const parsed = parseInt(campaignId, 10);
			if (isNaN(parsed)) {
				throw new NodeOperationError(
					context.getNode(),
					`Invalid campaign ID: ${campaignId}`,
					{ itemIndex }
				);
			}
			return parsed;
		}

		throw new NodeOperationError(
			context.getNode(),
			'Campaign ID is required',
			{ itemIndex }
		);
	}
}
