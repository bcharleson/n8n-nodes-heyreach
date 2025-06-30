import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { heyReachApiRequest, heyReachApiRequestAllItems, validateLinkedInProfileUrl, getLinkedInUrlValidationError } from '../../generic.functions';
import { Lead } from '../types/common';

/**
 * Lead operations for HeyReach API
 */
export class LeadOperations {
	/**
	 * Get lead details by profile URL
	 */
	static async get(context: IExecuteFunctions, itemIndex: number): Promise<Lead> {
		const startTime = Date.now();
		console.log('🚀 LeadOperations.get() - Starting execution at:', new Date().toISOString());

		const profileUrl = context.getNodeParameter('profileUrl', itemIndex) as string;

		// Debug: Log what we received
		console.log('📝 LeadOperations.get() - profileUrl parameter:', JSON.stringify(profileUrl));
		console.log('📝 LeadOperations.get() - profileUrl type:', typeof profileUrl);
		console.log('📝 LeadOperations.get() - profileUrl length:', profileUrl?.length);

		// Check if profileUrl is undefined or empty
		if (!profileUrl || profileUrl.trim() === '') {
			throw new NodeOperationError(
				context.getNode(),
				'LinkedIn Profile URL is required but was not provided',
				{ itemIndex }
			);
		}

		// Validate LinkedIn profile URL
		const validationStartTime = Date.now();
		if (!validateLinkedInProfileUrl(profileUrl)) {
			const errorMessage = getLinkedInUrlValidationError(profileUrl);
			throw new NodeOperationError(
				context.getNode(),
				errorMessage,
				{ itemIndex }
			);
		}
		console.log('✅ LeadOperations.get() - URL validation took:', Date.now() - validationStartTime, 'ms');

		// Debug: Log the API request details
		console.log('🌐 LeadOperations.get() - About to make API request');
		console.log('🌐 LeadOperations.get() - Endpoint: POST /lead/GetLead');
		console.log('🌐 LeadOperations.get() - Request body:', JSON.stringify({ profileUrl }, null, 2));
		console.log('🌐 LeadOperations.get() - Request starting at:', new Date().toISOString());

		const apiStartTime = Date.now();

		try {
			const response = await heyReachApiRequest.call(
				context,
				'POST',
				'/lead/GetLead',
				{
					profileUrl,
				}
			);

			const apiEndTime = Date.now();
			const totalTime = apiEndTime - startTime;
			const apiTime = apiEndTime - apiStartTime;

			console.log('✅ LeadOperations.get() - API request completed successfully');
			console.log('⏱️  LeadOperations.get() - API request took:', apiTime, 'ms');
			console.log('⏱️  LeadOperations.get() - Total operation took:', totalTime, 'ms');
			console.log('📦 LeadOperations.get() - Response received:', JSON.stringify(response, null, 2));

			return response;
		} catch (error) {
			const apiEndTime = Date.now();
			const totalTime = apiEndTime - startTime;
			const apiTime = apiEndTime - apiStartTime;

			console.error('❌ LeadOperations.get() - API request failed');
			console.error('⏱️  LeadOperations.get() - Failed API request took:', apiTime, 'ms');
			console.error('⏱️  LeadOperations.get() - Total operation took:', totalTime, 'ms');
			console.error('💥 LeadOperations.get() - Error details:', error);

			throw error;
		}
	}

	/**
	 * Add tags to a lead
	 */
	static async addTags(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const profileUrl = context.getNodeParameter('profileUrl', itemIndex) as string;
		const tagsInput = context.getNodeParameter('tags', itemIndex) as string;
		const createTagIfNotExisting = context.getNodeParameter('createTagIfNotExisting', itemIndex, true) as boolean;

		// Validate LinkedIn profile URL
		if (!validateLinkedInProfileUrl(profileUrl)) {
			throw new NodeOperationError(
				context.getNode(),
				'Invalid LinkedIn profile URL format. Please use format: https://www.linkedin.com/in/username',
				{ itemIndex }
			);
		}

		// Parse tags from comma-separated string
		const tags = tagsInput
			.split(',')
			.map(tag => tag.trim())
			.filter(tag => tag.length > 0);

		if (tags.length === 0) {
			throw new NodeOperationError(
				context.getNode(),
				'At least one tag is required',
				{ itemIndex }
			);
		}

		const response = await heyReachApiRequest.call(
			context,
			'POST',
			'/lead/AddTags',
			{
				leadProfileUrl: profileUrl,
				tags,
				createTagIfNotExisting,
			}
		);

		return {
			profileUrl,
			tagsAdded: tags,
			newAssignedTags: response.newAssignedTags || [],
			createTagIfNotExisting,
		};
	}

