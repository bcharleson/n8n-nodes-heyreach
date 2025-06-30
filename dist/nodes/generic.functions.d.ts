import { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an API request to HeyReach
 */
export declare function heyReachApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
/**
 * Make an API request to HeyReach with automatic pagination
 * This function fetches ALL available items (ignores any limit in body)
 */
export declare function heyReachApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any[]>;
/**
 * Validate campaign status for operations that require ACTIVE campaigns
 */
export declare function validateCampaignStatus(campaign: any, operation: string): void;
/**
 * Validate LinkedIn profile URL format
 * Supports international characters, numbers, hyphens, and common LinkedIn profile formats
 */
export declare function validateLinkedInProfileUrl(url: string): boolean;
/**
 * Get detailed LinkedIn profile URL validation error message
 */
export declare function getLinkedInUrlValidationError(url: string): string;
/**
 * Validate custom user field names (alphanumeric + underscore only)
 */
export declare function validateCustomFieldName(name: string): boolean;
/**
 * Format date for HeyReach API (ISO 8601 format)
 */
export declare function formatDateForApi(date: string | Date): string;
/**
 * Validate and parse integer ID from string or number
 */
export declare function validateAndParseId(id: any, fieldName: string): number;
/**
 * Validate date range
 */
export declare function validateDateRange(startDate: string, endDate: string): void;
/**
 * Parse comma-separated IDs and validate them
 */
export declare function parseAndValidateIds(idsString: string, fieldName: string): number[];
/**
 * Sanitize search keyword for API requests
 */
export declare function sanitizeSearchKeyword(keyword: string): string;
/**
 * Validate pagination parameters
 */
export declare function validatePaginationParams(limit: number, returnAll: boolean): void;
//# sourceMappingURL=generic.functions.d.ts.map