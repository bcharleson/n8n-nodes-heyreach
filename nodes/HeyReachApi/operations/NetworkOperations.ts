import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { heyReachApiRequest, heyReachApiRequestAllItems } from '../../generic.functions';
import { MyNetworkProfile } from '../types/common';

/**
 * Network operations for HeyReach API
 */
export class NetworkOperations {
	/**
	 * Get LinkedIn network for specific sender
	 */
	static async getForSender(context: IExecuteFunctions, itemIndex: number): Promise<MyNetworkProfile[]> {
		const linkedInAccountId = context.getNodeParameter('linkedInAccountId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as any;

		// Validate LinkedIn account ID
		const accountId = parseInt(linkedInAccountId, 10);
		if (isNaN(accountId)) {
			throw new NodeOperationError(
				context.getNode(),
				`Invalid LinkedIn account ID: ${linkedInAccountId}`,
				{ itemIndex }
			);
		}

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
			linkedInAccountId: accountId,
			offset: 0,
			limit: returnAll ? 100 : limit,
		};

		// Add filtering options
		if (additionalFields.searchKeyword) {
			body.searchKeyword = additionalFields.searchKeyword.trim();
		}

		if (additionalFields.companyFilter) {
			body.companyFilter = additionalFields.companyFilter.trim();
		}

		if (additionalFields.locationFilter) {
			body.locationFilter = additionalFields.locationFilter.trim();
		}

		if (additionalFields.connectionLevel && additionalFields.connectionLevel !== 'all') {
			body.connectionLevel = additionalFields.connectionLevel;
		}

		if (additionalFields.includeProfileDetails !== undefined) {
			body.includeProfileDetails = additionalFields.includeProfileDetails;
		}

		if (additionalFields.includeContactInfo !== undefined) {
			body.includeContactInfo = additionalFields.includeContactInfo;
		}

		if (additionalFields.minConnections) {
			const minConnections = parseInt(additionalFields.minConnections, 10);
			if (!isNaN(minConnections) && minConnections > 0) {
				body.minConnections = minConnections;
			}
		}

		if (additionalFields.maxConnections) {
			const maxConnections = parseInt(additionalFields.maxConnections, 10);
			if (!isNaN(maxConnections) && maxConnections > 0) {
				body.maxConnections = maxConnections;
			}
		}

		// Validate min/max connections range
		if (body.minConnections && body.maxConnections && body.minConnections > body.maxConnections) {
			throw new NodeOperationError(
				context.getNode(),
				'Minimum connections cannot be greater than maximum connections',
				{ itemIndex }
			);
		}

		try {
			if (returnAll) {
				const networkProfiles = await heyReachApiRequestAllItems.call(
					context,
					'POST',
					'/network/GetMyNetworkForSender',
					body
				);
				return this.processNetworkProfiles(networkProfiles, additionalFields);
			} else {
				const response = await heyReachApiRequest.call(
					context,
					'POST',
					'/network/GetMyNetworkForSender',
					body
				);
				const networkProfiles = response.items || [];
				return this.processNetworkProfiles(networkProfiles, additionalFields);
			}
		} catch (error: any) {
			// Handle network-specific errors
			if (error.response?.status === 400) {
				throw new NodeOperationError(
					context.getNode(),
					'Invalid LinkedIn account ID or filter parameters. Please check your input values.',
					{ itemIndex }
				);
			}
			if (error.response?.status === 403) {
				throw new NodeOperationError(
					context.getNode(),
					'Access denied. The LinkedIn account may not have permission to access network data or may not be properly authenticated.',
					{ itemIndex }
				);
			}
			throw error;
		}
	}

	/**
	 * Process network profiles with additional computed fields
	 */
	private static processNetworkProfiles(profiles: MyNetworkProfile[], additionalFields: any): MyNetworkProfile[] {
		if (!profiles || profiles.length === 0) {
			return [];
		}

		let processedProfiles = [...profiles];

		// Additional client-side filtering if needed
		if (additionalFields.minConnections || additionalFields.maxConnections) {
			processedProfiles = processedProfiles.filter(profile => {
				const connections = profile.connections || 0;

				if (additionalFields.minConnections && connections < additionalFields.minConnections) {
					return false;
				}

				if (additionalFields.maxConnections && connections > additionalFields.maxConnections) {
					return false;
				}

				return true;
			});
		}

		// Sort profiles by connection count (highest first) for better relevance
		processedProfiles.sort((a, b) => {
			const connectionsA = a.connections || 0;
			const connectionsB = b.connections || 0;
			return connectionsB - connectionsA;
		});

		// Add computed fields for better usability
		return processedProfiles.map(profile => ({
			...profile,
			// Add computed fields
			fullName: `${profile.firstName} ${profile.lastName}`.trim(),
			hasEmail: Boolean(profile.emailAddress),
			hasCompany: Boolean(profile.companyName),
			hasLocation: Boolean(profile.location),
			connectionLevel: this.determineConnectionLevel(profile.connections || 0),
			profileCompleteness: this.calculateProfileCompleteness(profile),
		}));
	}

	/**
	 * Determine connection level based on connection count
	 */
	private static determineConnectionLevel(connections: number): string {
		if (connections >= 500) return 'Influencer (500+)';
		if (connections >= 100) return 'Well Connected (100-499)';
		if (connections >= 50) return 'Active (50-99)';
		if (connections >= 10) return 'Growing (10-49)';
		return 'New (0-9)';
	}

	/**
	 * Calculate profile completeness score
	 */
	private static calculateProfileCompleteness(profile: MyNetworkProfile): number {
		let score = 0;
		const fields = [
			'firstName', 'lastName', 'headline', 'location',
			'companyName', 'position', 'about', 'emailAddress'
		];

		fields.forEach(field => {
			if (profile[field as keyof MyNetworkProfile]) {
				score += 1;
			}
		});

		return Math.round((score / fields.length) * 100);
	}
}