	/**
	 * Get tags for a lead
	 */
	static async getTags(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const profileUrl = context.getNodeParameter('profileUrl', itemIndex) as string;

		// Validate LinkedIn profile URL
		if (!validateLinkedInProfileUrl(profileUrl)) {
			throw new NodeOperationError(
				context.getNode(),
				'Invalid LinkedIn profile URL format. Please use format: https://www.linkedin.com/in/username',
				{ itemIndex }
			);
		}

		const response = await heyReachApiRequest.call(
			context,
			'POST',
			'/lead/GetTags',
			{
				profileUrl,
			}
		);

		return {
			profileUrl,
			tags: response.tags || [],
		};
	}

	/**
	 * Replace tags for a lead
	 */
	static async replaceTags(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const profileUrl = context.getNodeParameter('profileUrl', itemIndex) as string;
		const tagsInput = context.getNodeParameter('tags', itemIndex) as string;
		const createTagIfNotExisting = context.getNodeParameter('createTagIfNotExisting', itemIndex, true) as boolean;

		// Validate LinkedIn profile URL
		if (!validateLinkedInProfileUrl(profileUrl)) {
			throw new NodeOperationError(
				context.getNode(),
				'Invalid LinkedIn profile URL format. Please use format: https://www.linkedin.com/in/username',
				{ itemIndex }
			);
		}

		// Parse tags from comma-separated string
		const tags = tagsInput
			.split(',')
			.map(tag => tag.trim())
			.filter(tag => tag.length > 0);

		if (tags.length === 0) {
			throw new NodeOperationError(
				context.getNode(),
				'At least one tag is required',
				{ itemIndex }
			);
		}

		const response = await heyReachApiRequest.call(
			context,
			'POST',
			'/lead/ReplaceTags',
			{
				leadProfileUrl: profileUrl,
				tags,
				createTagIfNotExisting,
			}
		);

		return {
			profileUrl,
			newAssignedTags: response.newAssignedTags || [],
		};
	}

	/**
	 * Get leads from a campaign with automatic pagination
	 */
	static async getLeadsFromCampaign(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const campaignId = this.getCampaignId(context, itemIndex);
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 100) as number;
		const timeFrom = context.getNodeParameter('timeFrom', itemIndex, '') as string;
		const timeTo = context.getNodeParameter('timeTo', itemIndex, '') as string;
		const timeFilter = context.getNodeParameter('timeFilter', itemIndex, 'Everywhere') as string;

		// Validate limit doesn't exceed reasonable bounds for manual limits
		if (!returnAll && limit > 10000) {
			throw new NodeOperationError(
				context.getNode(),
				'Limit cannot exceed 10,000. For larger datasets, use "Return All" option.',
				{ itemIndex }
			);
		}

		// Build base request body with time filters
		const baseRequestBody: any = {
			campaignId,
		};

		// Add time filters if provided
		if (timeFrom) {
			baseRequestBody.timeFrom = timeFrom;
		}
		if (timeTo) {
			baseRequestBody.timeTo = timeTo;
		}
		if (timeFilter !== 'Everywhere') {
			baseRequestBody.timeFilter = timeFilter;
		}

