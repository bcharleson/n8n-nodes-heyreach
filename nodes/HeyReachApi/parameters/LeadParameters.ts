import { INodeProperties } from 'n8n-workflow';

export const leadParameters: INodeProperties[] = [
	// LEAD OPERATIONS
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['lead'],
			},
		},
		options: [
			{
				name: 'Get Lead',
				value: 'getLead',
				description: 'Get lead details by LinkedIn profile URL',
				action: 'Get a lead',
			},
			{
				name: 'Add Tags',
				value: 'addTags',
				description: 'Add tags to a lead',
				action: 'Add tags to lead',
			},
			{
				name: 'Get Tags',
				value: 'getTags',
				description: 'Get tags for a lead',
				action: 'Get lead tags',
			},
			{
				name: 'Replace Tags',
				value: 'replaceTags',
				description: 'Replace all tags for a lead',
				action: 'Replace lead tags',
			},
			{
				name: 'Get Leads from Campaign',
				value: 'getLeadsFromCampaign',
				description: 'Get leads that are in a specific campaign',
				action: 'Get leads from campaign',
			},
			{
				name: 'Get Campaigns for Lead',
				value: 'getCampaignsForLead',
				description: 'Get campaigns where a lead exists',
				action: 'Get campaigns for lead',
			},
			{
				name: 'Stop Lead in Campaign',
				value: 'stopLeadInCampaign',
				description: 'Stop a lead\'s progression in a campaign',
				action: 'Stop lead in campaign',
			},
			{
				name: 'Get Leads from List',
				value: 'getLeadsFromList',
				description: 'Get leads from a specific list',
				action: 'Get leads from list',
			},
			{
				name: 'Get Lists for Lead',
				value: 'getListsForLead',
				description: 'Get lists where a lead exists',
				action: 'Get lists for lead',
			},
			{
				name: 'Delete Leads from List',
				value: 'deleteLeadsFromList',
				description: 'Remove leads from a list by profile URLs',
				action: 'Delete leads from list',
			},
		],
		default: 'getLead',
	},

	// LINKEDIN PROFILE URL (required for basic lead operations)
	{
		displayName: 'LinkedIn Profile URL',
		name: 'profileUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getLead', 'addTags', 'getTags', 'replaceTags'],
			},
		},
		default: '',
		placeholder: 'https://www.linkedin.com/in/john-doe',
		description: 'LinkedIn profile URL of the lead',
	},

	// TAGS (for addTags and replaceTags operations)
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['addTags', 'replaceTags'],
			},
		},
		default: '',
		placeholder: 'tag1, tag2, tag3',
		description: 'Comma-separated list of tags to add/replace for the lead',
	},

	// CREATE TAG IF NOT EXISTING (for addTags and replaceTags operations)
	{
		displayName: 'Create Tag If Not Existing',
		name: 'createTagIfNotExisting',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['addTags', 'replaceTags'],
			},
		},
		default: true,
		description: 'Whether to create tags that don\'t exist. If false and a tag doesn\'t exist, an error will be returned.',
	},

	// CAMPAIGN ID (for campaign-related operations)
	{
		displayName: 'Campaign',
		name: 'campaignId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getLeadsFromCampaign', 'stopLeadInCampaign'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getCampaigns',
					searchable: true,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9]+$',
							errorMessage: 'Campaign ID must be a number',
						},
					},
				],
			},
		],
		description: 'Campaign to work with',
	},

	// LIST ID (for list-related operations)
	{
		displayName: 'List',
		name: 'listId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getLeadsFromList', 'deleteLeadsFromList'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getLists',
					searchable: true,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9]+$',
							errorMessage: 'List ID must be a number',
						},
					},
				],
			},
		],
		description: 'List to work with',
	},

	// LINKEDIN PROFILE URL (for getCampaignsForLead and getListsForLead operations)
	{
		displayName: 'LinkedIn Profile URL',
		name: 'leadProfileUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getCampaignsForLead', 'getListsForLead'],
			},
		},
		placeholder: 'https://www.linkedin.com/in/john-doe',
		description: 'LinkedIn profile URL of the lead (primary identifier)',
	},

	// EMAIL ADDRESS (alternative identifier for getCampaignsForLead and getListsForLead operations)
	{
		displayName: 'Email Address (Optional)',
		name: 'leadEmail',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getCampaignsForLead', 'getListsForLead'],
			},
		},
		placeholder: 'john.doe@example.com',
		description: 'Email address of the lead (alternative to LinkedIn URL)',
	},

	// LINKEDIN ID (alternative identifier for getCampaignsForLead and getListsForLead operations)
	{
		displayName: 'LinkedIn ID (Optional)',
		name: 'leadLinkedinId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getCampaignsForLead', 'getListsForLead'],
			},
		},
		placeholder: '123456789',
		description: 'LinkedIn ID of the lead (found in API responses, alternative to LinkedIn URL)',
	},

	// PAGINATION PARAMETERS FOR GET LEADS FROM CAMPAIGN (with automatic pagination)
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getLeadsFromCampaign'],
			},
		},
		description: 'Whether to return all leads from the campaign or limit the number of results',
	},

	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 100,
		typeOptions: {
			minValue: 1,
			maxValue: 10000,
		},
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getLeadsFromCampaign'],
				returnAll: [false],
			},
		},
		description: 'Maximum number of leads to return (automatic pagination will handle multiple API calls if needed)',
	},

	// PAGINATION PARAMETERS FOR OTHER OPERATIONS (manual offset-based)
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getCampaignsForLead', 'getLeadsFromList', 'getListsForLead'],
			},
		},
		description: 'Number of records to skip (for pagination)',
	},

	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 100,
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getCampaignsForLead', 'getLeadsFromList', 'getListsForLead'],
			},
		},
		description: 'Maximum number of records to return',
	},

	// TIME FILTERS (for getLeadsFromCampaign)
	{
		displayName: 'Time Filter',
		name: 'timeFilter',
		type: 'options',
		default: 'Everywhere',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getLeadsFromCampaign'],
			},
		},
		options: [
			{
				name: 'Everywhere',
				value: 'Everywhere',
				description: 'No specific time filtering',
			},
			{
				name: 'Creation Time',
				value: 'CreationTime',
				description: 'Filter leads by their creation time',
			},
		],
		description: 'Time filter for fetching leads',
	},

	{
		displayName: 'Time From',
		name: 'timeFrom',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getLeadsFromCampaign'],
				timeFilter: ['CreationTime'],
			},
		},
		description: 'Start of the time range for filtering (ISO 8601 format)',
	},

	{
		displayName: 'Time To',
		name: 'timeTo',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getLeadsFromCampaign'],
				timeFilter: ['CreationTime'],
			},
		},
		description: 'End of the time range for filtering (ISO 8601 format)',
	},

	// KEYWORD SEARCH (for getLeadsFromList)
	{
		displayName: 'Keyword',
		name: 'keyword',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getLeadsFromList'],
			},
		},
		description: 'Search keyword to filter leads',
	},

	// LEAD STOP PARAMETERS (for stopLeadInCampaign)
	{
		displayName: 'Lead Member ID',
		name: 'leadMemberId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['stopLeadInCampaign'],
			},
		},
		description: 'LinkedIn member ID of the lead (found in GetLeadsFromCampaign response)',
	},

	{
		displayName: 'Lead URL',
		name: 'leadUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['stopLeadInCampaign'],
			},
		},
		placeholder: 'https://www.linkedin.com/in/john-doe',
		description: 'LinkedIn profile URL of the lead',
	},

	// PROFILE URLS (for deleteLeadsFromList)
	{
		displayName: 'Profile URLs',
		name: 'profileUrls',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['deleteLeadsFromList'],
			},
		},
		default: '',
		placeholder: 'https://www.linkedin.com/in/john-doe\nhttps://www.linkedin.com/in/jane-smith',
		description: 'LinkedIn profile URLs to delete (one per line or comma-separated)',
	},
];
