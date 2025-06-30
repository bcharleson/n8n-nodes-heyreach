import { IExecuteFunctions } from 'n8n-workflow';
import { CampaignOperations } from './CampaignOperations';
import { LeadOperations } from './LeadOperations';
import { ListOperations } from './ListOperations';
import { AnalyticsOperations } from './AnalyticsOperations';
import { ConversationOperations } from './ConversationOperations';
import { NetworkOperations } from './NetworkOperations';
import { ResourceType, OperationType } from '../types/common';

/**
 * Main operation router that delegates to specific resource handlers
 */
export class OperationRouter {
	/**
	 * Route operation to appropriate handler based on resource and operation type
	 */
	static async execute(
		context: IExecuteFunctions,
		itemIndex: number,
		resource: ResourceType,
		operation: OperationType
	): Promise<any> {
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
	private static async handleCampaignOperation(
		context: IExecuteFunctions,
		itemIndex: number,
		operation: OperationType
	): Promise<any> {
		switch (operation) {
			case 'get':
				return await CampaignOperations.get(context, itemIndex);
			case 'getMany':
				return await CampaignOperations.getMany(context, itemIndex);
			case 'pause':
				return await CampaignOperations.pause(context, itemIndex);
			case 'resume':
				return await CampaignOperations.resume(context, itemIndex);
			case 'addLeads':
				return await CampaignOperations.addLeads(context, itemIndex);
			default:
				throw new Error(`Unknown campaign operation: ${operation}`);
		}
	}

	/**
	 * Handle lead operations
	 */
	private static async handleLeadOperation(
		context: IExecuteFunctions,
		itemIndex: number,
		operation: OperationType
	): Promise<any> {
		switch (operation) {
			case 'getLead':
				return await LeadOperations.get(context, itemIndex);
			case 'addTags':
				return await LeadOperations.addTags(context, itemIndex);
			case 'getTags':
				return await LeadOperations.getTags(context, itemIndex);
			case 'replaceTags':
				return await LeadOperations.replaceTags(context, itemIndex);
			case 'getLeadsFromCampaign':
				return await LeadOperations.getLeadsFromCampaign(context, itemIndex);
			case 'getCampaignsForLead':
				return await LeadOperations.getCampaignsForLead(context, itemIndex);
			case 'stopLeadInCampaign':
				return await LeadOperations.stopLeadInCampaign(context, itemIndex);
			case 'getLeadsFromList':
				return await LeadOperations.getLeadsFromList(context, itemIndex);
			case 'getListsForLead':
				return await LeadOperations.getListsForLead(context, itemIndex);
			case 'deleteLeadsFromList':
				return await LeadOperations.deleteLeadsFromList(context, itemIndex);
			default:
				throw new Error(`Unknown lead operation: ${operation}`);
		}
	}

	/**
	 * Handle list operations
	 */
	private static async handleListOperation(
		context: IExecuteFunctions,
		itemIndex: number,
		operation: OperationType
	): Promise<any> {
		switch (operation) {
			case 'getLists':
				return await ListOperations.getMany(context, itemIndex);
			case 'create':
				return await ListOperations.create(context, itemIndex);
			case 'addLeadsToList':
				return await ListOperations.addLeads(context, itemIndex);
			default:
				throw new Error(`Unknown list operation: ${operation}`);
		}
	}

	/**
	 * Handle analytics operations
	 */
	private static async handleAnalyticsOperation(
		context: IExecuteFunctions,
		itemIndex: number,
		operation: OperationType
	): Promise<any> {
		switch (operation) {
			case 'getOverallStats':
				return await AnalyticsOperations.getOverallStats(context, itemIndex);
			default:
				throw new Error(`Unknown analytics operation: ${operation}`);
		}
	}

	/**
	 * Handle conversation operations
	 */
	private static async handleConversationOperation(
		context: IExecuteFunctions,
		itemIndex: number,
		operation: OperationType
	): Promise<any> {
		switch (operation) {
			case 'getConversations':
				return await ConversationOperations.getMany(context, itemIndex);
			default:
				throw new Error(`Unknown conversation operation: ${operation}`);
		}
	}

	/**
	 * Handle network operations
	 */
	private static async handleNetworkOperation(
		context: IExecuteFunctions,
		itemIndex: number,
		operation: OperationType
	): Promise<any> {
		switch (operation) {
			case 'getForSender':
				return await NetworkOperations.getForSender(context, itemIndex);
			default:
				throw new Error(`Unknown network operation: ${operation}`);
		}
	}
}
