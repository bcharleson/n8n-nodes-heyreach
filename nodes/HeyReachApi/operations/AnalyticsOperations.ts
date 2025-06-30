import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { heyReachApiRequest, formatDateForApi } from '../../generic.functions';
import { OverallStats } from '../types/common';

/**
 * Analytics operations for HeyReach API
 */
export class AnalyticsOperations {
	/**
	 * Get overall campaign statistics
	 */
	static async getOverallStats(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const dateRange = context.getNodeParameter('dateRange', itemIndex) as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as any;

		// Build request body
		const body: any = {};

		// Handle date range filtering
		if (dateRange === 'custom') {
			const startDate = additionalFields.startDate as string;
			const endDate = additionalFields.endDate as string;

			if (!startDate || !endDate) {
				throw new NodeOperationError(
					context.getNode(),
					'Start date and end date are required for custom date range',
					{ itemIndex }
				);
			}

			// Validate date range
			const start = new Date(startDate);
			const end = new Date(endDate);

			if (start >= end) {
				throw new NodeOperationError(
					context.getNode(),
					'Start date must be before end date',
					{ itemIndex }
				);
			}

			body.startDate = formatDateForApi(startDate);
			body.endDate = formatDateForApi(endDate);
		} else if (dateRange !== 'all') {
			// Handle predefined date ranges
			const now = new Date();
			let daysBack = 0;

			switch (dateRange) {
				case 'last7days':
					daysBack = 7;
					break;
				case 'last30days':
					daysBack = 30;
					break;
				case 'last90days':
					daysBack = 90;
					break;
			}

			if (daysBack > 0) {
				const startDate = new Date(now);
				startDate.setDate(now.getDate() - daysBack);

				body.startDate = formatDateForApi(startDate);
				body.endDate = formatDateForApi(now);
			}
		}

		// Add optional filters
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

		if (additionalFields.campaignIds) {
			// Parse comma-separated campaign IDs
			const campaignIds = additionalFields.campaignIds
				.split(',')
				.map((id: string) => parseInt(id.trim(), 10))
				.filter((id: number) => !isNaN(id));

			if (campaignIds.length > 0) {
				body.campaignIds = campaignIds;
			}
		}

		// Include daily breakdown option
		if (additionalFields.includeDailyBreakdown !== undefined) {
			body.includeDailyBreakdown = additionalFields.includeDailyBreakdown;
		}

		try {
			const response = await heyReachApiRequest.call(
				context,
				'POST',
				'/analytics/GetOverallStats',
				body
			);

			// Process and filter metrics if specified
			if (additionalFields.metricsToInclude && additionalFields.metricsToInclude.length > 0) {
				const filteredResponse = this.filterMetrics(response, additionalFields.metricsToInclude);
				return {
					...filteredResponse,
					dateRange,
					filters: {
						accountIds: body.accountIds || [],
						campaignIds: body.campaignIds || [],
						startDate: body.startDate,
						endDate: body.endDate,
					},
				};
			}

			return {
				...response,
				dateRange,
				filters: {
					accountIds: body.accountIds || [],
					campaignIds: body.campaignIds || [],
					startDate: body.startDate,
					endDate: body.endDate,
				},
			};
		} catch (error: any) {
			// Handle analytics-specific errors
			if (error.response?.status === 400) {
				throw new NodeOperationError(
					context.getNode(),
					'Invalid date range or filter parameters. Please check your input values.',
					{ itemIndex }
				);
			}
			throw error;
		}
	}

	/**
	 * Filter metrics based on user selection
	 */
	private static filterMetrics(response: any, metricsToInclude: string[]): any {
		if (!response || !metricsToInclude || metricsToInclude.length === 0) {
			return response;
		}

		const filteredResponse: any = {};

		// Filter overall stats
		if (response.overallStats) {
			filteredResponse.overallStats = {};
			for (const metric of metricsToInclude) {
				if (response.overallStats[metric] !== undefined) {
					filteredResponse.overallStats[metric] = response.overallStats[metric];
				}
			}
		}

		// Filter daily breakdown stats
		if (response.byDayStats && typeof response.byDayStats === 'object') {
			filteredResponse.byDayStats = {};
			for (const [date, dayStats] of Object.entries(response.byDayStats)) {
				filteredResponse.byDayStats[date] = {};
				for (const metric of metricsToInclude) {
					if ((dayStats as any)[metric] !== undefined) {
						(filteredResponse.byDayStats[date] as any)[metric] = (dayStats as any)[metric];
					}
				}
			}
		}

		return filteredResponse;
	}
}
