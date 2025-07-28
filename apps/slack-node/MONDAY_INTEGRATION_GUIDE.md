# Monday.com + Slack Integration Guide

## 🎯 Overview

This guide helps you implement the **credentials building block** for your Monday.com-Slack integration using OAuth 2.0.

## 📋 Prerequisites

1. **Slack App** created at https://api.slack.com/apps
2. **Monday.com developer account**
3. **Node.js 16+** and **npm**
4. **ngrok** or similar tunneling service

## 🔧 Setup Instructions

### 1. Configure Your Environment

Copy the environment template:

```bash
cp env.template .env
```

Fill in your `.env` file:

```bash
# From your Slack app settings
SLACK_CLIENT_ID=your_slack_client_id_here
SLACK_CLIENT_SECRET=your_slack_client_secret_here
SLACK_SIGNING_SECRET=your_slack_signing_secret_here

# Monday.com app details (get from Monday developers portal)
MONDAY_CLIENT_ID=your_monday_client_id_here
MONDAY_CLIENT_SECRET=your_monday_client_secret_here

# Development setup
PORT=8302
LOCAL_SERVER_URL=https://your-tunnel-url.ngrok.io
JWT_SECRET=your_random_secret_key

# Keep these as-is for development
NODE_ENV=development
DATABASE_URL=sqlite:./database.sqlite3
```

### 2. Update Slack App Configuration

In your Slack app settings (https://api.slack.com/apps):

**OAuth & Permissions → Scopes → Bot Token Scopes:**

```
chat:write
channels:read
channels:join
team:read
users:read
users:read.email
```

**OAuth & Permissions → Redirect URLs:**

```
https://apps-credentials.monday.com/authorize/oauth2/redirect-uri
https://apps-credentials.mondaystaging.com/authorize/oauth2/redirect-uri
http://localhost:8302/auth/callback/test-user
```

### 3. Install Dependencies & Run

```bash
npm install
npm start
```

## 🧪 Testing Your Implementation

### Test OAuth Flow Locally

1. **Start your server:**

   ```bash
   npm start
   ```

2. **Check health endpoint:**

   ```bash
   curl http://localhost:8302/auth/health
   ```

3. **Test OAuth initiation:**
   Visit: `http://localhost:8302/auth?userId=test-user&backToUrl=http://localhost:8302/auth/success`

4. **Complete OAuth flow** in browser
5. **Verify success** at redirect URL

### Test Token Validation

```bash
curl -X POST http://localhost:8302/auth/validate \
  -H "Content-Type: application/json" \
  -d '{"token":"xoxb-your-test-token"}'
```

## 🚀 Monday.com Integration Steps

### 1. Create App Feature Manifest

Use the provided `monday-credentials-manifest.json`:

1. **Update the clientId** in the manifest with your Slack Client ID
2. **Validate manifest** using Monday's tools:
   ```bash
   mapps validate monday-credentials-manifest.json
   ```

### 2. Deploy to Monday.com

```bash
# Import the credentials feature to your Monday app
mapps import monday-credentials-manifest.json

# Set your client secret
mapps secrets set CLIENT_SECRET your_slack_client_secret
```

### 3. Configure Credentials in Monday.com

1. **Go to Monday.com App Management**
2. **Select your app**
3. **Navigate to "Credentials"**
4. **Add the Slack credentials feature**
5. **Configure scopes:**
   ```
   chat:write,channels:read,channels:join,team:read,users:read,users:read.email
   ```

## 🔍 Key Integration Points

### OAuth Flow for Monday.com

```mermaid
sequenceDiagram
    participant U as User
    participant M as Monday.com
    participant Y as Your Service
    participant S as Slack

    U->>M: Configure Slack integration
    M->>Y: Request OAuth URL
    Y->>M: Return Slack OAuth URL
    M->>U: Redirect to Slack
    U->>S: Authorize app
    S->>M: Return with auth code
    M->>Y: Exchange code for token
    Y->>S: Validate token
    Y->>M: Return user info + token
    M->>U: Integration complete
```

### Required Endpoints

Your service must provide:

- **`GET /auth`** - Initiate OAuth flow
- **`GET /auth/callback/:userId`** - Handle OAuth callback
- **`POST /auth/validate`** - Validate tokens
- **`GET /auth/health`** - Health check

## 🛠️ Next Steps

### Phase 3: Implement Actions & Triggers

After credentials are working:

1. **Create Field Types** (Slack Channel, Slack User, etc.)
2. **Build Action Blocks** (Send Message, Create Channel, etc.)
3. **Add Trigger Blocks** (New Message, Channel Created, etc.)
4. **Test end-to-end** workflows in Monday.com

### Production Deployment

1. **Deploy your service** to a production environment
2. **Update redirect URLs** in Slack app settings
3. **Configure Monday.com app** with production URLs
4. **Test thoroughly** before publishing

## 🔒 Security Best Practices

- **Never expose** client secrets in frontend code
- **Validate all tokens** before using
- **Use HTTPS** for all OAuth endpoints
- **Store credentials securely** in Monday.com's system
- **Implement proper error handling** for failed OAuth flows

## 🐛 Troubleshooting

### Common Issues

**"Invalid redirect URI"**

- Check Slack app redirect URLs match exactly
- Ensure URLs use HTTPS in production

**"Token validation failed"**

- Verify token format (starts with `xoxb-` or `xoxp-`)
- Check token hasn't expired
- Confirm scopes match requirements

**"OAuth flow doesn't start"**

- Check environment variables are set
- Verify Monday.com can reach your endpoints
- Test health endpoint accessibility

### Debug Mode

Enable detailed logging:

```bash
DEBUG=slack-integration npm start
```

## 📞 Support

- **Monday.com Developer Docs**: https://developer.monday.com
- **Slack API Docs**: https://api.slack.com
- **OAuth 2.0 Spec**: https://tools.ietf.org/html/rfc6749

---

🎉 **Success!** You now have a working credentials building block for Monday.com + Slack integration!
