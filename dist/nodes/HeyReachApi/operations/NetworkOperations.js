"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkOperations = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const generic_functions_1 = require("../../generic.functions");
/**
 * Network operations for HeyReach API
 */
class NetworkOperations {
    /**
     * Get LinkedIn network for specific sender
     */
    static async getForSender(context, itemIndex) {
        const linkedInAccountId = context.getNodeParameter('linkedInAccountId', itemIndex);
        const returnAll = context.getNodeParameter('returnAll', itemIndex, false);
        const limit = context.getNodeParameter('limit', itemIndex, 50);
        const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {});
        // Validate LinkedIn account ID
        const accountId = parseInt(linkedInAccountId, 10);
        if (isNaN(accountId)) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Invalid LinkedIn account ID: ${linkedInAccountId}`, { itemIndex });
        }
        // Validate limit doesn't exceed 100
        if (limit > 100) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Limit cannot exceed 100. HeyReach API has a maximum limit of 100.', { itemIndex });
        }
        // Build request body
        const body = {
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
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Minimum connections cannot be greater than maximum connections', { itemIndex });
        }
        try {
            if (returnAll) {
                const networkProfiles = await generic_functions_1.heyReachApiRequestAllItems.call(context, 'POST', '/network/GetMyNetworkForSender', body);
                return this.processNetworkProfiles(networkProfiles, additionalFields);
            }
            else {
                const response = await generic_functions_1.heyReachApiRequest.call(context, 'POST', '/network/GetMyNetworkForSender', body);
                const networkProfiles = response.items || [];
                return this.processNetworkProfiles(networkProfiles, additionalFields);
            }
        }
        catch (error) {
            // Handle network-specific errors
            if (error.response?.status === 400) {
                throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Invalid LinkedIn account ID or filter parameters. Please check your input values.', { itemIndex });
            }
            if (error.response?.status === 403) {
                throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Access denied. The LinkedIn account may not have permission to access network data or may not be properly authenticated.', { itemIndex });
            }
            throw error;
        }
    }
    /**
     * Process network profiles with additional computed fields
     */
    static processNetworkProfiles(profiles, additionalFields) {
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
    static determineConnectionLevel(connections) {
        if (connections >= 500)
            return 'Influencer (500+)';
        if (connections >= 100)
            return 'Well Connected (100-499)';
        if (connections >= 50)
            return 'Active (50-99)';
        if (connections >= 10)
            return 'Growing (10-49)';
        return 'New (0-9)';
    }
    /**
     * Calculate profile completeness score
     */
    static calculateProfileCompleteness(profile) {
        let score = 0;
        const fields = [
            'firstName', 'lastName', 'headline', 'location',
            'companyName', 'position', 'about', 'emailAddress'
        ];
        fields.forEach(field => {
            if (profile[field]) {
                score += 1;
            }
        });
        return Math.round((score / fields.length) * 100);
    }
}
exports.NetworkOperations = NetworkOperations;
//# sourceMappingURL=NetworkOperations.js.map