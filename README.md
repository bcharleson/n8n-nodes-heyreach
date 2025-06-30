# n8n-nodes-heyreach

![HeyReach Logo](https://heyreach.io/favicon.ico)

A comprehensive n8n community node for HeyReach - the LinkedIn automation platform that helps you scale your outreach campaigns with advanced targeting and personalization.

[![npm version](https://badge.fury.io/js/n8n-nodes-heyreach.svg)](https://badge.fury.io/js/n8n-nodes-heyreach)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/bcharleson/n8n-nodes-heyreach)](https://github.com/bcharleson/n8n-nodes-heyreach/issues)

## 🚀 What is this?

This node allows you to create, retrieve, and manage your HeyReach LinkedIn automation resources directly from n8n workflows. It provides robust error handling, comprehensive API coverage, and seamless integration with HeyReach's powerful LinkedIn automation platform.

**Perfect for:**
- Automating LinkedIn outreach campaigns
- Managing leads and prospect lists
- Analyzing campaign performance
- Integrating LinkedIn automation with your existing workflows
- Building sophisticated lead nurturing sequences

## ✨ Features

- **Complete API Coverage**: Access all major HeyReach resources (Campaigns, Leads, Lists, Analytics, Conversations, Network)
- **Smart Error Handling**: Intelligent handling of HeyReach API quirks and edge cases
- **Production Ready**: Thoroughly tested with comprehensive error handling
- **Easy Setup**: Simple authentication with API key
- **Rich Documentation**: Extensive examples and troubleshooting guides

## 📦 Installation

### Community Nodes (Recommended)

For users on n8n v0.187.0+, you can install this node directly through the n8n interface:

1. Go to **Settings > Community Nodes** in your n8n instance
2. Click **Install**
3. Enter `n8n-nodes-heyreach` and click **Download**
4. Restart your n8n instance
5. The HeyReach node will appear in your node palette

### Manual Installation

For self-hosted n8n instances:

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the node
npm install n8n-nodes-heyreach

# Restart n8n
```

### Docker Installation

For Docker-based n8n installations:

```bash
# Add to your Dockerfile or docker-compose.yml
RUN npm install -g n8n-nodes-heyreach

# Or install at runtime
docker exec -it n8n npm install n8n-nodes-heyreach
```

### Requirements

- n8n version 0.187.0 or higher
- Node.js 18.10.0 or higher
- Valid HeyReach account with API access

## 🔧 Setup & Authentication

### Getting Your HeyReach API Key

1. **Log into HeyReach**: Visit [app.heyreach.io](https://app.heyreach.io) and sign in
2. **Navigate to API Settings**: Go to **Settings** → **API Keys**
3. **Generate API Key**: Click "Generate New API Key" or copy your existing key
4. **Copy the Key**: Save this key securely - you'll need it for n8n

### Creating n8n Credentials

1. **Add Credential**: In n8n, go to **Credentials** → **Add Credential**
2. **Select Type**: Search for and select "HeyReach API"
3. **Enter API Key**: Paste your HeyReach API key
4. **Test Connection**: Click "Test" to verify the connection works
5. **Save**: Give your credential a name and save it

### Quick Start

Once authenticated, you can:
- **Manage Campaigns**: Pause, resume, and monitor your LinkedIn outreach campaigns
- **Handle Leads**: Add leads to campaigns, manage tags, and track interactions
- **Organize Lists**: Create and manage prospect lists for targeted outreach
- **Analyze Performance**: Get detailed analytics on campaign and lead performance
- **Monitor Conversations**: Track LinkedIn conversations and responses
- **Manage Network**: Access and analyze your LinkedIn network connections

## 🎯 Available Operations

This node provides comprehensive access to HeyReach's LinkedIn automation platform:

### 📊 Campaign Management
Perfect for managing your LinkedIn outreach campaigns:

- **Get Campaign**: Retrieve detailed information about a specific campaign
- **Get Many Campaigns**: List all campaigns with advanced filtering options
- **Pause Campaign**: Safely pause active campaigns (with intelligent error handling)
- **Resume Campaign**: Resume paused campaigns to continue outreach
- **Add Leads to Campaign**: Seamlessly add leads to your outreach campaigns

### 👥 Lead Operations
Comprehensive lead management capabilities:

- **Get Lead**: Retrieve lead details by LinkedIn profile URL
- **Add Tags**: Add organizational tags to leads for better categorization
- **Get Tags**: Retrieve all tags associated with a lead

### 📋 List Management
Organize and manage your prospect lists:

- **Get Many Lists**: Retrieve all your prospect lists with metadata
- **Create List**: Create new targeted prospect lists
- **Add Leads to List**: Add leads to existing lists for organization

### 📈 Analytics & Insights
Data-driven insights for campaign optimization:

- **Get Overall Stats**: Comprehensive campaign performance metrics including:
  - Response rates and engagement metrics
  - Date range filtering for trend analysis
  - Account-specific analytics
  - Daily performance breakdowns

### 💬 Conversation Management
Monitor and manage LinkedIn conversations:

- **Get Many Conversations**: Access LinkedIn conversations with advanced filtering:
  - Filter by read/unread status
  - Filter by specific campaigns
  - Filter by LinkedIn account
  - Filter by message types and date ranges

### 🌐 Network Operations
Manage and analyze your LinkedIn network:

- **Get Network for Sender**: Access LinkedIn network data with:
  - Advanced search capabilities
  - Company and location filtering
  - Connection level filtering (1st, 2nd, 3rd degree)
  - Profile completeness scoring

## 💡 Usage Examples

### Example 1: Campaign Performance Monitoring
Monitor your campaign performance and automatically pause underperforming campaigns:

```json
{
  "nodes": [
    {
      "name": "Get Campaign Analytics",
      "type": "n8n-nodes-heyreach.heyReachApi",
      "parameters": {
        "resource": "analytics",
        "operation": "getOverallStats",
        "campaignId": "12345",
        "dateFrom": "2024-01-01",
        "dateTo": "2024-01-31"
      }
    },
    {
      "name": "Check Performance",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "number": [
            {
              "value1": "={{ $json.responseRate }}",
              "operation": "smaller",
              "value2": 5
            }
          ]
        }
      }
    },
    {
      "name": "Pause Low-Performing Campaign",
      "type": "n8n-nodes-heyreach.heyReachApi",
      "parameters": {
        "resource": "campaign",
        "operation": "pause",
        "campaignId": "12345"
      }
    }
  ]
}
```

### Example 2: Automated Lead Management
Automatically add new leads from a CRM to HeyReach campaigns:

```json
{
  "nodes": [
    {
      "name": "Get New Leads from CRM",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://your-crm.com/api/leads",
        "method": "GET"
      }
    },
    {
      "name": "Add Leads to HeyReach Campaign",
      "type": "n8n-nodes-heyreach.heyReachApi",
      "parameters": {
        "resource": "campaign",
        "operation": "addLeads",
        "campaignId": "67890",
        "leads": "={{ $json.leads }}"
      }
    }
  ]
}
```

### Example 3: Conversation Management
Monitor and respond to LinkedIn conversations:

```json
{
  "nodes": [
    {
      "name": "Get Unread Conversations",
      "type": "n8n-nodes-heyreach.heyReachApi",
      "parameters": {
        "resource": "conversation",
        "operation": "getMany",
        "filters": {
          "isRead": false
        }
      }
    },
    {
      "name": "Process Each Conversation",
      "type": "n8n-nodes-base.splitInBatches",
      "parameters": {
        "batchSize": 10
      }
    }
  ]
}
```

## API Documentation

For detailed API documentation, visit: https://documenter.getpostman.com/view/23808049/2sA2xb5F75

## Rate Limits

HeyReach API allows a maximum of 300 requests per minute. The node includes automatic rate limit handling.

## 🔧 Troubleshooting

### Common Issues

#### Campaign Pause/Resume Errors
**Issue**: Getting "You cannot pause an inactive campaign" error
**Solution**: This node includes smart error handling that automatically verifies if the campaign was actually paused despite the API error. The operation will succeed if the campaign status changes correctly.

#### API Rate Limits
**Issue**: Receiving rate limit errors
**Solution**: The node includes automatic rate limiting (300 requests/minute). If you hit limits, the node will automatically retry with exponential backoff.

#### Authentication Errors
**Issue**: "Invalid API key" or authentication failures
**Solution**:
1. Verify your API key in HeyReach Settings > API Keys
2. Ensure the credential is properly saved in n8n
3. Test the connection using the "Test" button in credentials

#### Node Not Appearing
**Issue**: HeyReach node doesn't appear in n8n node palette
**Solution**:
1. Restart your n8n instance after installation
2. Clear browser cache (Cmd+Shift+R)
3. Check n8n logs for installation errors

### Debug Mode
Enable debug logging by setting the environment variable:
```bash
export N8N_LOG_LEVEL=debug
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18.10.0 or higher
- npm or yarn
- n8n development environment

