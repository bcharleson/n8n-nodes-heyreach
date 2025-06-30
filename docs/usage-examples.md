# HeyReach n8n Node - Usage Examples

This document provides comprehensive usage examples for all HeyReach operations with real-world scenarios.

## Table of Contents
- [Campaign Operations](#campaign-operations)
- [Lead Operations](#lead-operations)
- [List Operations](#list-operations)
- [Analytics Operations](#analytics-operations)
- [Conversation Operations](#conversation-operations)
- [Network Operations](#network-operations)
- [Common Workflow Patterns](#common-workflow-patterns)

## Campaign Operations

### Get Campaign
Retrieve detailed information about a specific campaign.

**Use Case:** Check campaign status and configuration before making changes.

```json
{
  "resource": "campaign",
  "operation": "get",
  "campaignId": {
    "mode": "list",
    "value": "12345"
  }
}
```

**Response Example:**
```json
{
  "id": 12345,
  "name": "Q4 Software Engineer Outreach",
  "status": "IN_PROGRESS",
  "creationTime": "2024-01-15T10:30:00Z",
  "campaignAccountIds": [123, 456],
  "progressStats": {
    "totalUsers": 500,
    "totalUsersInProgress": 150,
    "totalUsersPending": 300,
    "totalUsersFinished": 50
  }
}
```

### Get Many Campaigns
List campaigns with filtering options.

**Use Case:** Find all paused campaigns that need attention.

```json
{
  "resource": "campaign",
  "operation": "getMany",
  "returnAll": false,
  "limit": 25,
  "additionalFields": {
    "statuses": ["PAUSED"],
    "keyword": "outreach",
    "accountIds": "123,456"
  }
}
```

### Pause Campaign
Temporarily stop a campaign.

**Use Case:** Pause campaign for lead list updates or message modifications.

```json
{
  "resource": "campaign",
  "operation": "pause",
  "campaignId": {
    "mode": "id",
    "value": "12345"
  }
}
```

### Resume Campaign
Restart a paused campaign.

**Use Case:** Resume campaign after making necessary updates.

```json
{
  "resource": "campaign",
  "operation": "resume",
  "campaignId": {
    "mode": "id",
    "value": "12345"
  }
}
```

### Add Leads to Campaign
Add new prospects to an active campaign.

**Single Lead Example:**
```json
{
  "resource": "campaign",
  "operation": "addLeads",
  "campaignId": {
    "mode": "id",
    "value": "12345"
  },
  "leadsInputMode": "single",
  "profileUrl": "https://www.linkedin.com/in/john-doe-engineer",
  "firstName": "John",
  "lastName": "Doe",
  "additionalLeadFields": {
    "linkedInAccountId": 123,
    "companyName": "Tech Corp",
    "position": "Senior Software Engineer",
    "location": "San Francisco, CA",
    "emailAddress": "john.doe@techcorp.com",
    "customUserFields": {
      "field": [
        {
          "name": "lead_source",
          "value": "linkedin_search"
        },
        {
          "name": "priority_level",
          "value": "high"
        }
      ]
    }
  }
}
```

**Bulk JSON Example:**
```json
{
  "resource": "campaign",
  "operation": "addLeads",
  "campaignId": {
    "mode": "id",
    "value": "12345"
  },
  "leadsInputMode": "json",
  "leadsJson": "[{\"profileUrl\":\"https://www.linkedin.com/in/jane-smith\",\"firstName\":\"Jane\",\"lastName\":\"Smith\",\"companyName\":\"StartupXYZ\",\"position\":\"CTO\",\"linkedInAccountId\":123},{\"profileUrl\":\"https://www.linkedin.com/in/bob-wilson\",\"firstName\":\"Bob\",\"lastName\":\"Wilson\",\"companyName\":\"Enterprise Inc\",\"position\":\"VP Engineering\",\"linkedInAccountId\":456}]"
}
```

## Lead Operations

### Get Lead
Retrieve detailed information about a specific lead.

**Use Case:** Research a prospect before adding them to a campaign.

```json
{
  "resource": "lead",
  "operation": "getLead",
  "profileUrl": "https://www.linkedin.com/in/target-prospect"
}
```

**Response Example:**
```json
{
  "profileUrl": "https://www.linkedin.com/in/target-prospect",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "headline": "VP of Engineering at TechStart",
  "location": "Austin, Texas",
  "companyName": "TechStart",
  "position": "VP of Engineering",
  "connections": 1250,
  "about": "Experienced engineering leader with 10+ years..."
}
```

### Add Tags
Organize leads with descriptive tags.

**Use Case:** Tag leads based on industry, seniority, or campaign response.

```json
{
  "resource": "lead",
  "operation": "addTags",
  "profileUrl": "https://www.linkedin.com/in/target-prospect",
  "tags": "vp-level, tech-industry, austin-based, high-priority",
  "createTagIfNotExisting": true
}
```

### Get Tags
Retrieve all tags associated with a lead.

**Use Case:** Check current lead categorization before campaign assignment.

```json
{
  "resource": "lead",
  "operation": "getTags",
  "profileUrl": "https://www.linkedin.com/in/target-prospect"
}
```

## List Operations

### Get Many Lists
Retrieve all available lead lists.

**Use Case:** Review existing lists before creating a new campaign.

```json
{
  "resource": "list",
  "operation": "getLists",
  "returnAll": false,
  "limit": 20
}
```

**Response Example:**
```json
[
  {
    "id": 789,
    "name": "Q4 Enterprise Prospects",
    "listType": "USER_LIST",
    "totalItemsCount": 150,
    "creationTime": "2024-01-10T09:00:00Z"
  },
  {
    "id": 790,
    "name": "Startup CTOs",
    "listType": "USER_LIST", 
    "totalItemsCount": 75,
    "creationTime": "2024-01-12T14:30:00Z"
  }
]
```

### Create List
Create a new lead or company list.

**Use Case:** Organize prospects by industry, role, or campaign type.

```json
{
  "resource": "list",
  "operation": "create",
  "listName": "SaaS VP Engineering Prospects - Q1 2024",
  "listType": "USER_LIST"
}
```

### Add Leads to List
Add prospects to an existing list for organization.

**Use Case:** Build targeted prospect lists for specific campaigns.

```json
{
  "resource": "list",
  "operation": "addLeadsToList",
  "listId": {
    "mode": "list",
    "value": "789"
  },
  "leadsInputMode": "single",
  "profileUrl": "https://www.linkedin.com/in/new-prospect",
  "firstName": "Michael",
  "lastName": "Chen",
  "additionalLeadFields": {
    "companyName": "CloudTech Solutions",
    "position": "VP Engineering",
    "location": "Seattle, WA"
  }
}
```

## Analytics Operations

### Get Overall Stats
Retrieve comprehensive campaign performance analytics.

**All-Time Analytics:**
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
      "messageReplyRate",
      "connectionAcceptanceRate"
    ]
  }
}
```

**Campaign-Specific Analytics:**
```json
{
  "resource": "analytics",
  "operation": "getOverallStats",
  "dateRange": "last30days",
  "additionalFields": {
    "campaignIds": "12345,12346,12347",
    "includeDailyBreakdown": true
  }
}
```

**Account-Specific Analytics:**
```json
{
  "resource": "analytics",
  "operation": "getOverallStats",
  "dateRange": "custom",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.000Z",
  "additionalFields": {
    "accountIds": "123,456",
    "metricsToInclude": ["profileViews", "messagesSent", "connectionsSent"]
  }
}
```

**Response Example:**
```json
{
  "overallStats": {
    "messagesSent": 1250,
    "messageReplies": 187,
    "connectionsSent": 890,
    "connectionsAccepted": 267,
    "messageReplyRate": 14.96,
    "connectionAcceptanceRate": 30.0
  },
  "byDayStats": {
    "2024-01-15": {
      "messagesSent": 45,
      "messageReplies": 7,
      "connectionsSent": 32,
      "connectionsAccepted": 9
    }
  },
  "dateRange": "custom",
  "filters": {
    "accountIds": [123, 456],
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T23:59:59.000Z"
  }
}
```

## Conversation Operations

### Get Many Conversations
Retrieve and filter LinkedIn conversations.

**Unread Messages Only:**
```json
{
  "resource": "conversation",
  "operation": "getConversations",
  "returnAll": false,
  "limit": 30,
  "additionalFields": {
    "readStatus": "unread",
    "includeMessages": true,
    "groupChatFilter": "individual",
    "dateRange": "last7days"
  }
}
```

**Campaign-Specific Conversations:**
```json
{
  "resource": "conversation",
  "operation": "getConversations",
  "returnAll": false,
  "limit": 50,
  "additionalFields": {
    "campaignId": "12345",
    "readStatus": "all",
    "messageTypeFilter": ["TEXT"],
    "linkedInAccountId": "123"
  }
}
```

**Response Example:**
```json
[
  {
    "id": "conv_123",
    "read": false,
    "groupChat": false,
    "lastMessageAt": "2024-01-15T14:30:00Z",
    "lastMessageText": "Thanks for connecting! I'd love to learn more about your role.",
    "lastMessageType": "TEXT",
    "lastMessageSender": "THEM",
    "totalMessages": 3,
    "campaignId": 12345,
    "correspondentProfile": {
      "firstName": "Alex",
      "lastName": "Rodriguez",
      "headline": "Senior Developer at StartupCorp"
    },
    "isUnread": true,
    "hasMessages": true,
    "lastMessageAge": 2,
    "correspondentName": "Alex Rodriguez"
  }
]
```

## Network Operations

### Get For Sender
Access LinkedIn network connections for prospecting.

**Basic Network Search:**
```json
{
  "resource": "network",
  "operation": "getForSender",
  "linkedInAccountId": "123456",
  "returnAll": false,
  "limit": 40,
  "additionalFields": {
    "searchKeyword": "software engineer",
    "includeProfileDetails": true,
    "includeContactInfo": false
  }
}
```

**Advanced Network Filtering:**
```json
{
  "resource": "network",
  "operation": "getForSender",
  "linkedInAccountId": "123456",
  "returnAll": false,
  "limit": 25,
  "additionalFields": {
    "companyFilter": "Google",
    "locationFilter": "Mountain View",
    "connectionLevel": "1st",
    "minConnections": 500,
    "maxConnections": 5000,
    "includeProfileDetails": true
  }
}
```

**Response Example:**
```json
[
  {
    "linkedin_id": "abc123",
    "profileUrl": "https://www.linkedin.com/in/network-connection",
    "firstName": "Emma",
    "lastName": "Thompson",
    "headline": "Senior Software Engineer at Google",
    "location": "Mountain View, CA",
    "companyName": "Google",
    "position": "Senior Software Engineer",
    "connections": 1200,
    "fullName": "Emma Thompson",
    "hasEmail": false,
    "hasCompany": true,
    "hasLocation": true,
    "connectionLevel": "Well Connected (100-499)",
    "profileCompleteness": 87
  }
]
```

## Common Workflow Patterns

### Pattern 1: Lead Research and Campaign Addition
1. **Get Lead** → Research prospect details
2. **Add Tags** → Categorize the lead
3. **Add Leads to Campaign** → Add to appropriate campaign
4. **Get Overall Stats** → Monitor campaign performance

### Pattern 2: List Building and Campaign Creation
1. **Create List** → Create targeted prospect list
2. **Get Network** → Find relevant connections
3. **Add Leads to List** → Build the prospect list
4. **Get Many Campaigns** → Find suitable campaign
5. **Add Leads to Campaign** → Launch outreach

### Pattern 3: Performance Monitoring and Optimization
1. **Get Overall Stats** → Review performance metrics
2. **Get Conversations** → Check response quality
3. **Get Many Campaigns** → Identify underperforming campaigns
4. **Pause Campaign** → Stop poor performers
5. **Resume Campaign** → Restart optimized campaigns

### Pattern 4: Inbox Management and Follow-up
1. **Get Conversations** (unread) → Find new responses
2. **Get Lead** → Research responding prospects
3. **Add Tags** → Update lead categorization
4. **Get Conversations** (by campaign) → Track campaign responses

### Pattern 5: Network Prospecting and List Building
1. **Get Network** → Find relevant connections
2. **Get Lead** → Research each prospect
3. **Create List** → Create targeted list
4. **Add Leads to List** → Build prospect database
5. **Add Leads to Campaign** → Launch outreach sequence

## Best Practices

### Error Handling
- Always validate LinkedIn profile URLs before API calls
- Check campaign status before adding leads
- Handle rate limiting gracefully (300 req/min)
- Implement retry logic for temporary failures

### Performance Optimization
- Use pagination for large datasets
- Filter results at the API level when possible
- Cache frequently accessed data (campaign lists, etc.)
- Batch operations when adding multiple leads

### Data Management
- Use consistent tagging strategies
- Organize lists by campaign type or target audience
- Regular cleanup of old campaigns and lists
- Monitor analytics to optimize performance

### Security Considerations
- Store API keys securely in n8n credentials
- Validate all user inputs
- Respect LinkedIn's terms of service
- Monitor API usage to stay within limits
