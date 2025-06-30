"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.networkParameters = void 0;
exports.networkParameters = [
    // NETWORK OPERATIONS
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['network'],
            },
        },
        options: [
            {
                name: 'Get For Sender',
                value: 'getForSender',
                description: 'Get LinkedIn network connections for a specific sender account',
                action: 'Get network for sender',
            },
        ],
        default: 'getForSender',
    },
    // LINKEDIN ACCOUNT ID (required)
    {
        displayName: 'LinkedIn Account ID',
        name: 'linkedInAccountId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['network'],
                operation: ['getForSender'],
            },
        },
        default: '',
        placeholder: '12345',
        description: 'LinkedIn account ID to get network connections for',
    },
    // PAGINATION
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['network'],
                operation: ['getForSender'],
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
                resource: ['network'],
                operation: ['getForSender'],
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
                resource: ['network'],
                operation: ['getForSender'],
            },
        },
        options: [
            {
                displayName: 'Search Keyword',
                name: 'searchKeyword',
                type: 'string',
                default: '',
                placeholder: 'John Doe',
                description: 'Search network connections by name or company',
            },
            {
                displayName: 'Company Filter',
                name: 'companyFilter',
                type: 'string',
                default: '',
                placeholder: 'Microsoft',
                description: 'Filter connections by company name',
            },
            {
                displayName: 'Location Filter',
                name: 'locationFilter',
                type: 'string',
                default: '',
                placeholder: 'San Francisco',
                description: 'Filter connections by location',
            },
            {
                displayName: 'Connection Level',
                name: 'connectionLevel',
                type: 'options',
                options: [
                    {
                        name: 'All Levels',
                        value: 'all',
                        description: 'Include all connection levels',
                    },
                    {
                        name: '1st Connections',
                        value: '1st',
                        description: 'Only direct connections',
                    },
                    {
                        name: '2nd Connections',
                        value: '2nd',
                        description: 'Second-degree connections',
                    },
                    {
                        name: '3rd+ Connections',
                        value: '3rd+',
                        description: 'Third-degree and beyond connections',
                    },
                ],
                default: 'all',
                description: 'Filter by LinkedIn connection level',
            },
            {
                displayName: 'Include Profile Details',
                name: 'includeProfileDetails',
                type: 'boolean',
                default: true,
                description: 'Whether to include detailed profile information (headline, about, etc.)',
            },
            {
                displayName: 'Include Contact Info',
                name: 'includeContactInfo',
                type: 'boolean',
                default: false,
                description: 'Whether to include contact information (email, phone) if available',
            },
            {
                displayName: 'Minimum Connections',
                name: 'minConnections',
                type: 'number',
                default: '',
                placeholder: '500',
                description: 'Filter by minimum number of LinkedIn connections the person has',
            },
            {
                displayName: 'Maximum Connections',
                name: 'maxConnections',
                type: 'number',
                default: '',
                placeholder: '5000',
                description: 'Filter by maximum number of LinkedIn connections the person has',
            },
        ],
    },
];
//# sourceMappingURL=NetworkParameters.js.map