### Local Development
1. **Clone the repository**:
   ```bash
   git clone https://github.com/bcharleson/n8n-nodes-heyreach.git
   cd n8n-nodes-heyreach
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the node**:
   ```bash
   npm run build
   ```

4. **Link for local testing**:
   ```bash
   # Link the package globally
   npm link

   # In your n8n installation directory
   npm link n8n-nodes-heyreach
   ```

5. **Start n8n in development mode**:
   ```bash
   n8n start --tunnel
   ```

### Docker Development
For Docker-based development with hot-reloading:

```bash
# Build the node
npm run build

# Run n8n with volume mounting
docker run -d \
  --name n8n-heyreach-dev \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -v $(pwd):/home/node/.n8n/nodes/node_modules/n8n-nodes-heyreach \
  n8nio/n8n:latest
```

### Testing
Run the test suite:
```bash
npm test
```

### Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Build and test: `npm run build && npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Usage Examples](docs/usage-examples.md)** - Complete examples for all 15 operations
- **[Test Workflows](docs/test-workflows.md)** - 5 comprehensive test scenarios
- **[Troubleshooting Guide](docs/troubleshooting.md)** - Solutions for common issues
- **[Parameter Reference](docs/parameter-reference.md)** - Complete parameter documentation
- **[Production Readiness](docs/production-readiness-checklist.md)** - Validation and deployment guide

