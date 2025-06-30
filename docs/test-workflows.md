# HeyReach n8n Node - Test Workflows

This document provides comprehensive test workflows for all 15 operations across the 6 HeyReach resources.

## Overview

The HeyReach n8n node provides 15 operations across 6 resources:
- **Campaign** (5 operations): get, getMany, pause, resume, addLeads
- **Lead** (3 operations): getLead, addTags, getTags  
- **List** (3 operations): getMany, create, addLeadsToList
- **Analytics** (1 operation): getOverallStats
- **Conversation** (1 operation): getMany
- **Network** (1 operation): getForSender

## Test Workflow 1: Campaign Management

### Scenario: Complete Campaign Lifecycle
This workflow demonstrates the full campaign management process from listing campaigns to adding leads.

**Workflow Steps:**
1. **Get Many Campaigns** - List all active campaigns
2. **Get Campaign** - Get details of a specific campaign
3. **Pause Campaign** - Pause the campaign for modifications
4. **Add Leads to Campaign** - Add new leads to the campaign
5. **Resume Campaign** - Resume the campaign execution

**Test Configuration:**

#### Step 1: Get Many Campaigns
```json
{
  "resource": "campaign",
  "operation": "getMany",
  "returnAll": false,
  "limit": 10,
  "additionalFields": {
    "statuses": ["IN_PROGRESS", "PAUSED"],
    "keyword": "LinkedIn Outreach"
  }
}
```

#### Step 2: Get Campaign (using campaign ID from step 1)
```json
{
  "resource": "campaign",
  "operation": "get",
  "campaignId": {
    "mode": "id",
    "value": "{{ $json.items[0].id }}"
  }
}
```

#### Step 3: Pause Campaign
```json
{
  "resource": "campaign",
  "operation": "pause",
  "campaignId": {
    "mode": "id", 
    "value": "{{ $json.id }}"
  }
}
```

#### Step 4: Add Leads to Campaign
```json
{
  "resource": "campaign",
  "operation": "addLeads",
  "campaignId": {
    "mode": "id",
    "value": "{{ $json.id }}"
  },
  "leadsInputMode": "single",
  "profileUrl": "https://www.linkedin.com/in/test-profile",
  "firstName": "John",
  "lastName": "Doe",
  "additionalLeadFields": {
    "companyName": "Test Company",
    "position": "Software Engineer",
    "location": "San Francisco, CA"
  }
}
```

#### Step 5: Resume Campaign
```json
{
  "resource": "campaign",
  "operation": "resume",
  "campaignId": {
    "mode": "id",
    "value": "{{ $json.campaignId }}"
  }
}
```

**Expected Results:**
- Step 1: List of campaigns with filtering applied
- Step 2: Detailed campaign information
- Step 3: Campaign status changed to "PAUSED"
- Step 4: Lead successfully added with count statistics
- Step 5: Campaign status changed to "IN_PROGRESS"

**Error Test Cases:**
- Invalid campaign ID (should return 404 error)
- Adding leads to DRAFT campaign (should return validation error)
- Invalid LinkedIn profile URL format (should return validation error)

## Test Workflow 2: Lead and List Management

### Scenario: Lead Research and Organization
This workflow demonstrates lead research, tagging, and list organization.

**Workflow Steps:**
1. **Create List** - Create a new lead list
2. **Get Lead** - Research a specific lead
3. **Add Tags** - Tag the lead for organization
4. **Add Lead to List** - Add the researched lead to the list
5. **Get Tags** - Verify tags were applied

**Test Configuration:**

#### Step 1: Create List
```json
{
  "resource": "list",
  "operation": "create",
  "listName": "Q4 Prospects - Software Engineers",
  "listType": "USER_LIST"
}
```

#### Step 2: Get Lead
```json
{
  "resource": "lead",
  "operation": "getLead",
  "profileUrl": "https://www.linkedin.com/in/software-engineer-profile"
}
```

#### Step 3: Add Tags
```json
{
  "resource": "lead",
  "operation": "addTags",
  "profileUrl": "https://www.linkedin.com/in/software-engineer-profile",
  "tags": "software-engineer, q4-prospect, high-priority",
  "createTagIfNotExisting": true
}
```

#### Step 4: Add Lead to List
```json
{
  "resource": "list",
  "operation": "addLeadsToList",
  "listId": {
    "mode": "id",
    "value": "{{ $json.id }}"
  },
  "leadsInputMode": "single",
  "profileUrl": "https://www.linkedin.com/in/software-engineer-profile",
  "firstName": "{{ $('Get Lead').item.json.firstName }}",
  "lastName": "{{ $('Get Lead').item.json.lastName }}",
  "additionalLeadFields": {
    "companyName": "{{ $('Get Lead').item.json.companyName }}",
    "position": "{{ $('Get Lead').item.json.position }}"
  }
}
```

#### Step 5: Get Tags
```json
{
  "resource": "lead",
  "operation": "getTags",
  "profileUrl": "https://www.linkedin.com/in/software-engineer-profile"
}
```

**Expected Results:**
- Step 1: New list created with unique ID
- Step 2: Complete lead profile information
- Step 3: Tags successfully added to lead
- Step 4: Lead added to list with statistics
- Step 5: List of all tags for the lead

**Error Test Cases:**
- Invalid LinkedIn profile URL (should return validation error)
- Empty list name (should return validation error)
- Invalid list ID (should return 404 error)

## Test Workflow 3: Analytics and Reporting

