import { IExecuteFunctions } from 'n8n-workflow';
import { Campaign } from '../types/common';
/**
 * Campaign operations for HeyReach API
 */
export declare class CampaignOperations {
    /**
     * Get a single campaign by ID
     */
    static get(context: IExecuteFunctions, itemIndex: number): Promise<Campaign>;
    /**
     * Get many campaigns with pagination support
     */
    static getMany(context: IExecuteFunctions, itemIndex: number): Promise<Campaign[]>;
    /**
     * Pause a campaign
     * Note: HeyReach API sometimes returns 400 "You cannot pause an inactive campaign"
     * but still successfully pauses the campaign. We handle this inconsistency.
     */
    static pause(context: IExecuteFunctions, itemIndex: number): Promise<Campaign>;
    /**
     * Resume a campaign
     * Note: HeyReach API might have similar inconsistencies as pause operation
     */
    static resume(context: IExecuteFunctions, itemIndex: number): Promise<Campaign>;
    /**
     * Add leads to a campaign
     */
    static addLeads(context: IExecuteFunctions, itemIndex: number): Promise<any>;
    /**
     * Helper method to get campaign ID from resource locator
     */
    private static getCampaignId;
}
//# sourceMappingURL=CampaignOperations.d.ts.map