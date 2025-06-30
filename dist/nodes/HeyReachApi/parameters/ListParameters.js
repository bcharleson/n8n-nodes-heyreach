"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listParameters = void 0;
exports.listParameters = [
    // LIST OPERATIONS
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['list'],
            },
        },
        options: [
            {
                name: 'Get Many',
                value: 'getLists',
                description: 'Get all lead and company lists',
                action: 'Get many lists',
            },
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new empty list',
                action: 'Create a list',
            },
            {
                name: 'Add Leads',
                value: 'addLeadsToList',
                description: 'Add leads to an existing list',
                action: 'Add leads to list',
            },
        ],
        default: 'getLists',
    },
    // GET MANY LISTS - Pagination
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['list'],
                operation: ['getLists'],
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
                resource: ['list'],
                operation: ['getLists'],
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
    // CREATE LIST - Name and Type
    {
        displayName: 'List Name',
        name: 'listName',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['list'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'Name of the new list',
    },
    {
        displayName: 'List Type',
        name: 'listType',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['list'],
                operation: ['create'],
            },
        },
        options: [
            {
                name: 'User List (Leads)',
                value: 'USER_LIST',
                description: 'List for individual leads/prospects',
            },
            {
                name: 'Company List',
                value: 'COMPANY_LIST',
                description: 'List for companies',
            },
        ],
        default: 'USER_LIST',
        description: 'Type of list to create',
    },
    // ADD LEADS TO LIST - List Selection
    {
        displayName: 'List',
        name: 'listId',
        type: 'resourceLocator',
        default: { mode: 'list', value: '' },
        required: true,
        displayOptions: {
            show: {
                resource: ['list'],
                operation: ['addLeadsToList'],
            },
        },
        description: 'The list to add leads to',
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                placeholder: 'Select a list...',
                typeOptions: {
                    searchListMethod: 'getLists',
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
                            errorMessage: 'List ID must be a number',
                        },
                    },
                ],
            },
        ],
    },
    // ADD LEADS TO LIST - Input Mode
    {
        displayName: 'Leads Input Mode',
        name: 'leadsInputMode',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['list'],
                operation: ['addLeadsToList'],
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
    // Single Lead Input for Lists
    {
        displayName: 'LinkedIn Profile URL',
        name: 'profileUrl',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['list'],
                operation: ['addLeadsToList'],
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
                resource: ['list'],
                operation: ['addLeadsToList'],
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
                resource: ['list'],
                operation: ['addLeadsToList'],
                leadsInputMode: ['single'],
            },
        },
        default: '',
        description: 'Last name of the lead',
    },
    // JSON Leads Input for Lists
    {
        displayName: 'Leads JSON',
        name: 'leadsJson',
        type: 'json',
        required: true,
        displayOptions: {
            show: {
                resource: ['list'],
                operation: ['addLeadsToList'],
                leadsInputMode: ['json'],
            },
        },
        default: '[\n  {\n    "profileUrl": "https://www.linkedin.com/in/john-doe",\n    "firstName": "John",\n    "lastName": "Doe"\n  }\n]',
        description: 'Array of lead objects to add to the list',
        typeOptions: {
            alwaysOpenEditWindow: true,
        },
    },
    // Additional Lead Fields for Single Lead Input in Lists
    {
        displayName: 'Additional Lead Fields',
        name: 'additionalLeadFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['list'],
                operation: ['addLeadsToList'],
                leadsInputMode: ['single'],
            },
        },
        options: [
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
//# sourceMappingURL=ListParameters.js.map