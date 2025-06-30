# HeyReach n8n Node - Troubleshooting Guide

This guide helps resolve common issues when using the HeyReach n8n integration.

## Table of Contents
- [Authentication Issues](#authentication-issues)
- [API Errors](#api-errors)
- [Validation Errors](#validation-errors)
- [Rate Limiting](#rate-limiting)
- [Campaign Issues](#campaign-issues)
- [Lead and List Issues](#lead-and-list-issues)
- [Analytics Issues](#analytics-issues)
- [Network Access Issues](#network-access-issues)
- [Performance Issues](#performance-issues)

## Authentication Issues

### Error: "Authentication failed"
**Symptoms:** 401 Unauthorized error when making API calls

**Causes & Solutions:**
1. **Invalid API Key**
   - Verify your HeyReach API key in Settings > API Keys
   - Ensure the key is copied completely without extra spaces
   - Check if the API key has expired

2. **Incorrect Credential Configuration**
   - Go to n8n Credentials and verify the HeyReach API credential
   - Ensure the API key field is properly filled
   - Test the credential using the "Test" button

3. **API Key Permissions**
   - Verify your HeyReach account has API access enabled
   - Check if your subscription plan includes API access
   - Contact HeyReach support if permissions are unclear

### Error: "No credentials got returned"
**Symptoms:** Node fails to execute with credential error

**Solution:**
- Ensure the HeyReach API credential is selected in the node
- Verify the credential name matches exactly
- Re-create the credential if the issue persists

## API Errors

### Error: "Resource not found" (404)
**Symptoms:** 404 error when accessing campaigns, lists, or leads

**Causes & Solutions:**
1. **Invalid Resource ID**
   - Verify the campaign/list ID exists in your HeyReach account
   - Check for typos in manually entered IDs
   - Use the dropdown selector when available

2. **Deleted Resources**
   - The campaign or list may have been deleted
   - Refresh your campaign/list data
   - Use "Get Many" operations to verify available resources

3. **API Endpoint Issues**
   - Some HeyReach endpoints may be temporarily unavailable
   - Check HeyReach API status or contact support
   - Try the operation again after a few minutes

### Error: "Bad request" (400)
**Symptoms:** 400 error with various validation messages

**Common Causes & Solutions:**
1. **Invalid Date Formats**
   - Use ISO 8601 format: `2024-01-15T10:30:00.000Z`
   - Ensure start date is before end date
   - Don't use future dates for historical data

2. **Invalid Campaign State**
   - Cannot add leads to DRAFT campaigns
   - Pause/resume only works on IN_PROGRESS/PAUSED campaigns
   - Check campaign status before operations

3. **Invalid LinkedIn Profile URLs**
   - Use format: `https://www.linkedin.com/in/username`
   - Remove query parameters and tracking codes
   - Ensure the profile URL is publicly accessible

### Error: "Access forbidden" (403)
**Symptoms:** 403 error when accessing certain resources

**Causes & Solutions:**
1. **Insufficient Permissions**
   - Your API key may not have access to specific features
   - Check your HeyReach subscription plan
   - Contact HeyReach support for permission issues

2. **LinkedIn Account Access**
   - The LinkedIn account may not be properly connected
   - Verify LinkedIn account authentication in HeyReach
   - Re-authenticate the LinkedIn account if needed

## Validation Errors

### Error: "Invalid LinkedIn profile URL format"
**Symptoms:** Validation error when adding leads

**Solution:**
- Use the correct format: `https://www.linkedin.com/in/profile-name`
- Remove any query parameters: `?utm_source=...`
- Ensure the URL is complete and properly formatted
- Test the URL in a browser to verify it's accessible

### Error: "Invalid custom field name"
**Symptoms:** Error when adding leads with custom fields

**Solution:**
- Custom field names must be alphanumeric with underscores only
- Valid: `lead_source`, `priority_level`, `company_size`
- Invalid: `lead-source`, `priority level`, `company.size`
- Use the validation pattern: `^[a-zA-Z0-9_]+$`

### Error: "Campaign ID must be a number"
**Symptoms:** Validation error when selecting campaigns

**Solution:**
- Use the dropdown selector instead of manual entry
- If entering manually, ensure it's a positive integer
- Remove any non-numeric characters

## Rate Limiting

### Error: "Rate limit exceeded" (429)
**Symptoms:** 429 error after multiple rapid requests

**Understanding HeyReach Rate Limits:**
- Maximum: 300 requests per minute
- Applies to all API endpoints
- Resets every minute

**Solutions:**
1. **Implement Delays**
   - Add wait nodes between HeyReach operations
   - Use 200-500ms delays for sequential operations
   - Batch operations when possible

2. **Optimize Workflows**
   - Use `returnAll: false` with appropriate limits
   - Filter data at the API level instead of client-side
   - Cache frequently accessed data

3. **Monitor Usage**
   - Track your API usage patterns
   - Spread operations across longer time periods
   - Consider upgrading your HeyReach plan if needed

## Campaign Issues

### Error: "Cannot add leads to DRAFT campaign"
**Symptoms:** Error when trying to add leads to a campaign

**Solution:**
- Only IN_PROGRESS and PAUSED campaigns can accept leads
- Change campaign status to IN_PROGRESS first
- Or select a different campaign that's already active

### Error: "Campaign must have LinkedIn accounts assigned"
**Symptoms:** Error when adding leads to campaign

**Solution:**
- Assign at least one LinkedIn account to the campaign
- Go to HeyReach dashboard → Campaign Settings → LinkedIn Accounts
- Verify the assigned accounts are properly authenticated

### Campaign Not Found in Dropdown
**Symptoms:** Expected campaign doesn't appear in the dropdown

**Causes & Solutions:**
1. **Campaign Status Filter**
   - Dropdown may filter by status (active campaigns only)
   - Check if the campaign is DRAFT or FINISHED
   - Use manual ID entry if needed

2. **Permission Issues**
   - You may not have access to all campaigns
   - Check your user role in HeyReach
   - Contact your HeyReach admin

## Lead and List Issues

### Error: "Lead not found"
**Symptoms:** 404 error when getting lead information

**Causes & Solutions:**
1. **Profile Not in HeyReach Database**
   - The LinkedIn profile hasn't been processed by HeyReach yet
   - Try adding the lead to a list first
   - Wait for HeyReach to process the profile

2. **Invalid Profile URL**
   - Verify the LinkedIn profile URL is correct
   - Check if the profile is public
   - Try accessing the profile directly in LinkedIn

### List Creation Fails
**Symptoms:** Error when creating new lists

**Solution:**
- Ensure list name is not empty
- Use unique list names
- Check if you have permission to create lists
- Verify your HeyReach plan supports list creation

## Analytics Issues

### Error: "Invalid date range"
**Symptoms:** 400 error when getting analytics

**Solutions:**
1. **Date Format Issues**
   - Use ISO 8601 format with timezone
   - Example: `2024-01-15T00:00:00.000Z`
   - Ensure start date is before end date

2. **Date Range Too Large**
   - Some analytics may have date range limits
   - Try shorter date ranges
   - Use pagination for large datasets

3. **Future Dates**
   - Don't use future dates for historical analytics
   - Ensure end date is not after current date

### No Analytics Data Returned
**Symptoms:** Empty or null analytics response

**Causes & Solutions:**
1. **No Activity in Date Range**
   - The specified date range may have no activity
   - Try a broader date range
   - Check if campaigns were active during the period

2. **Account/Campaign Filters**
   - The filtered accounts/campaigns may have no data
   - Remove filters to see all data
   - Verify the account/campaign IDs are correct

## Network Access Issues

### Error: "LinkedIn account not found"
**Symptoms:** Error when accessing network data

**Solutions:**
1. **Invalid Account ID**
   - Verify the LinkedIn account ID exists
   - Check if the account is properly connected
   - Use the correct numeric account ID

2. **Account Authentication Issues**
   - The LinkedIn account may need re-authentication
   - Check account status in HeyReach dashboard
   - Re-connect the LinkedIn account if needed

### Error: "Access denied to network data"
**Symptoms:** 403 error when getting network connections

**Causes & Solutions:**
1. **LinkedIn Permissions**
   - The LinkedIn account may not have network access permissions
   - Check LinkedIn account settings
   - Verify the account type supports network access

2. **HeyReach Plan Limitations**
   - Network access may require a higher plan
   - Check your HeyReach subscription features
   - Contact HeyReach support for plan details

## Performance Issues

### Slow Response Times
**Symptoms:** Operations take longer than expected

**Solutions:**
1. **Reduce Data Volume**
   - Use smaller limits instead of `returnAll: true`
   - Implement pagination for large datasets
   - Filter data at the API level

2. **Optimize Filters**
   - Use specific filters to reduce result sets
   - Avoid broad searches without filters
   - Cache frequently accessed data

3. **Network Issues**
   - Check your internet connection
   - Try the operation during off-peak hours
   - Consider HeyReach API server location

### Memory Issues with Large Datasets
**Symptoms:** n8n workflow fails with large result sets

**Solutions:**
1. **Use Pagination**
   - Set reasonable limits (50-100 items)
   - Process data in batches
   - Use streaming when possible

2. **Filter Early**
   - Apply filters at the API level
   - Don't retrieve unnecessary data
   - Use specific date ranges

## General Debugging Tips

### Enable Debug Mode
1. Set n8n log level to debug
2. Check n8n logs for detailed error messages
3. Look for HeyReach API response details

### Test with Minimal Data
1. Start with simple operations
2. Use small datasets for testing
3. Gradually increase complexity

### Verify API Status
1. Check HeyReach API documentation for updates
2. Test with HeyReach's API testing tools
3. Contact HeyReach support for API issues

### Common Error Patterns
- **401/403**: Authentication/permission issues
- **404**: Resource not found (wrong ID)
- **400**: Validation errors (check input format)
- **429**: Rate limiting (slow down requests)
- **500**: HeyReach server issues (try again later)

## Getting Help

### Before Contacting Support
1. Check this troubleshooting guide
2. Verify your HeyReach account status
3. Test with minimal data
4. Note exact error messages and steps to reproduce

### HeyReach Support
- Email: support@heyreach.io
- Documentation: https://documenter.getpostman.com/view/23808049/2sA2xb5F75
- Status Page: Check for known API issues

### n8n Community
- n8n Community Forum: https://community.n8n.io
- GitHub Issues: For node-specific bugs
- Discord: Real-time community help

### Reporting Bugs
When reporting issues, include:
1. n8n version and node version
2. Exact error message
3. Steps to reproduce
4. Sample data (anonymized)
5. Expected vs actual behavior
