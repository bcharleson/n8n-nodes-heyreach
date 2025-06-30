"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationRouter = void 0;
const CampaignOperations_1 = require("./CampaignOperations");
const LeadOperations_1 = require("./LeadOperations");
const ListOperations_1 = require("./ListOperations");
const AnalyticsOperations_1 = require("./AnalyticsOperations");
const ConversationOperations_1 = require("./ConversationOperations");
const NetworkOperations_1 = require("./NetworkOperations");
/**
 * Main operation router that delegates to specific resource handlers
 */
class OperationRouter {
    /**
     * Route operation to appropriate handler based on resource and operation type
     */
    static async execute(context, itemIndex, resource, operation) {
        switch (resource) {
            case 'campaign':
                return await this.handleCampaignOperation(context, itemIndex, operation);
            case 'lead':
                return await this.handleLeadOperation(context, itemIndex, operation);
            case 'list':
                return await this.handleListOperation(context, itemIndex, operation);
            case 'analytics':
                return await this.handleAnalyticsOperation(context, itemIndex, operation);
            case 'conversation':
                return await this.handleConversationOperation(context, itemIndex, operation);
            case 'network':
                return await this.handleNetworkOperation(context, itemIndex, operation);
            default:
                throw new Error(`Unknown resource: ${resource}`);
        }
    }
    /**
     * Handle campaign operations
     */
    static async handleCampaignOperation(context, itemIndex, operation) {
        switch (operation) {
            case 'get':
                return await CampaignOperations_1.CampaignOperations.get(context, itemIndex);
            case 'getMany':
                return await CampaignOperations_1.CampaignOperations.getMany(context, itemIndex);
            case 'pause':
                return await CampaignOperations_1.CampaignOperations.pause(context, itemIndex);
            case 'resume':
                return await CampaignOperations_1.CampaignOperations.resume(context, itemIndex);
            case 'addLeads':
                return await CampaignOperations_1.CampaignOperations.addLeads(context, itemIndex);
            default:
                throw new Error(`Unknown campaign operation: ${operation}`);
        }
    }
    /**
     * Handle lead operations
     */
    static async handleLeadOperation(context, itemIndex, operation) {
        switch (operation) {
            case 'getLead':
                return await LeadOperations_1.LeadOperations.get(context, itemIndex);
            case 'addTags':
                return await LeadOperations_1.LeadOperations.addTags(context, itemIndex);
            case 'getTags':
                return await LeadOperations_1.LeadOperations.getTags(context, itemIndex);
            case 'replaceTags':
                return await LeadOperations_1.LeadOperations.replaceTags(context, itemIndex);
            case 'getLeadsFromCampaign':
                return await LeadOperations_1.LeadOperations.getLeadsFromCampaign(context, itemIndex);
            case 'getCampaignsForLead':
                return await LeadOperations_1.LeadOperations.getCampaignsForLead(context, itemIndex);
            case 'stopLeadInCampaign':
                return await LeadOperations_1.LeadOperations.stopLeadInCampaign(context, itemIndex);
            case 'getLeadsFromList':
                return await LeadOperations_1.LeadOperations.getLeadsFromList(context, itemIndex);
            case 'getListsForLead':
                return await LeadOperations_1.LeadOperations.getListsForLead(context, itemIndex);
            case 'deleteLeadsFromList':
                return await LeadOperations_1.LeadOperations.deleteLeadsFromList(context, itemIndex);
            default:
                throw new Error(`Unknown lead operation: ${operation}`);
        }
    }
    /**
     * Handle list operations
     */
    static async handleListOperation(context, itemIndex, operation) {
        switch (operation) {
            case 'getLists':
                return await ListOperations_1.ListOperations.getMany(context, itemIndex);
            case 'create':
                return await ListOperations_1.ListOperations.create(context, itemIndex);
            case 'addLeadsToList':
                return await ListOperations_1.ListOperations.addLeads(context, itemIndex);
            default:
                throw new Error(`Unknown list operation: ${operation}`);
        }
    }
    /**
     * Handle analytics operations
     */
    static async handleAnalyticsOperation(context, itemIndex, operation) {
        switch (operation) {
            case 'getOverallStats':
                return await AnalyticsOperations_1.AnalyticsOperations.getOverallStats(context, itemIndex);
            default:
                throw new Error(`Unknown analytics operation: ${operation}`);
        }
    }
    /**
     * Handle conversation operations
     */
    static async handleConversationOperation(context, itemIndex, operation) {
        switch (operation) {
            case 'getConversations':
                return await ConversationOperations_1.ConversationOperations.getMany(context, itemIndex);
            default:
                throw new Error(`Unknown conversation operation: ${operation}`);
        }
    }
    /**
     * Handle network operations
     */
    static async handleNetworkOperation(context, itemIndex, operation) {
        switch (operation) {
            case 'getForSender':
                return await NetworkOperations_1.NetworkOperations.getForSender(context, itemIndex);
            default:
                throw new Error(`Unknown network operation: ${operation}`);
        }
    }
}
exports.OperationRouter = OperationRouter;
//# sourceMappingURL=OperationRouter.js.map