		if (returnAll) {
			// Use the existing pagination utility for getting all items
			const requestBody = {
				...baseRequestBody,
				offset: 0,
				limit: 100, // Use API maximum for returnAll
			};

			const leads = await heyReachApiRequestAllItems.call(
				context,
				'POST',
				'/campaign/GetLeadsFromCampaign',
				requestBody
			);
			return leads;
		} else if (limit <= 100) {
			// Single request for limits within API bounds
			const requestBody = {
				...baseRequestBody,
				offset: 0,
				limit: limit, // Use exact user limit, not Math.min
			};

			// Debug: Log the request being sent
			console.log('HeyReach API Request Body:', JSON.stringify(requestBody, null, 2));

			const response = await heyReachApiRequest.call(
				context,
				'POST',
				'/campaign/GetLeadsFromCampaign',
				requestBody
			);

			// Debug: Log the response summary
			const items = response.items || [];
			console.log(`HeyReach API Response: ${items.length} items returned`);

			return items;
		} else {
			// Custom pagination for limits > 100 but <= 10000
			const allLeads: any[] = [];
			let offset = 0;
			let remainingLimit = limit;
			const batchSize = 100; // API maximum per request

			while (remainingLimit > 0) {
				const currentBatchSize = Math.min(remainingLimit, batchSize);

				const currentRequestBody = {
					...baseRequestBody,
					offset,
					limit: currentBatchSize,
				};

				const response = await heyReachApiRequest.call(
					context,
					'POST',
					'/campaign/GetLeadsFromCampaign',
					currentRequestBody
				);

				const leads = response.items || [];
				allLeads.push(...leads);

				// Update counters
				remainingLimit -= leads.length;
				offset += leads.length;

				// If we got fewer leads than requested, we've reached the end
				if (leads.length < currentBatchSize) {
					break;
				}

				// Safety check: don't exceed user's requested limit
				if (allLeads.length >= limit) {
					break;
				}
			}

			// Ensure we don't return more than the user requested
			return allLeads.slice(0, limit);
		}
	}

	/**
	 * Get campaigns for a lead
	 */
	static async getCampaignsForLead(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const offset = context.getNodeParameter('offset', itemIndex, 0) as number;
		const limit = context.getNodeParameter('limit', itemIndex, 100) as number;

		// Get lead identifiers from individual parameters (simpler than fixedCollection)
		const profileUrl = context.getNodeParameter('leadProfileUrl', itemIndex, '') as string;
		const email = context.getNodeParameter('leadEmail', itemIndex, '') as string;
		const linkedinId = context.getNodeParameter('leadLinkedinId', itemIndex, '') as string;

		// Debug logging
		console.log('getCampaignsForLead() - Individual parameters:', { profileUrl, email, linkedinId, offset, limit });

		// At least one identifier is required
		if (!profileUrl && !email && !linkedinId) {
			throw new NodeOperationError(
				context.getNode(),
				'At least one identifier is required: Profile URL, Email, or LinkedIn ID',
				{ itemIndex }
			);
		}

		// Validate LinkedIn profile URL if provided
		if (profileUrl && !validateLinkedInProfileUrl(profileUrl)) {
			throw new NodeOperationError(
				context.getNode(),
				'Invalid LinkedIn profile URL format. Please use format: https://www.linkedin.com/in/username',
				{ itemIndex }
			);
		}

		const requestBody: any = {
			offset,
			limit,
		};

		if (profileUrl) requestBody.profileUrl = profileUrl;
		if (email) requestBody.email = email;
		if (linkedinId) requestBody.linkedinId = linkedinId;

		const response = await heyReachApiRequest.call(
			context,
			'POST',
			'/campaign/GetCampaignsForLead',
			requestBody
		);

		// Return array for n8n UI display
		return response.items || [];
	}

	/**
	 * Stop a lead in a campaign
	 */
	static async stopLeadInCampaign(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const campaignId = this.getCampaignId(context, itemIndex);
		const leadMemberId = context.getNodeParameter('leadMemberId', itemIndex, '') as string;
		const leadUrl = context.getNodeParameter('leadUrl', itemIndex, '') as string;

		// At least one identifier is required
		if (!leadMemberId && !leadUrl) {
			throw new NodeOperationError(
				context.getNode(),
				'Either Lead Member ID or Lead URL is required',
				{ itemIndex }
			);
		}

		// Validate LinkedIn profile URL if provided
		if (leadUrl && !validateLinkedInProfileUrl(leadUrl)) {
			throw new NodeOperationError(
				context.getNode(),
				'Invalid LinkedIn profile URL format. Please use format: https://www.linkedin.com/in/username',
				{ itemIndex }
			);
		}

		const requestBody: any = {
			campaignId,
		};

		if (leadMemberId) requestBody.leadMemberId = leadMemberId;
		if (leadUrl) requestBody.leadUrl = leadUrl;

		await heyReachApiRequest.call(
			context,
			'POST',
			'/campaign/StopLeadInCampaign',
			requestBody
		);

		return {
			success: true,
			message: 'Lead stopped in campaign successfully',
			campaignId,
			leadMemberId: leadMemberId || null,
			leadUrl: leadUrl || null,
		};
	}

	/**
	 * Get leads from a list
	 */
	static async getLeadsFromList(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const listId = this.getListId(context, itemIndex);
		const offset = context.getNodeParameter('offset', itemIndex, 0) as number;
		const limit = context.getNodeParameter('limit', itemIndex, 100) as number;
		const keyword = context.getNodeParameter('keyword', itemIndex, '') as string;

		const requestBody: any = {
			listId,
			offset,
			limit,
		};

		if (keyword) {
			requestBody.keyword = keyword;
		}

		const response = await heyReachApiRequest.call(
			context,
			'POST',
			'/list/GetLeadsFromList',
			requestBody
		);

		// Return array for n8n UI display
		return response.items || [];
	}

	/**
	 * Get lists for a lead
	 */
	static async getListsForLead(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const offset = context.getNodeParameter('offset', itemIndex, 0) as number;
		const limit = context.getNodeParameter('limit', itemIndex, 100) as number;

		// Get lead identifiers from individual parameters (simpler than fixedCollection)
		const profileUrl = context.getNodeParameter('leadProfileUrl', itemIndex, '') as string;
		const email = context.getNodeParameter('leadEmail', itemIndex, '') as string;
		const linkedinId = context.getNodeParameter('leadLinkedinId', itemIndex, '') as string;

		// At least one identifier is required
		if (!profileUrl && !email && !linkedinId) {
			throw new NodeOperationError(
				context.getNode(),
				'At least one identifier is required: Profile URL, Email, or LinkedIn ID',
				{ itemIndex }
			);
		}

		// Validate LinkedIn profile URL if provided
		if (profileUrl && !validateLinkedInProfileUrl(profileUrl)) {
			throw new NodeOperationError(
				context.getNode(),
				'Invalid LinkedIn profile URL format. Please use format: https://www.linkedin.com/in/username',
				{ itemIndex }
			);
		}

		const requestBody: any = {
			offset,
			limit,
		};

		if (profileUrl) requestBody.profileUrl = profileUrl;
		if (email) requestBody.email = email;
		if (linkedinId) requestBody.linkedinId = linkedinId;

		const response = await heyReachApiRequest.call(
			context,
			'POST',
			'/list/GetListsForLead',
			requestBody
		);

		// Return array for n8n UI display
		return response.items || [];
	}

	/**
	 * Delete leads from a list by profile URLs
	 */
	static async deleteLeadsFromList(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const listId = this.getListId(context, itemIndex);
		const profileUrlsInput = context.getNodeParameter('profileUrls', itemIndex) as string;

		// Parse profile URLs from comma-separated string or newline-separated
		const profileUrls = profileUrlsInput
			.split(/[,\n]/)
			.map(url => url.trim())
			.filter(url => url.length > 0);

		if (profileUrls.length === 0) {
			throw new NodeOperationError(
				context.getNode(),
				'At least one LinkedIn profile URL is required',
				{ itemIndex }
			);
		}

		// Validate all LinkedIn profile URLs
		for (const profileUrl of profileUrls) {
			if (!validateLinkedInProfileUrl(profileUrl)) {
				throw new NodeOperationError(
					context.getNode(),
					`Invalid LinkedIn profile URL format: ${profileUrl}. Please use format: https://www.linkedin.com/in/username`,
					{ itemIndex }
				);
			}
		}

		const response = await heyReachApiRequest.call(
			context,
			'DELETE',
			'/list/DeleteLeadsFromListByProfileUrl',
			{
				listId,
				profileUrls,
			}
		);

		return {
			success: true,
			message: `Processed ${profileUrls.length} profile URLs for deletion`,
			listId,
			processedUrls: profileUrls.length,
			notFoundInList: response.notFoundInList || [],
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

	/**
	 * Helper method to get list ID from resource locator
	 */
	private static getListId(context: IExecuteFunctions, itemIndex: number): number {
		const listId = context.getNodeParameter('listId', itemIndex) as any;

		if (typeof listId === 'object' && listId.value) {
			return parseInt(listId.value, 10);
		}

		if (typeof listId === 'number') {
			return listId;
		}

		if (typeof listId === 'string') {
			const parsed = parseInt(listId, 10);
			if (isNaN(parsed)) {
				throw new NodeOperationError(
					context.getNode(),
					`Invalid list ID: ${listId}`,
					{ itemIndex }
				);
			}
			return parsed;
		}

		throw new NodeOperationError(
			context.getNode(),
			'List ID is required',
			{ itemIndex }
		);
	}
}
