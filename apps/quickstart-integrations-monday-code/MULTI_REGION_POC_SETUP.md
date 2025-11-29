# Multi-Region POC Integration Setup

Simple integration to test and verify multi-region routing works correctly.

## Purpose

This is a minimal POC (Proof of Concept) integration that:
- Verifies the endpoint is triggered in the correct regional deployment
- Returns region information to confirm routing
- Works end-to-end with minimal configuration

## Quick Setup in Developer Center

### Step 1: Create Integration Feature

1. Go to **Features** tab → **Create feature**
2. Select **Integration** feature type
3. Name: "Multi-Region Test"
4. Description: "Test multi-region routing"

### Step 2: Add Action Block

1. In feature details → **Workflow Blocks** → **Add block** → **Action**
2. Configure:
   - **Block Name:** "Test Region"
   - **Endpoint URL:** `/monday/execute_region_test`
   - **HTTP Method:** `POST`

### Step 3: Input Fields (Optional - None Required!)

For this POC, you can leave input fields empty OR add a simple text field:

**Optional Field (if you want to test with input):**
- **Field Key:** `testMessage`
- **Field Type:** "Text"
- **Source:** "Recipe Sentence"
- **Required:** No

### Step 4: Configure Secrets

Ensure `MONDAY_SIGNING_SECRET` is set for all regions:
- Go to **Server-side code** tab
- Add/Edit `MONDAY_SIGNING_SECRET` secret
- Set values for **US**, **EU**, and **AU** regions

### Step 5: Deploy to All Regions

```bash
# Deploy to US
mapps code:push -i <APP_VERSION_ID> -z us

# Deploy to EU
mapps code:push -i <APP_VERSION_ID> -z eu

# Deploy to AU
mapps code:push -i <APP_VERSION_ID> -z au
```

### Step 6: Test

1. Create a workflow in monday.com
2. Add the "Test Region" action
3. Run the workflow
4. Check the response - it should show:
   ```json
   {
     "success": true,
     "region": "US" (or "EU" or "AU"),
     "timestamp": "2025-01-XX...",
     "message": "✅ Successfully executed in US region"
   }
   ```

## Expected Response

The endpoint returns:
```json
{
  "success": true,
  "region": "US",
  "regionRaw": "us",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "serviceUrl": "your-service-url",
  "message": "✅ Successfully executed in US region",
  "accountId": "12345678",
  "userId": "87654321"
}
```

## Verification

- **US accounts** should see `"region": "US"`
- **EU accounts** should see `"region": "EU"`
- **AU accounts** should see `"region": "AU"`

This confirms the request is routed to the correct regional deployment!

## Endpoint Details

**Endpoint:** `POST /monday/execute_region_test`

**Authentication:** Required (uses `authorizeRequest` middleware)

**Request:** Minimal - no required input fields

**Response:** Region information and execution details

## Troubleshooting

- **401 Unauthorized:** Check `MONDAY_SIGNING_SECRET` is configured in all regions
- **500 Error:** Check deployment logs for the specific region
- **Wrong Region:** Verify multi-region is enabled and app is deployed to all regions

