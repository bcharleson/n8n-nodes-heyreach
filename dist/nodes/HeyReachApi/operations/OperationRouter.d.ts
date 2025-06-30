import { IExecuteFunctions } from 'n8n-workflow';
import { ResourceType, OperationType } from '../types/common';
/**
 * Main operation router that delegates to specific resource handlers
 */
export declare class OperationRouter {
    /**
     * Route operation to appropriate handler based on resource and operation type
     */
    static execute(context: IExecuteFunctions, itemIndex: number, resource: ResourceType, operation: OperationType): Promise<any>;
    /**
     * Handle campaign operations
     */
    private static handleCampaignOperation;
    /**
     * Handle lead operations
     */
    private static handleLeadOperation;
    /**
     * Handle list operations
     */
    private static handleListOperation;
    /**
     * Handle analytics operations
     */
    private static handleAnalyticsOperation;
    /**
     * Handle conversation operations
     */
    private static handleConversationOperation;
    /**
     * Handle network operations
     */
    private static handleNetworkOperation;
}
//# sourceMappingURL=OperationRouter.d.ts.map