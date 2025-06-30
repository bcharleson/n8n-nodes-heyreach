import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	NodeApiError,
	NodeOperationError,
	IRequestOptions,
	IHttpRequestMethods,
} from 'n8n-workflow';

/**
 * Make an API request to HeyReach
 */
export async function heyReachApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {
	const requestStartTime = Date.now();
	console.log('🌐 heyReachApiRequest() - Starting API request at:', new Date().toISOString());
	console.log('🌐 heyReachApiRequest() - Method:', method);
	console.log('🌐 heyReachApiRequest() - Endpoint:', endpoint);
	console.log('🌐 heyReachApiRequest() - Body:', JSON.stringify(body, null, 2));

	const credentials = await this.getCredentials('heyReachApi');

	if (credentials === undefined) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}

	const options: IRequestOptions = {
		headers: {
			'X-API-KEY': credentials.apiKey,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		method,
		body,
		qs,
		url: `https://api.heyreach.io/api/public${endpoint}`,
		json: true,
		timeout: 60000, // 60 second timeout for HeyReach API (as per documentation)
	};

	// Remove empty body for GET requests
	if (method === 'GET') {
		delete options.body;
	}

	console.log('🌐 heyReachApiRequest() - Full URL:', options.url);
	console.log('🌐 heyReachApiRequest() - Headers:', JSON.stringify(options.headers, null, 2));
	console.log('🌐 heyReachApiRequest() - Timeout:', options.timeout, 'ms');

	try {
		console.log('🚀 heyReachApiRequest() - Making HTTP request...');
		const httpStartTime = Date.now();

		const response = await this.helpers.request(options);

		const httpEndTime = Date.now();
		const totalTime = httpEndTime - requestStartTime;
		const httpTime = httpEndTime - httpStartTime;

		console.log('✅ heyReachApiRequest() - HTTP request completed successfully');
		console.log('⏱️  heyReachApiRequest() - HTTP request took:', httpTime, 'ms');
		console.log('⏱️  heyReachApiRequest() - Total API request took:', totalTime, 'ms');
		console.log('📦 heyReachApiRequest() - Response type:', typeof response);
		console.log('📦 heyReachApiRequest() - Response keys:', Object.keys(response || {}));

		return response;
	} catch (error: any) {
		const errorTime = Date.now();
		const totalTime = errorTime - requestStartTime;

		console.error('❌ heyReachApiRequest() - HTTP request failed');
		console.error('⏱️  heyReachApiRequest() - Failed request took:', totalTime, 'ms');
		console.error('💥 heyReachApiRequest() - Error type:', error.constructor.name);
		console.error('💥 heyReachApiRequest() - Error message:', error.message);
		console.error('💥 heyReachApiRequest() - Error status:', error.response?.status);
		console.error('💥 heyReachApiRequest() - Error body:', error.response?.body);
		// Handle HeyReach-specific errors
		if (error.response?.body) {
			const errorBody = error.response.body;

			// Handle different error formats
			if (typeof errorBody === 'string') {
				throw new NodeApiError(this.getNode(), error, {
					message: errorBody,
					description: `HeyReach API Error: ${errorBody}`,
				});
			}

			if (errorBody.error || errorBody.message) {
				throw new NodeApiError(this.getNode(), error, {
					message: errorBody.error || errorBody.message,
					description: `HeyReach API Error: ${errorBody.error || errorBody.message}`,
				});
			}
		}

		// Handle HTTP status codes
		if (error.response?.status) {
			const status = error.response.status;
			let message = `HTTP ${status} Error`;
			let description = '';

			switch (status) {
				case 401:
					message = 'Authentication failed';
					description = 'Please check your HeyReach API key in the credentials.';
					break;
				case 403:
					message = 'Access forbidden';
					description = 'Your API key does not have permission to access this resource.';
					break;
				case 404:
					message = 'Resource not found';
					description = 'The requested endpoint or resource does not exist. This may indicate an API documentation discrepancy.';
					break;
				case 429:
					message = 'Rate limit exceeded';
					description = 'HeyReach allows a maximum of 300 requests per minute. Please wait before making more requests.';
					break;
				case 400:
					// Special handling for campaign pause/resume operations
					// Allow these specific errors to bubble up to CampaignOperations for custom handling
					if (error.message && (
						error.message.includes('You cannot pause an inactive campaign') ||
						error.message.includes('cannot resume') ||
						error.message.includes('not paused, finished or failed')
					)) {
						console.log('🔄 heyReachApiRequest() - Allowing campaign operation error to bubble up for custom handling');
						throw error; // Re-throw the original error, not a NodeApiError
					}
					message = 'Bad request';
					description = 'The request was invalid. Please check your parameters and try again.';
					break;
				case 500:
					message = 'Internal server error';
					description = 'HeyReach API is experiencing issues. Please try again later.';
					break;
			}

			throw new NodeApiError(this.getNode(), error, {
				message,
				description,
			});
		}

		// Generic error handling
		throw new NodeApiError(this.getNode(), error);
	}
}

