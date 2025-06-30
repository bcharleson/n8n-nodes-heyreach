import { IExecuteFunctions } from 'n8n-workflow';
import { Lead } from '../types/common';
/**
 * Lead operations for HeyReach API
 */
export declare class LeadOperations {
    /**
     * Get lead details by profile URL
     */
    static get(context: IExecuteFunctions, itemIndex: number): Promise<Lead>;
    /**
     * Add tags to a lead
     */
    static addTags(context: IExecuteFunctions, itemIndex: number): Promise<any>;
    /**
     * Get tags for a lead
     */
    static getTags(context: IExecuteFunctions, itemIndex: number): Promise<any>;
    /**
     * Replace tags for a lead
     */
    static replaceTags(context: IExecuteFunctions, itemIndex: number): Promise<any>;
    /**
     * Get leads from a campaign with automatic pagination
     */
    static getLeadsFromCampaign(context: IExecuteFunctions, itemIndex: number): Promise<any>;
    /**
     * Get campaigns for a lead
     */
    static getCampaignsForLead(context: IExecuteFunctions, itemIndex: number): Promise<any>;
    /**
     * Stop a lead in a campaign
     */
    static stopLeadInCampaign(context: IExecuteFunctions, itemIndex: number): Promise<any>;
    /**
     * Get leads from a list
     */
    static getLeadsFromList(context: IExecuteFunctions, itemIndex: number): Promise<any>;
    /**
     * Get lists for a lead
     */
    static getListsForLead(context: IExecuteFunctions, itemIndex: number): Promise<any>;
    /**
     * Delete leads from a list by profile URLs
     */
    static deleteLeadsFromList(context: IExecuteFunctions, itemIndex: number): Promise<any>;
    /**
     * Helper method to get campaign ID from resource locator
     */
    private static getCampaignId;
    /**
     * Helper method to get list ID from resource locator
     */
    private static getListId;
}
//# sourceMappingURL=LeadOperations.d.ts.map