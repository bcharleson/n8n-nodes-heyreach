# HeyReach n8n Node - Parameter Reference

Complete reference for all parameters across all HeyReach operations.

## Table of Contents
- [Campaign Parameters](#campaign-parameters)
- [Lead Parameters](#lead-parameters)
- [List Parameters](#list-parameters)
- [Analytics Parameters](#analytics-parameters)
- [Conversation Parameters](#conversation-parameters)
- [Network Parameters](#network-parameters)

## Campaign Parameters

### Get Campaign
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `campaignId` | Resource Locator | Yes | Campaign to retrieve | `12345` |

### Get Many Campaigns
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `returnAll` | Boolean | No | Return all results | `false` |
| `limit` | Number | No | Max results (1-100) | `50` |
| `keyword` | String | No | Search by campaign name | `"outreach"` |
| `statuses` | Multi-Select | No | Filter by status | `["IN_PROGRESS", "PAUSED"]` |
| `accountIds` | String | No | Comma-separated account IDs | `"123,456,789"` |

**Status Options:**
- `DRAFT` - Campaign in draft state
- `IN_PROGRESS` - Currently running
- `PAUSED` - Temporarily stopped
- `FINISHED` - Completed
- `CANCELED` - Canceled
- `FAILED` - Failed to execute
- `STARTING` - Starting up

### Pause/Resume Campaign
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `campaignId` | Resource Locator | Yes | Campaign to pause/resume | `12345` |

### Add Leads to Campaign
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `campaignId` | Resource Locator | Yes | Target campaign | `12345` |
| `leadsInputMode` | Options | Yes | Input method | `"single"` or `"json"` |

**Single Lead Mode:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `profileUrl` | String | Yes | LinkedIn profile URL | `"https://www.linkedin.com/in/john-doe"` |
| `firstName` | String | Yes | First name | `"John"` |
| `lastName` | String | Yes | Last name | `"Doe"` |
| `linkedInAccountId` | Number | No | Specific account to use | `123` |
| `location` | String | No | Geographic location | `"San Francisco, CA"` |
| `companyName` | String | No | Company name | `"Tech Corp"` |
| `position` | String | No | Job title | `"Software Engineer"` |
| `summary` | String | No | Professional headline | `"Senior Developer"` |
| `about` | String | No | About section | `"Experienced developer..."` |
| `emailAddress` | String | No | Email address | `"john@example.com"` |
| `customUserFields` | Collection | No | Custom fields | See below |

**Custom Fields Format:**
```json
{
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
```

**JSON Mode:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `leadsJson` | JSON | Yes | Array of lead objects | See usage examples |

## Lead Parameters

### Get Lead
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `profileUrl` | String | Yes | LinkedIn profile URL | `"https://www.linkedin.com/in/target"` |

### Add Tags
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `profileUrl` | String | Yes | LinkedIn profile URL | `"https://www.linkedin.com/in/target"` |
| `tags` | String | Yes | Comma-separated tags | `"engineer, senior, priority"` |
| `createTagIfNotExisting` | Boolean | No | Create new tags | `true` |

### Get Tags
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `profileUrl` | String | Yes | LinkedIn profile URL | `"https://www.linkedin.com/in/target"` |

## List Parameters

### Get Many Lists
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `returnAll` | Boolean | No | Return all results | `false` |
| `limit` | Number | No | Max results (1-100) | `50` |

### Create List
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `listName` | String | Yes | Name for the new list | `"Q4 Prospects"` |
| `listType` | Options | Yes | Type of list | `"USER_LIST"` or `"COMPANY_LIST"` |

### Add Leads to List
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `listId` | Resource Locator | Yes | Target list | `789` |
| `leadsInputMode` | Options | Yes | Input method | `"single"` or `"json"` |

**Single Lead Mode:** (Same as Campaign > Add Leads, minus `linkedInAccountId`)

**JSON Mode:** (Same as Campaign > Add Leads)

## Analytics Parameters

### Get Overall Stats
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `dateRange` | Options | Yes | Time period | `"last30days"` |
| `startDate` | DateTime | Conditional | Custom start date | `"2024-01-01T00:00:00.000Z"` |
| `endDate` | DateTime | Conditional | Custom end date | `"2024-01-31T23:59:59.000Z"` |

**Date Range Options:**
- `all` - All time data
- `last7days` - Last 7 days
- `last30days` - Last 30 days  
- `last90days` - Last 90 days
- `custom` - Custom date range (requires startDate/endDate)

**Additional Fields:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `accountIds` | String | No | Filter by account IDs | `"123,456"` |
| `campaignIds` | String | No | Filter by campaign IDs | `"789,790"` |
| `includeDailyBreakdown` | Boolean | No | Include daily stats | `true` |
| `metricsToInclude` | Multi-Select | No | Specific metrics only | See below |

**Metrics Options:**
- `profileViews` - Profile view count
- `postLikes` - Post like count
- `follows` - Follow count
- `messagesSent` - Messages sent
- `messageReplies` - Message replies received
- `inmailMessages` - InMail messages sent
- `inmailReplies` - InMail replies received
- `connectionsSent` - Connection requests sent
- `connectionsAccepted` - Connection requests accepted
- `replyRates` - Message and InMail reply rates

## Conversation Parameters

### Get Many Conversations
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `returnAll` | Boolean | No | Return all results | `false` |
| `limit` | Number | No | Max results (1-100) | `50` |

**Additional Fields:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `readStatus` | Options | No | Filter by read status | `"unread"` |
| `campaignId` | String | No | Filter by campaign | `"12345"` |
| `linkedInAccountId` | String | No | Filter by account | `"123"` |
| `includeMessages` | Boolean | No | Include message history | `true` |
| `messageTypeFilter` | Multi-Select | No | Filter by message types | `["TEXT", "IMAGE"]` |
| `groupChatFilter` | Options | No | Filter by chat type | `"individual"` |
| `dateRange` | Options | No | Time period filter | `"last7days"` |
| `startDate` | DateTime | Conditional | Custom start date | Required if dateRange is "custom" |
| `endDate` | DateTime | Conditional | Custom end date | Required if dateRange is "custom" |

**Read Status Options:**
- `all` - All conversations
- `read` - Read conversations only
- `unread` - Unread conversations only

**Message Type Options:**
- `TEXT` - Text messages
- `IMAGE` - Image messages
- `FILE` - File attachments

**Group Chat Filter Options:**
- `all` - All conversation types
- `individual` - Individual conversations only
- `group` - Group conversations only

**Date Range Options:** (Same as Analytics)

## Network Parameters

### Get For Sender
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `linkedInAccountId` | String | Yes | LinkedIn account ID | `"123456"` |
| `returnAll` | Boolean | No | Return all results | `false` |
| `limit` | Number | No | Max results (1-100) | `50` |

**Additional Fields:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `searchKeyword` | String | No | Search by name/company | `"software engineer"` |
| `companyFilter` | String | No | Filter by company | `"Microsoft"` |
| `locationFilter` | String | No | Filter by location | `"Seattle"` |
| `connectionLevel` | Options | No | Filter by connection level | `"1st"` |
| `includeProfileDetails` | Boolean | No | Include detailed profiles | `true` |
| `includeContactInfo` | Boolean | No | Include contact info | `false` |
| `minConnections` | Number | No | Minimum connection count | `500` |
| `maxConnections` | Number | No | Maximum connection count | `5000` |

**Connection Level Options:**
- `all` - All connection levels
- `1st` - Direct connections only
- `2nd` - Second-degree connections
- `3rd+` - Third-degree and beyond

## Common Validation Rules

### LinkedIn Profile URLs
- **Format:** `https://www.linkedin.com/in/profile-name`
- **Invalid:** URLs with query parameters, non-LinkedIn domains
- **Validation:** Must match regex pattern for LinkedIn profiles

### Custom Field Names
- **Format:** Alphanumeric characters and underscores only
- **Valid:** `lead_source`, `priority_level`, `company_size`
- **Invalid:** `lead-source`, `priority level`, `company.size`
- **Pattern:** `^[a-zA-Z0-9_]+$`

### Date Formats
- **Format:** ISO 8601 with timezone
- **Example:** `2024-01-15T10:30:00.000Z`
- **Rules:** Start date must be before end date, no future dates for historical data

### ID Formats
- **Campaign/List IDs:** Positive integers
- **Account IDs:** Positive integers
- **Comma-separated IDs:** `"123,456,789"` (no spaces around commas)

### Limits and Pagination
- **Maximum limit:** 100 items per request
- **Default limit:** 50 items
- **Rate limit:** 300 requests per minute
- **Pagination:** Use `returnAll: true` for all results (handles pagination automatically)

## Response Data Structures

### Campaign Response
```json
{
  "id": 12345,
  "name": "Campaign Name",
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

### Lead Response
```json
{
  "profileUrl": "https://www.linkedin.com/in/profile",
  "firstName": "John",
  "lastName": "Doe", 
  "headline": "Software Engineer",
  "location": "San Francisco, CA",
  "companyName": "Tech Corp",
  "position": "Senior Developer",
  "connections": 1250,
  "customUserFields": [
    {
      "name": "lead_source",
      "value": "linkedin_search"
    }
  ]
}
```

### Analytics Response
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
      "messageReplies": 7
    }
  }
}
```