/**
 * Make an API request to HeyReach with automatic pagination
 * This function fetches ALL available items (ignores any limit in body)
 */
export async function heyReachApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any[]> {
	const returnData: IDataObject[] = [];
	let responseData;

	// Set initial pagination parameters
	body.offset = body.offset || 0;
	body.limit = 100; // Always use API maximum for "get all" operations

	do {
		responseData = await heyReachApiRequest.call(this, method, endpoint, body, qs);

		if (responseData.items && Array.isArray(responseData.items)) {
			returnData.push(...responseData.items);

			// Update offset for next request
			body.offset = (body.offset as number) + (body.limit as number);

			// Check if we have more items to fetch
			if (responseData.items.length < (body.limit as number) ||
				returnData.length >= (responseData.totalCount || 0)) {
				break;
			}
		} else {
			// If response doesn't have items array, return the response as is
			returnData.push(responseData);
			break;
		}
	} while (true);

	return returnData;
}

/**
 * Validate campaign status for operations that require ACTIVE campaigns
 */
export function validateCampaignStatus(campaign: any, operation: string): void {
	if (!campaign) {
		throw new NodeOperationError(
			{} as any,
			'Campaign not found. Please check the campaign ID.',
		);
	}

	const validStatuses = ['IN_PROGRESS', 'PAUSED'];
	if (!validStatuses.includes(campaign.status)) {
		throw new NodeOperationError(
			{} as any,
			`Cannot ${operation} for campaign with status "${campaign.status}". Campaign must be IN_PROGRESS or PAUSED. Current status: ${campaign.status}`,
		);
	}

	if (!campaign.campaignAccountIds || campaign.campaignAccountIds.length === 0) {
		throw new NodeOperationError(
			{} as any,
			`Cannot ${operation} for campaign "${campaign.name}". Campaign must have LinkedIn accounts assigned.`,
		);
	}
}

/**
 * Validate LinkedIn profile URL format
 * Supports international characters, numbers, hyphens, and common LinkedIn profile formats
 */
export function validateLinkedInProfileUrl(url: string): boolean {
	// Handle null/undefined/empty strings
	if (!url || typeof url !== 'string' || url.trim() === '') {
		console.log('validateLinkedInProfileUrl() - Invalid input: URL is null, undefined, or empty');
		return false;
	}

	// Trim whitespace
	const trimmedUrl = url.trim();

	// Updated pattern to support:
	// - International/Unicode characters (\p{L} for letters)
	// - Numbers (\p{N})
	// - Hyphens and common punctuation
	// - LinkedIn's various profile URL formats
	const linkedInUrlPattern = /^https:\/\/(www\.)?linkedin\.com\/in\/[\p{L}\p{N}\-_.%]+\/?$/u;

	let isValid = false;
	try {
		isValid = linkedInUrlPattern.test(trimmedUrl);
	} catch (error) {
		console.log('validateLinkedInProfileUrl() - Regex test failed:', error);
		// Fallback to simpler pattern if Unicode regex fails
		const fallbackPattern = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_.%]+\/?$/;
		isValid = fallbackPattern.test(trimmedUrl);
		console.log('validateLinkedInProfileUrl() - Using fallback pattern, result:', isValid);
	}

	// Debug: Log validation details
	console.log('validateLinkedInProfileUrl() - URL:', JSON.stringify(trimmedUrl));
	console.log('validateLinkedInProfileUrl() - Pattern:', linkedInUrlPattern.toString());
	console.log('validateLinkedInProfileUrl() - Is valid:', isValid);

	return isValid;
}

