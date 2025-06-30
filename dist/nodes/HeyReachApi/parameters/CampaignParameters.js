"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignParameters = void 0;
exports.campaignParameters = [
    // CAMPAIGN OPERATIONS
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['campaign'],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get a single campaign by ID',
                action: 'Get a campaign',
            },
            {
                name: 'Get Many',
                value: 'getMany',
                description: 'Get multiple campaigns with filtering',
                action: 'Get many campaigns',
            },
            {
                name: 'Pause',
                value: 'pause',
                description: 'Pause a campaign',
                action: 'Pause a campaign',
            },
            {
                name: 'Resume',
                value: 'resume',
                description: 'Resume a paused campaign',
                action: 'Resume a campaign',
            },
            {
                name: 'Add Leads',
                value: 'addLeads',
                description: 'Add leads to an active campaign',
                action: 'Add leads to campaign',
            },
        ],
        default: 'getMany',
    },
    // CAMPAIGN ID (for get, pause, resume, addLeads operations)
    {
        displayName: 'Campaign',
        name: 'campaignId',
        type: 'resourceLocator',
        default: { mode: 'list', value: '' },
        required: true,
        displayOptions: {
            show: {
                resource: ['campaign'],
                operation: ['get', 'pause', 'resume', 'addLeads'],
            },
        },
        description: 'The campaign to operate on',
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                placeholder: 'Select a campaign...',
                typeOptions: {
                    searchListMethod: 'getCampaigns',
                    searchable: true,
                },
            },
            {
                displayName: 'By ID',
                name: 'id',
                type: 'string',
                placeholder: 'e.g. 12345',
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
    },
    // GET MANY CAMPAIGNS - Filters
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['campaign'],
                operation: ['getMany'],
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
                resource: ['campaign'],
                operation: ['getMany'],
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
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['campaign'],
                operation: ['getMany'],
            },
        },
        options: [
            {
                displayName: 'Keyword',
                name: 'keyword',
                type: 'string',
                default: '',
                description: 'Search campaigns by name keyword',
            },
            {
                displayName: 'Statuses',
                name: 'statuses',
                type: 'multiOptions',
                options: [
                    {
                        name: 'Draft',
                        value: 'DRAFT',
                    },
                    {
                        name: 'In Progress',
                        value: 'IN_PROGRESS',
                    },
                    {
                        name: 'Paused',
                        value: 'PAUSED',
                    },
                    {
                        name: 'Finished',
                        value: 'FINISHED',
                    },
                    {
                        name: 'Canceled',
                        value: 'CANCELED',
                    },
                    {
                        name: 'Failed',
                        value: 'FAILED',
                    },
                    {
                        name: 'Starting',
                        value: 'STARTING',
                    },
                ],
                default: [],
                description: 'Filter campaigns by status',
            },
            {
                displayName: 'Account IDs',
                name: 'accountIds',
                type: 'string',
                default: '',
                placeholder: '123,456,789',
                description: 'Comma-separated list of LinkedIn account IDs to filter by',
            },
        ],
    },
    // ADD LEADS TO CAMPAIGN
    {
        displayName: 'Leads Input Mode',
        name: 'leadsInputMode',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['campaign'],
                operation: ['addLeads'],
            },
        },
        options: [
            {
                name: 'JSON Input',
                value: 'json',
                description: 'Provide leads as JSON array',
            },
            {
                name: 'Single Lead',
                value: 'single',
                description: 'Add a single lead with form fields',
            },
        ],
        default: 'single',
        description: 'How to provide the lead data',
    },
    // Single Lead Input
    {
        displayName: 'LinkedIn Profile URL',
        name: 'profileUrl',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['campaign'],
                operation: ['addLeads'],
                leadsInputMode: ['single'],
            },
        },
        default: '',
        placeholder: 'https://www.linkedin.com/in/john-doe',
        description: 'LinkedIn profile URL of the lead',
    },
    {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['campaign'],
                operation: ['addLeads'],
                leadsInputMode: ['single'],
            },
        },
        default: '',
        description: 'First name of the lead',
    },
    {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['campaign'],
                operation: ['addLeads'],
                leadsInputMode: ['single'],
            },
        },
        default: '',
        description: 'Last name of the lead',
    },
    // JSON Leads Input
    {
        displayName: 'Leads JSON',
        name: 'leadsJson',
        type: 'json',
        required: true,
        displayOptions: {
            show: {
                resource: ['campaign'],
                operation: ['addLeads'],
                leadsInputMode: ['json'],
            },
        },
        default: '[\n  {\n    "profileUrl": "https://www.linkedin.com/in/john-doe",\n    "firstName": "John",\n    "lastName": "Doe",\n    "linkedInAccountId": 123\n  }\n]',
        description: 'Array of lead objects to add to the campaign',
        typeOptions: {
            alwaysOpenEditWindow: true,
        },
    },
    // Additional Lead Fields for Single Lead Input
    {
        displayName: 'Additional Lead Fields',
        name: 'additionalLeadFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['campaign'],
                operation: ['addLeads'],
                leadsInputMode: ['single'],
            },
        },
        options: [
            {
                displayName: 'LinkedIn Account ID',
                name: 'linkedInAccountId',
                type: 'number',
                default: '',
                description: 'Specific LinkedIn account ID to assign this lead to',
            },
            {
                displayName: 'Location',
                name: 'location',
                type: 'string',
                default: '',
                description: 'Geographic location of the lead',
            },
            {
                displayName: 'Company Name',
                name: 'companyName',
                type: 'string',
                default: '',
                description: 'Company where the lead works',
            },
            {
                displayName: 'Position',
                name: 'position',
                type: 'string',
                default: '',
                description: 'Job title or position of the lead',
            },
            {
                displayName: 'Summary',
                name: 'summary',
                type: 'string',
                default: '',
                description: 'Professional summary or headline',
            },
            {
                displayName: 'About',
                name: 'about',
                type: 'string',
                default: '',
                description: 'About section from LinkedIn profile',
            },
            {
                displayName: 'Email Address',
                name: 'emailAddress',
                type: 'string',
                default: '',
                description: 'Email address of the lead',
            },
            {
                displayName: 'Custom Fields',
                name: 'customUserFields',
                type: 'fixedCollection',
                default: {},
                typeOptions: {
                    multipleValues: true,
                },
                description: 'Custom fields for the lead (name must be alphanumeric + underscore only)',
                options: [
                    {
                        name: 'field',
                        displayName: 'Custom Field',
                        values: [
                            {
                                displayName: 'Name',
                                name: 'name',
                                type: 'string',
                                default: '',
                                placeholder: 'field_name',
                                description: 'Field name (alphanumeric and underscore only)',
                            },
                            {
                                displayName: 'Value',
                                name: 'value',
                                type: 'string',
                                default: '',
                                description: 'Field value',
                            },
                        ],
                    },
                ],
            },
        ],
    },
];
//# sourceMappingURL=CampaignParameters.js.map