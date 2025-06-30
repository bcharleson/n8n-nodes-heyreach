import { IExecuteFunctions } from 'n8n-workflow';
import { Conversation } from '../types/common';
/**
 * Conversation operations for HeyReach API
 */
export declare class ConversationOperations {
    /**
     * Get conversations with filtering
     */
    static getMany(context: IExecuteFunctions, itemIndex: number): Promise<Conversation[]>;
    /**
     * Process conversations based on additional filtering options
     */
    private static processConversations;
}
//# sourceMappingURL=ConversationOperations.d.ts.map