## Support

For issues and feature requests, please visit: https://github.com/bcharleson/n8n-nodes-heyreach

## Development Status

This package is production-ready:

- ✅ **Phase 1 Complete**: Foundation, authentication, and structure
- ✅ **Phase 2 Complete**: Core resources (Campaign, Lead, List) with 9 operations
- ✅ **Phase 3 Complete**: Analytics and advanced features (Conversation, Network, Analytics) with 6 additional operations
- ✅ **Phase 4 Complete**: Testing, documentation, and production readiness validation

**🚀 Ready for production use with comprehensive LinkedIn automation capabilities.**

## License

MIT

## 📋 Contributing

We welcome contributions to improve the HeyReach n8n node! Here's how you can help:

### 🐛 Bug Reports
If you encounter any issues:
1. Check [existing issues](https://github.com/bcharleson/n8n-nodes-heyreach/issues) first
2. Create a detailed bug report with:
   - Steps to reproduce
   - Expected vs actual behavior
   - n8n version and node version
   - Error messages or logs

### 💡 Feature Requests
Have an idea for improvement?
1. Check if it's already been requested
2. Open a feature request with:
   - Clear description of the feature
   - Use case and benefits
   - Any relevant HeyReach API documentation

### 🔧 Pull Requests
Ready to contribute code?
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Build and test: `npm run build && npm test`
5. Commit with clear messages: `git commit -m 'Add amazing feature'`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request with detailed description

### 📞 Support
- **GitHub Issues**: For bugs and feature requests
- **Documentation**: Check the `/docs` folder for detailed guides
- **Community**: Share your workflows and get help from other users

## 📊 Version History

### 0.1.0-beta - Initial Beta Release
- **🎯 Complete HeyReach API integration** with 15 operations across 6 resources
- **🔐 Secure authentication** with X-API-KEY and comprehensive credential validation
- **📊 Campaign management** (get, getMany, pause, resume, addLeads) with intelligent status validation
- **👥 Lead management** (getLead, addTags, getTags) with LinkedIn profile validation
- **📋 List management** (getMany, create, addLeadsToList) with flexible input modes
- **📈 Analytics** with date range filtering, metrics selection, and daily breakdowns
- **💬 Conversation management** with comprehensive filtering and computed fields
- **🌐 Network access** with search, filtering, and profile completeness scoring
- **🛡️ Robust error handling** for all HeyReach API limitations and edge cases
- **📚 Complete documentation** with usage examples, troubleshooting, and parameter reference
- **🚀 Production-ready** with full TypeScript support and n8n best practices
- **✅ Comprehensive testing** and validation for all operations
