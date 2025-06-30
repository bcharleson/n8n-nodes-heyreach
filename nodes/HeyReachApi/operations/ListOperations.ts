import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import {
	heyReachApiRequest,
	heyReachApiRequestAllItems,
	validateLinkedInProfileUrl,
	validateCustomFieldName
} from '../../generic.functions';
import { LeadList, Lead, CustomUserField } from '../types/common';

/**
 * List operations for HeyReach API
 */
export class ListOperations {
	/**
	 * Get many lists with pagination support
	 */
	static async getMany(context: IExecuteFunctions, itemIndex: number): Promise<LeadList[]> {
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

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

		if (returnAll) {
			const lists = await heyReachApiRequestAllItems.call(
				context,
				'POST',
				'/list/GetAll',
				body
			);
			return lists;
		} else {
			const response = await heyReachApiRequest.call(
				context,
				'POST',
				'/list/GetAll',
				body
			);
			return response.items || [];
		}
	}

	/**
	 * Create a new empty list
	 */
	static async create(context: IExecuteFunctions, itemIndex: number): Promise<LeadList> {
		const listName = context.getNodeParameter('listName', itemIndex) as string;
		const listType = context.getNodeParameter('listType', itemIndex, 'USER_LIST') as string;

		if (!listName || listName.trim().length === 0) {
			throw new NodeOperationError(
				context.getNode(),
				'List name is required',
				{ itemIndex }
			);
		}

		const response = await heyReachApiRequest.call(
			context,
			'POST',
			'/list/CreateEmptyList',
			{
				name: listName.trim(),
				type: listType,
			}
		);

		return response;
	}

	/**
	 * Add leads to a list
	 */
	static async addLeads(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const listId = this.getListId(context, itemIndex);
		const leadsInputMode = context.getNodeParameter('leadsInputMode', itemIndex) as string;

		let leads: Lead[] = [];

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

			leads = [lead];
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

					leads.push(leadData);
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
		if (leads.length === 0) {
			throw new NodeOperationError(
				context.getNode(),
				'No valid leads to add to list',
				{ itemIndex }
			);
		}

		// Add leads to list using V2 endpoint for better response data
		const response = await heyReachApiRequest.call(
			context,
			'POST',
			'/list/AddLeadsToListV2',
			{
				listId,
				leads,
			}
		);

		return {
			listId,
			leadsProcessed: leads.length,
			addedLeadsCount: response.addedLeadsCount || 0,
			updatedLeadsCount: response.updatedLeadsCount || 0,
			failedLeadsCount: response.failedLeadsCount || 0,
		};
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
