import { INodeProperties } from 'n8n-workflow';

export const analyticsParameters: INodeProperties[] = [
	// ANALYTICS OPERATIONS
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['analytics'],
			},
		},
		options: [
			{
				name: 'Get Overall Stats',
				value: 'getOverallStats',
				description: 'Get campaign performance statistics and analytics',
				action: 'Get overall statistics',
			},
		],
		default: 'getOverallStats',
	},

	// DATE RANGE FILTERING
	{
		displayName: 'Date Range',
		name: 'dateRange',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getOverallStats'],
			},
		},
		options: [
			{
				name: 'All Time',
				value: 'all',
				description: 'Get statistics for all time',
			},
			{
				name: 'Custom Range',
				value: 'custom',
				description: 'Specify custom date range',
			},
			{
				name: 'Last 7 Days',
				value: 'last7days',
				description: 'Get statistics for the last 7 days',
			},
			{
				name: 'Last 30 Days',
				value: 'last30days',
				description: 'Get statistics for the last 30 days',
			},
			{
				name: 'Last 90 Days',
				value: 'last90days',
				description: 'Get statistics for the last 90 days',
			},
		],
		default: 'all',
		description: 'Time period for analytics data',
	},



	// ADDITIONAL ANALYTICS FIELDS
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getOverallStats'],
			},
		},
		options: [
			{
				displayName: 'LinkedIn Account IDs',
				name: 'accountIds',
				type: 'string',
				default: '',
				placeholder: '123,456,789',
				description: 'Comma-separated list of LinkedIn account IDs to filter analytics by specific accounts',
			},
			{
				displayName: 'Campaign IDs',
				name: 'campaignIds',
				type: 'string',
				default: '',
				placeholder: '123,456,789',
				description: 'Comma-separated list of campaign IDs to filter analytics by specific campaigns',
			},
			{
				displayName: 'Include Daily Breakdown',
				name: 'includeDailyBreakdown',
				type: 'boolean',
				default: true,
				description: 'Whether to include day-by-day statistics breakdown in the response',
			},
			{
				displayName: 'Metrics to Include',
				name: 'metricsToInclude',
				type: 'multiOptions',
				options: [
					{
						name: 'Profile Views',
						value: 'profileViews',
					},
					{
						name: 'Post Likes',
						value: 'postLikes',
					},
					{
						name: 'Follows',
						value: 'follows',
					},
					{
						name: 'Messages Sent',
						value: 'messagesSent',
					},
					{
						name: 'Message Replies',
						value: 'messageReplies',
					},
					{
						name: 'InMail Messages',
						value: 'inmailMessages',
					},
					{
						name: 'InMail Replies',
						value: 'inmailReplies',
					},
					{
						name: 'Connections Sent',
						value: 'connectionsSent',
					},
					{
						name: 'Connections Accepted',
						value: 'connectionsAccepted',
					},
					{
						name: 'Reply Rates',
						value: 'replyRates',
					},
				],
				default: [],
				description: 'Specific metrics to include in the response. If empty, all metrics will be included.',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						dateRange: ['custom'],
					},
				},
				default: '',
				description: 'Start date for analytics data (required when using custom date range)',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						dateRange: ['custom'],
					},
				},
				default: '',
				description: 'End date for analytics data (required when using custom date range)',
			},
		],
	},
];