/**
 * Get detailed LinkedIn profile URL validation error message
 */
export function getLinkedInUrlValidationError(url: string): string {
	if (!url || typeof url !== 'string' || url.trim() === '') {
		return 'LinkedIn Profile URL is required and cannot be empty';
	}

	const trimmedUrl = url.trim();

	if (!trimmedUrl.startsWith('https://')) {
		return `LinkedIn Profile URL must start with "https://". Current URL: "${trimmedUrl}"`;
	}

	if (!trimmedUrl.includes('linkedin.com/in/')) {
		return `LinkedIn Profile URL must contain "linkedin.com/in/". Current URL: "${trimmedUrl}"`;
	}

	// Check for common issues
	if (trimmedUrl.includes('?')) {
		return `LinkedIn Profile URL should not contain query parameters. Remove everything after "?" from: "${trimmedUrl}"`;
	}

	if (trimmedUrl.includes('#')) {
		return `LinkedIn Profile URL should not contain hash fragments. Remove everything after "#" from: "${trimmedUrl}"`;
	}

	// If we get here, it's a more complex validation issue
	return `LinkedIn Profile URL format is invalid. Expected format: "https://www.linkedin.com/in/username". Current URL: "${trimmedUrl}"`;
}

/**
 * Validate custom user field names (alphanumeric + underscore only)
 */
export function validateCustomFieldName(name: string): boolean {
	const validNamePattern = /^[a-zA-Z0-9_]+$/;
	return validNamePattern.test(name);
}

/**
 * Format date for HeyReach API (ISO 8601 format)
 */
export function formatDateForApi(date: string | Date): string {
	if (typeof date === 'string') {
		return new Date(date).toISOString();
	}
	return date.toISOString();
}

/**
 * Validate and parse integer ID from string or number
 */
export function validateAndParseId(id: any, fieldName: string): number {
	if (typeof id === 'number') {
		return id;
	}

	if (typeof id === 'string') {
		const parsed = parseInt(id, 10);
		if (isNaN(parsed) || parsed <= 0) {
			throw new Error(`Invalid ${fieldName}: ${id}. Must be a positive integer.`);
		}
		return parsed;
	}

	throw new Error(`${fieldName} is required and must be a number.`);
}

/**
 * Validate date range
 */
export function validateDateRange(startDate: string, endDate: string): void {
	const start = new Date(startDate);
	const end = new Date(endDate);

	if (isNaN(start.getTime())) {
		throw new Error(`Invalid start date format: ${startDate}`);
	}

	if (isNaN(end.getTime())) {
		throw new Error(`Invalid end date format: ${endDate}`);
	}

	if (start >= end) {
		throw new Error('Start date must be before end date');
	}

	// Check if date range is not too far in the future
	const now = new Date();
	if (start > now) {
		throw new Error('Start date cannot be in the future');
	}
}

/**
 * Parse comma-separated IDs and validate them
 */
export function parseAndValidateIds(idsString: string, fieldName: string): number[] {
	if (!idsString || idsString.trim().length === 0) {
		return [];
	}

	const ids = idsString
		.split(',')
		.map(id => id.trim())
		.filter(id => id.length > 0)
		.map(id => {
			const parsed = parseInt(id, 10);
			if (isNaN(parsed) || parsed <= 0) {
				throw new Error(`Invalid ${fieldName}: ${id}. All IDs must be positive integers.`);
			}
			return parsed;
		});

	// Remove duplicates
	return [...new Set(ids)];
}

/**
 * Sanitize search keyword for API requests
 */
export function sanitizeSearchKeyword(keyword: string): string {
	if (!keyword || typeof keyword !== 'string') {
		return '';
	}

	// Remove special characters that might cause API issues
	return keyword
		.trim()
		.replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
		.substring(0, 100); // Limit length
}

/**
 * Validate pagination parameters
 */
export function validatePaginationParams(limit: number, returnAll: boolean): void {
	if (!returnAll && (limit <= 0 || limit > 100)) {
		throw new Error('Limit must be between 1 and 100 when not returning all results');
	}
}
