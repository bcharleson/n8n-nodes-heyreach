import { IExecuteFunctions } from 'n8n-workflow';
import { LeadList } from '../types/common';
/**
 * List operations for HeyReach API
 */
export declare class ListOperations {
    /**
     * Get many lists with pagination support
     */
    static getMany(context: IExecuteFunctions, itemIndex: number): Promise<LeadList[]>;
    /**
     * Create a new empty list
     */
    static create(context: IExecuteFunctions, itemIndex: number): Promise<LeadList>;
    /**
     * Add leads to a list
     */
    static addLeads(context: IExecuteFunctions, itemIndex: number): Promise<any>;
    /**
     * Helper method to get list ID from resource locator
     */
    private static getListId;
}
//# sourceMappingURL=ListOperations.d.ts.map