### Scenario: Campaign Performance Analysis
This workflow demonstrates comprehensive analytics and reporting capabilities.

**Workflow Steps:**
1. **Get Overall Stats (All Time)** - Get complete performance overview
2. **Get Overall Stats (Last 30 Days)** - Get recent performance data
3. **Get Overall Stats (Custom Range)** - Get specific date range analytics
4. **Get Overall Stats (Filtered)** - Get account-specific analytics

**Test Configuration:**

#### Step 1: Get Overall Stats (All Time)
```json
{
  "resource": "analytics",
  "operation": "getOverallStats",
  "dateRange": "all",
  "additionalFields": {
    "includeDailyBreakdown": true,
    "metricsToInclude": [
      "messagesSent",
      "messageReplies", 
      "connectionsSent",
      "connectionsAccepted",
      "replyRates"
    ]
  }
}
```

#### Step 2: Get Overall Stats (Last 30 Days)
```json
{
  "resource": "analytics",
  "operation": "getOverallStats",
  "dateRange": "last30days",
  "additionalFields": {
    "includeDailyBreakdown": true
  }
}
```

#### Step 3: Get Overall Stats (Custom Range)
```json
{
  "resource": "analytics",
  "operation": "getOverallStats",
  "dateRange": "custom",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.000Z",
  "additionalFields": {
    "includeDailyBreakdown": false,
    "campaignIds": "123,456,789"
  }
}
```

#### Step 4: Get Overall Stats (Account Filtered)
```json
{
  "resource": "analytics", 
  "operation": "getOverallStats",
  "dateRange": "last7days",
  "additionalFields": {
    "accountIds": "123,456",
    "metricsToInclude": ["profileViews", "messagesSent", "connectionsSent"]
  }
}
```

**Expected Results:**
- Step 1: Complete analytics with daily breakdown and filtered metrics
- Step 2: Last 30 days performance data with daily breakdown
- Step 3: January 2024 analytics for specific campaigns
- Step 4: Last 7 days data for specific accounts with selected metrics

**Error Test Cases:**
- Invalid date range (start date after end date)
- Future start date (should return validation error)
- Invalid campaign/account IDs (should return 400 error)

## Test Workflow 4: Conversation Management

### Scenario: Inbox Management and Conversation Analysis
This workflow demonstrates conversation filtering and management capabilities.

**Test Configuration:**

#### Get Conversations (Unread Only)
```json
{
  "resource": "conversation",
  "operation": "getConversations",
  "returnAll": false,
  "limit": 20,
  "additionalFields": {
    "readStatus": "unread",
    "includeMessages": true,
    "groupChatFilter": "individual",
    "dateRange": "last7days"
  }
}
```

#### Get Conversations (Campaign Specific)
```json
{
  "resource": "conversation",
  "operation": "getConversations",
  "returnAll": false,
  "limit": 50,
  "additionalFields": {
    "campaignId": "123",
    "readStatus": "all",
    "messageTypeFilter": ["TEXT", "IMAGE"]
  }
}
```

**Expected Results:**
- Filtered conversations based on criteria
- Enhanced conversation data with computed fields
- Proper sorting by most recent message

## Test Workflow 5: Network Analysis

### Scenario: LinkedIn Network Research and Analysis
This workflow demonstrates network access and connection analysis.

**Test Configuration:**

#### Get Network (Basic Search)
```json
{
  "resource": "network",
  "operation": "getForSender",
  "linkedInAccountId": "123456",
  "returnAll": false,
  "limit": 30,
  "additionalFields": {
    "searchKeyword": "software engineer",
    "includeProfileDetails": true,
    "includeContactInfo": false
  }
}
```

#### Get Network (Advanced Filtering)
```json
{
  "resource": "network",
  "operation": "getForSender", 
  "linkedInAccountId": "123456",
  "returnAll": false,
  "limit": 50,
  "additionalFields": {
    "companyFilter": "Microsoft",
    "locationFilter": "Seattle",
    "connectionLevel": "1st",
    "minConnections": 500,
    "maxConnections": 5000
  }
}
```

**Expected Results:**
- Filtered network connections with profile completeness scoring
- Enhanced data with computed fields and connection categorization
- Proper sorting by connection count for relevance

**Error Test Cases:**
- Invalid LinkedIn account ID (should return validation error)
- Access denied scenarios (should return 403 error)
- Min connections greater than max connections (should return validation error)

## Common Error Scenarios to Test

### Authentication Errors
- Invalid API key (should return 401 error)
- Missing API key (should return authentication error)

### Rate Limiting
- Rapid successive requests (should handle 429 errors gracefully)
- Respect 300 requests per minute limit

### Validation Errors
- Invalid LinkedIn profile URLs
- Invalid date formats
- Invalid ID formats
- Empty required fields

### API Limitations
- Non-existent endpoints (should return 404 errors)
- Invalid campaign states for operations
- Missing permissions for network access

## Performance Testing

### Large Dataset Handling
- Test pagination with returnAll=true
- Test large JSON lead imports
- Test filtering with large result sets

### Response Time Testing
- Measure response times for each operation
- Test timeout handling for slow API responses
- Verify proper error handling for timeouts

## Integration Testing

### Workflow Chaining
- Test data passing between operations
- Verify expression resolution works correctly
- Test error propagation through workflows

### Resource Locator Testing
- Test dropdown population for campaigns and lists
- Verify search functionality in resource locators
- Test manual ID input validation
