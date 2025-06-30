import { IExecuteFunctions } from 'n8n-workflow';
import { MyNetworkProfile } from '../types/common';
/**
 * Network operations for HeyReach API
 */
export declare class NetworkOperations {
    /**
     * Get LinkedIn network for specific sender
     */
    static getForSender(context: IExecuteFunctions, itemIndex: number): Promise<MyNetworkProfile[]>;
    /**
     * Process network profiles with additional computed fields
     */
    private static processNetworkProfiles;
    /**
     * Determine connection level based on connection count
     */
    private static determineConnectionLevel;
    /**
     * Calculate profile completeness score
     */
    private static calculateProfileCompleteness;
}
//# sourceMappingURL=NetworkOperations.d.ts.map