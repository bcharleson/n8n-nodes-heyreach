"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListOperations = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const generic_functions_1 = require("../../generic.functions");
/**
 * List operations for HeyReach API
 */
class ListOperations {
    /**
     * Get many lists with pagination support
     */
    static async getMany(context, itemIndex) {
        const returnAll = context.getNodeParameter('returnAll', itemIndex, false);
        const limit = context.getNodeParameter('limit', itemIndex, 50);
        // Validate limit doesn't exceed 100
        if (limit > 100) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Limit cannot exceed 100. HeyReach API has a maximum limit of 100.', { itemIndex });
        }
        // Build request body
        const body = {
            offset: 0,
            limit: returnAll ? 100 : limit,
        };
        if (returnAll) {
            const lists = await generic_functions_1.heyReachApiRequestAllItems.call(context, 'POST', '/list/GetAll', body);
            return lists;
        }
        else {
            const response = await generic_functions_1.heyReachApiRequest.call(context, 'POST', '/list/GetAll', body);
            return response.items || [];
        }
    }
    /**
     * Create a new empty list
     */
    static async create(context, itemIndex) {
        const listName = context.getNodeParameter('listName', itemIndex);
        const listType = context.getNodeParameter('listType', itemIndex, 'USER_LIST');
        if (!listName || listName.trim().length === 0) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'List name is required', { itemIndex });
        }
        const response = await generic_functions_1.heyReachApiRequest.call(context, 'POST', '/list/CreateEmptyList', {
            name: listName.trim(),
            type: listType,
        });
        return response;
    }
    /**
     * Add leads to a list
     */
    static async addLeads(context, itemIndex) {
        const listId = this.getListId(context, itemIndex);
        const leadsInputMode = context.getNodeParameter('leadsInputMode', itemIndex);
        let leads = [];
        if (leadsInputMode === 'single') {
            // Single lead input
            const profileUrl = context.getNodeParameter('profileUrl', itemIndex);
            const firstName = context.getNodeParameter('firstName', itemIndex);
            const lastName = context.getNodeParameter('lastName', itemIndex);
            const additionalLeadFields = context.getNodeParameter('additionalLeadFields', itemIndex, {});
            // Validate LinkedIn profile URL
            if (!(0, generic_functions_1.validateLinkedInProfileUrl)(profileUrl)) {
                throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Invalid LinkedIn profile URL format. Please use format: https://www.linkedin.com/in/username', { itemIndex });
            }
            // Build lead object
            const lead = {
                profileUrl,
                firstName,
                lastName,
            };
            // Add optional fields
            if (additionalLeadFields.location)
                lead.location = additionalLeadFields.location;
            if (additionalLeadFields.companyName)
                lead.companyName = additionalLeadFields.companyName;
            if (additionalLeadFields.position)
                lead.position = additionalLeadFields.position;
            if (additionalLeadFields.summary)
                lead.summary = additionalLeadFields.summary;
            if (additionalLeadFields.about)
                lead.about = additionalLeadFields.about;
            if (additionalLeadFields.emailAddress)
                lead.emailAddress = additionalLeadFields.emailAddress;
            // Handle custom fields
            if (additionalLeadFields.customUserFields && additionalLeadFields.customUserFields.field) {
                const customFields = [];
                for (const field of additionalLeadFields.customUserFields.field) {
                    if (field.name && field.value) {
                        // Validate custom field name format
                        if (!(0, generic_functions_1.validateCustomFieldName)(field.name)) {
                            throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Invalid custom field name "${field.name}". Name must contain only alphanumeric characters and underscores.`, { itemIndex });
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
        }
        else {
            // JSON input mode
            const leadsJson = context.getNodeParameter('leadsJson', itemIndex);
            try {
                const leadsData = JSON.parse(leadsJson);
                if (!Array.isArray(leadsData)) {
                    throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Leads JSON must be an array of lead objects', { itemIndex });
                }
                // Validate and process each lead
                for (const leadData of leadsData) {
                    if (!leadData.profileUrl || !leadData.firstName || !leadData.lastName) {
                        throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Each lead must have profileUrl, firstName, and lastName', { itemIndex });
                    }
                    // Validate LinkedIn profile URL
                    if (!(0, generic_functions_1.validateLinkedInProfileUrl)(leadData.profileUrl)) {
                        throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Invalid LinkedIn profile URL format: ${leadData.profileUrl}`, { itemIndex });
                    }
                    // Validate custom fields if present
                    if (leadData.customUserFields) {
                        for (const field of leadData.customUserFields) {
                            if (field.name && !(0, generic_functions_1.validateCustomFieldName)(field.name)) {
                                throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Invalid custom field name "${field.name}". Name must contain only alphanumeric characters and underscores.`, { itemIndex });
                            }
                        }
                    }
                    leads.push(leadData);
                }
            }
            catch (error) {
                if (error instanceof n8n_workflow_1.NodeOperationError) {
                    throw error;
                }
                throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Invalid JSON format: ${error.message}`, { itemIndex });
            }
        }
        // Validate we have leads to add
        if (leads.length === 0) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'No valid leads to add to list', { itemIndex });
        }
        // Add leads to list using V2 endpoint for better response data
        const response = await generic_functions_1.heyReachApiRequest.call(context, 'POST', '/list/AddLeadsToListV2', {
            listId,
            leads,
        });
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
    static getListId(context, itemIndex) {
        const listId = context.getNodeParameter('listId', itemIndex);
        if (typeof listId === 'object' && listId.value) {
            return parseInt(listId.value, 10);
        }
        if (typeof listId === 'number') {
            return listId;
        }
        if (typeof listId === 'string') {
            const parsed = parseInt(listId, 10);
            if (isNaN(parsed)) {
                throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Invalid list ID: ${listId}`, { itemIndex });
            }
            return parsed;
        }
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'List ID is required', { itemIndex });
    }
}
exports.ListOperations = ListOperations;
//# sourceMappingURL=ListOperations.js.map