/**
 * Type definitions for HeyReach API integration
 */

// Resource and Operation Types
export type ResourceType = 'campaign' | 'lead' | 'list' | 'analytics' | 'conversation' | 'network';

export type OperationType =
	// Campaign operations
	| 'get' | 'getMany' | 'pause' | 'resume' | 'addLeads'
	// Lead operations
	| 'getLead' | 'addTags' | 'getTags' | 'replaceTags' | 'getLeadsFromCampaign'
	| 'getCampaignsForLead' | 'stopLeadInCampaign' | 'getLeadsFromList'
	| 'getListsForLead' | 'deleteLeadsFromList'
	// List operations
	| 'getLists' | 'create' | 'addLeadsToList'
	// Analytics operations
	| 'getOverallStats'
	// Conversation operations
	| 'getConversations'
	// Network operations
	| 'getForSender';

// Campaign Types
export interface Campaign {
	id: number;
	name: string;
	status: 'DRAFT' | 'IN_PROGRESS' | 'PAUSED' | 'FINISHED' | 'CANCELED' | 'FAILED' | 'STARTING';
	creationTime: string;
	linkedInUserListName?: string;
	linkedInUserListId?: number;
	campaignAccountIds: number[];
	progressStats?: {
		totalUsers: number;
		totalUsersInProgress: number;
		totalUsersPending: number;
		totalUsersFinished: number;
		totalUsersFailed: number;
	};
	excludeAlreadyMessagedGlobal?: boolean;
	excludeAlreadyMessagedCampaignAccounts?: boolean;
	excludeFirstConnectionCampaignAccounts?: boolean;
	excludeFirstConnectionGlobal?: boolean;
	excludeNoProfilePicture?: boolean;
	excludeListId?: number;
}

// Lead Types
export interface Lead {
	id?: string;
	linkedin_id?: string;
	profileUrl: string;
	firstName: string;
	lastName: string;
	headline?: string;
	imageUrl?: string;
	location?: string;
	companyName?: string;
	companyUrl?: string;
	position?: string;
	about?: string;
	connections?: number;
	followers?: number;
	emailAddress?: string;
	customUserFields?: CustomUserField[];
	tags?: string[];
}

export interface CustomUserField {
	name: string;
	value: string;
}

// List Types
export interface LeadList {
	id: number;
	name: string;
	totalItemsCount?: number;
	count?: number;
	listType: 'USER_LIST' | 'COMPANY_LIST';
	creationTime: string;
	campaignIds?: number[];
	isDeleted?: boolean;
	campaigns?: any;
	search?: any;
	status?: string;
}

// Conversation Types
export interface Conversation {
	id: string;
	read: boolean;
	groupChat: boolean;
	blockedByMe: boolean;
	blockedByParticipant: boolean;
	lastMessageAt: string;
	lastMessageText: string;
	lastMessageType: 'TEXT' | 'IMAGE' | 'FILE';
	lastMessageSender: 'ME' | 'THEM';
	totalMessages: number;
	campaignId: number;
	linkedInAccountId: number;
	correspondentProfile: Lead;
	linkedInAccount?: LinkedInAccount;
	messages?: Message[];
}

export interface Message {
	createdAt: string;
	body: string;
	subject?: string;
	postLink?: string;
	isInMail: boolean;
	sender: 'ME' | 'THEM';
}

// LinkedIn Account Types
export interface LinkedInAccount {
	id: number;
	emailAddress: string;
	firstName: string;
	lastName: string;
	isActive: boolean;
	activeCampaigns: number;
	authIsValid: boolean;
	isValidNavigator: boolean;
	isValidRecruiter: boolean;
}

// Network Types
export interface MyNetworkProfile {
	linkedin_id: string;
	profileUrl: string;
	firstName: string;
	lastName: string;
	headline: string;
	imageUrl: string;
	location: string;
	companyName: string;
	companyUrl: string;
	position: string;
	about: string;
	connections: number;
	followers: number;
	emailAddress: string;
}

// Analytics Types
export interface OverallStats {
	byDayStats: Record<string, DayStats>;
	overallStats: DayStats;
}

export interface DayStats {
	profileViews: number;
	postLikes: number;
	follows: number;
	messagesSent: number;
	totalMessageStarted: number;
	totalMessageReplies: number;
	inmailMessagesSent: number;
	totalInmailStarted: number;
	totalInmailReplies: number;
	connectionsSent: number;
	connectionsAccepted: number;
	messageReplyRate: number;
	inMailReplyRate: number;
	connectionAcceptanceRate: number;
}

// API Response Types
export interface PaginatedResponse<T> {
	totalCount: number;
	items: T[];
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}

// Request Types
export interface AccountLeadPair {
	linkedInAccountId?: number;
	lead: Lead;
}

export interface AddLeadsToCampaignRequest {
	campaignId: number;
	accountLeadPairs: AccountLeadPair[];
}

export interface AddLeadsToListRequest {
	listId: number;
	leads: Lead[];
}

// Pagination Options
export interface IPaginationOptions {
	returnAll?: boolean;
	limit?: number;
	offset?: number;
}
