import { INodeProperties } from 'n8n-workflow';

export const conversationParameters: INodeProperties[] = [
	// CONVERSATION OPERATIONS
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['conversation'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getConversations',
				description: 'Get LinkedIn conversations and inbox messages',
				action: 'Get many conversations',
			},
		],
		default: 'getConversations',
	},

	// PAGINATION
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['getConversations'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['getConversations'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return (max 100)',
	},

	// ADDITIONAL FIELDS FOR FILTERING
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['getConversations'],
			},
		},
		options: [
			{
				displayName: 'Read Status',
				name: 'readStatus',
				type: 'options',
				options: [
					{
						name: 'All',
						value: 'all',
						description: 'Show both read and unread conversations',
					},
					{
						name: 'Read Only',
						value: 'read',
						description: 'Show only read conversations',
					},
					{
						name: 'Unread Only',
						value: 'unread',
						description: 'Show only unread conversations',
					},
				],
				default: 'all',
				description: 'Filter conversations by read status',
			},
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				default: '',
				placeholder: '12345',
				description: 'Filter conversations by specific campaign ID',
			},
			{
				displayName: 'LinkedIn Account ID',
				name: 'linkedInAccountId',
				type: 'string',
				default: '',
				placeholder: '12345',
				description: 'Filter conversations by specific LinkedIn account ID',
			},
			{
				displayName: 'Include Messages',
				name: 'includeMessages',
				type: 'boolean',
				default: false,
				description: 'Whether to include full message history for each conversation',
			},
			{
				displayName: 'Message Type Filter',
				name: 'messageTypeFilter',
				type: 'multiOptions',
				options: [
					{
						name: 'Text Messages',
						value: 'TEXT',
					},
					{
						name: 'Image Messages',
						value: 'IMAGE',
					},
					{
						name: 'File Messages',
						value: 'FILE',
					},
				],
				default: [],
				description: 'Filter conversations by message types. If empty, all types will be included.',
			},
			{
				displayName: 'Group Chat Filter',
				name: 'groupChatFilter',
				type: 'options',
				options: [
					{
						name: 'All',
						value: 'all',
						description: 'Include both individual and group conversations',
					},
					{
						name: 'Individual Only',
						value: 'individual',
						description: 'Include only individual conversations',
					},
					{
						name: 'Group Only',
						value: 'group',
						description: 'Include only group conversations',
					},
				],
				default: 'all',
				description: 'Filter by conversation type',
			},
			{
				displayName: 'Date Range',
				name: 'dateRange',
				type: 'options',
				options: [
					{
						name: 'All Time',
						value: 'all',
						description: 'Get conversations from all time',
					},
					{
						name: 'Last 7 Days',
						value: 'last7days',
						description: 'Get conversations from the last 7 days',
					},
					{
						name: 'Last 30 Days',
						value: 'last30days',
						description: 'Get conversations from the last 30 days',
					},
					{
						name: 'Custom Range',
						value: 'custom',
						description: 'Specify custom date range',
					},
				],
				default: 'all',
				description: 'Time period for conversation data',
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
				description: 'Start date for conversation data (required when using custom date range)',
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
				description: 'End date for conversation data (required when using custom date range)',
			},
		],
	},


];
