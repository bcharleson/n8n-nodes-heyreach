"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationOperations = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const generic_functions_1 = require("../../generic.functions");
/**
 * Conversation operations for HeyReach API
 */
class ConversationOperations {
    /**
     * Get conversations with filtering
     */
    static async getMany(context, itemIndex) {
        const returnAll = context.getNodeParameter('returnAll', itemIndex, false);
        const limit = context.getNodeParameter('limit', itemIndex, 50);
        const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {});
        // Validate limit doesn't exceed 100
        if (limit > 100) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Limit cannot exceed 100. HeyReach API has a maximum limit of 100.', { itemIndex });
        }
        // Build request body
        const body = {
            offset: 0,
            limit: returnAll ? 100 : limit,
        };
        // Add filtering options
        if (additionalFields.readStatus && additionalFields.readStatus !== 'all') {
            body.read = additionalFields.readStatus === 'read';
        }
        if (additionalFields.campaignId) {
            const campaignId = parseInt(additionalFields.campaignId, 10);
            if (isNaN(campaignId)) {
                throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Invalid campaign ID: ${additionalFields.campaignId}`, { itemIndex });
            }
            body.campaignId = campaignId;
        }
        if (additionalFields.linkedInAccountId) {
            const accountId = parseInt(additionalFields.linkedInAccountId, 10);
            if (isNaN(accountId)) {
                throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Invalid LinkedIn account ID: ${additionalFields.linkedInAccountId}`, { itemIndex });
            }
            body.linkedInAccountId = accountId;
        }
        if (additionalFields.includeMessages) {
            body.includeMessages = additionalFields.includeMessages;
        }
        if (additionalFields.messageTypeFilter && additionalFields.messageTypeFilter.length > 0) {
            body.messageTypes = additionalFields.messageTypeFilter;
        }
        if (additionalFields.groupChatFilter && additionalFields.groupChatFilter !== 'all') {
            body.groupChat = additionalFields.groupChatFilter === 'group';
        }
        // Handle date range filtering
        if (additionalFields.dateRange && additionalFields.dateRange !== 'all') {
            if (additionalFields.dateRange === 'custom') {
                const startDate = additionalFields.startDate;
                const endDate = additionalFields.endDate;
                if (!startDate || !endDate) {
                    throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Start date and end date are required for custom date range', { itemIndex });
                }
                // Validate date range
                const start = new Date(startDate);
                const end = new Date(endDate);
                if (start >= end) {
                    throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Start date must be before end date', { itemIndex });
                }
                body.startDate = (0, generic_functions_1.formatDateForApi)(startDate);
                body.endDate = (0, generic_functions_1.formatDateForApi)(endDate);
            }
            else {
                // Handle predefined date ranges
                const now = new Date();
                let daysBack = 0;
                switch (additionalFields.dateRange) {
                    case 'last7days':
                        daysBack = 7;
                        break;
                    case 'last30days':
                        daysBack = 30;
                        break;
                }
                if (daysBack > 0) {
                    const startDate = new Date(now);
                    startDate.setDate(now.getDate() - daysBack);
                    body.startDate = (0, generic_functions_1.formatDateForApi)(startDate);
                    body.endDate = (0, generic_functions_1.formatDateForApi)(now);
                }
            }
        }
        try {
            if (returnAll) {
                const conversations = await generic_functions_1.heyReachApiRequestAllItems.call(context, 'POST', '/conversation/GetConversationsV2', body);
                return this.processConversations(conversations, additionalFields);
            }
            else {
                const response = await generic_functions_1.heyReachApiRequest.call(context, 'POST', '/conversation/GetConversationsV2', body);
                const conversations = response.items || [];
                return this.processConversations(conversations, additionalFields);
            }
        }
        catch (error) {
            // Handle conversation-specific errors
            if (error.response?.status === 400) {
                throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Invalid filter parameters. Please check your campaign ID, account ID, and date range values.', { itemIndex });
            }
            throw error;
        }
    }
    /**
     * Process conversations based on additional filtering options
     */
    static processConversations(conversations, additionalFields) {
        if (!conversations || conversations.length === 0) {
            return [];
        }
        let processedConversations = [...conversations];
        // Additional client-side filtering if needed
        if (additionalFields.messageTypeFilter && additionalFields.messageTypeFilter.length > 0) {
            processedConversations = processedConversations.filter(conversation => {
                if (!conversation.lastMessageType)
                    return false;
                return additionalFields.messageTypeFilter.includes(conversation.lastMessageType);
            });
        }
        // Sort conversations by last message date (most recent first)
        processedConversations.sort((a, b) => {
            const dateA = new Date(a.lastMessageAt || 0);
            const dateB = new Date(b.lastMessageAt || 0);
            return dateB.getTime() - dateA.getTime();
        });
        // Add computed fields for better usability
        return processedConversations.map(conversation => ({
            ...conversation,
            // Add computed fields
            isUnread: !conversation.read,
            hasMessages: (conversation.totalMessages || 0) > 0,
            lastMessageAge: conversation.lastMessageAt ?
                Math.floor((Date.now() - new Date(conversation.lastMessageAt).getTime()) / (1000 * 60 * 60 * 24)) : null,
            correspondentName: conversation.correspondentProfile ?
                `${conversation.correspondentProfile.firstName} ${conversation.correspondentProfile.lastName}`.trim() : 'Unknown',
        }));
    }
}
exports.ConversationOperations = ConversationOperations;
//# sourceMappingURL=ConversationOperations.js.map