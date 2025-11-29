# Sentence Builder Integration Setup Guide

This guide will walk you through setting up the Sentence Builder integration feature for your monday-code app with multi-region deployment support.

## Overview

The Sentence Builder integration allows users to combine text from multiple columns and static text into a single sentence, which is then written to a target column. This is useful for creating dynamic text content based on board data.

## Step-by-Step Setup in Developer Center

### Step 1: Enable Multi-Region Support

1. **Access the Developer Center:**
   - Log in to your monday.com account
   - Click on your profile picture in the top-right corner
   - Select "Developers" to open the Developer Center
   - Navigate to your app

2. **Enable Multi-Region Support:**
   - In the "General" tab, click on "Enable multi-region support"
   - This will display all three regions: **US**, **EU**, and **AU**
   - **Note:** Once enabled and promoted to live, you cannot disable this feature

### Step 2: Create the Integration Feature

1. **Navigate to Features:**
   - In your app's Developer Center, go to the "Features" section
   - Click "Create feature"
   - Select "Integration" as the feature type

2. **Configure Feature Details:**
   - **Feature Name:** "Sentence Builder"
   - **Feature Description:** "Build sentences by combining text from multiple columns and static text"
   - **Feature Icon:** Choose an appropriate icon (e.g., text/document icon)

3. **Configure Workflow Blocks:**
   - Click on "Workflow Blocks" in the feature details
   - Click "Add block" and select "Action"
   - Configure the action block:

#### Action Block Configuration:

**Block Name:** "Build Sentence"

**Input Fields:**
1. **boardId** (Board field)
   - Type: `board`
   - Required: Yes
   - Description: "Select the board containing the item"

2. **itemId** (Item field)
   - Type: `item`
   - Required: Yes
   - Description: "Select the item to build the sentence for"

3. **sourceColumnIds** (Column field - Multiple)
   - Type: `column`
   - Required: No (but at least one source is needed)
   - Multiple: Yes
   - Description: "Select one or more columns to read text from"

4. **targetColumnId** (Column field)
   - Type: `column`
   - Required: Yes
   - Description: "Select the column to write the built sentence to"

5. **separator** (Text field)
   - Type: `text`
   - Required: No
   - Default: " " (space)
   - Description: "Separator to use between text parts (default: space)"

6. **template** (Text field)
   - Type: `text`
   - Required: No
   - Description: "Optional template string using {part1}, {part2}, etc. or custom placeholders"

7. **staticTextParts** (Text field - Multiple)
   - Type: `text`
   - Required: No
   - Multiple: Yes
   - Description: "Optional static text parts to include in the sentence"

### Step 3: Configure Action Endpoint

1. **Set Action Endpoint:**
   - In the action block configuration, set the endpoint URL:
   - **Endpoint:** `/monday/execute_sentence_builder`
   - **Method:** `POST`
   - **Note:** The endpoint is relative to your app's base URL

2. **Authentication:**
   - The endpoint uses the `authorizeRequest` middleware
   - Ensure `MONDAY_SIGNING_SECRET` is configured as a secret in all regions (see Step 5)

### Step 4: Deploy to All Regions

1. **Connect to monday code in Each Region:**
   - In the "General" tab, click "Connect to monday code" for each region:
     - **US Region**
     - **EU Region**
     - **AU Region**

2. **Deploy Using CLI:**
   - Use the monday.com CLI to deploy to each region:
   
   ```bash
   # Deploy to US
   mapps code:push -i <APP_VERSION_ID> -z us
   
   # Deploy to EU
   mapps code:push -i <APP_VERSION_ID> -z eu
   
   # Deploy to AU
   mapps code:push -i <APP_VERSION_ID> -z au
   ```
   
   Replace `<APP_VERSION_ID>` with your app's version ID from the Developer Center.

3. **Verify Deployment:**
   - Check that your app is deployed in all three regions
   - The deployment status should show as "Connected" for all regions

### Step 5: Configure Environment Variables and Secrets

1. **Navigate to Server-side Code:**
   - In the Developer Center, go to the "Server-side code" tab

2. **Configure Secrets (Required for Integration):**
   - **MONDAY_SIGNING_SECRET:**
     - Click "Add new secret" or edit existing
     - Name: `MONDAY_SIGNING_SECRET`
     - **Important:** Set this secret for **all three regions** (US, EU, AU)
     - Value: Your app's signing secret (found in Developer Center > App Settings)
     - This is required for the `authorizeRequest` middleware to work

3. **Configure Environment Variables (if needed):**
   - Add any additional environment variables your app needs
   - **Remember:** Set values for all three regions if using multi-region

### Step 6: Test the Integration

1. **Test in Each Region:**
   - Create a test board in each region (US, EU, AU)
   - Add the Sentence Builder action to a workflow
   - Configure the action with:
     - Source columns containing text
     - A target column to write the result
     - Optional separator or template
   - Run the workflow and verify the sentence is built correctly

2. **Test Different Scenarios:**
   - Test with multiple source columns
   - Test with static text parts
   - Test with custom separator
   - Test with template syntax
   - Test with empty columns (should handle gracefully)

### Step 7: Promote to Live

1. **Final Checks:**
   - Ensure all regions are deployed
   - Verify all secrets are configured in all regions
   - Test the integration in all regions
   - Review error logs if any issues occur

2. **Promote Version:**
   - In the Developer Center, go to the "App versions" tab
   - Select your draft version
   - Click "Promote to live"
   - **Note:** After promoting, you cannot disable multi-region support

## Endpoint Details

### Endpoint: `/monday/execute_sentence_builder`

**Method:** `POST`

**Authentication:** Required (uses `authorizeRequest` middleware)

**Request Body:**
```json
{
  "payload": {
    "inputFields": {
      "boardId": "1234567890",
      "itemId": "1234567891",
      "sourceColumnIds": ["text_column_1", "text_column_2"],
      "targetColumnId": "text_column_result",
      "separator": " - ",
      "template": "Hello {part1}, welcome to {part2}!",
      "staticTextParts": ["Prefix", "Suffix"]
    }
  }
}
```

**Response:**
```json
{
  "itemId": "1234567891",
  "targetColumnId": "text_column_result",
  "builtSentence": "Prefix Hello World, welcome to Monday! Suffix",
  "partsUsed": 4
}
```

## How It Works

1. **Text Collection:**
   - Reads text from specified source columns
   - Includes any static text parts provided
   - Handles empty/null values gracefully

2. **Sentence Building:**
   - **Simple Mode:** Combines parts with a separator (default: space)
   - **Template Mode:** Uses template string with placeholders like `{part1}`, `{part2}`, etc.

3. **Column Update:**
   - Writes the built sentence to the target column
   - Uses the monday.com API to update the column value

## Multi-Region Considerations

- **Automatic Routing:** monday.com automatically routes requests to the correct regional deployment based on the user's account region
- **Consistent Behavior:** The integration behaves the same across all regions
- **Regional Secrets:** Each region has its own secrets/environment variables
- **Deployment:** You must deploy to all three regions for the integration to work globally

## Troubleshooting

### Integration Not Working

1. **Check Secrets:**
   - Verify `MONDAY_SIGNING_SECRET` is set in all regions
   - Check that the secret value is correct

2. **Check Deployment:**
   - Verify app is deployed in all regions
   - Check deployment logs for errors

3. **Check Endpoint:**
   - Verify the endpoint `/monday/execute_sentence_builder` exists in your code
   - Check server logs for errors

4. **Check Input Fields:**
   - Ensure required fields (boardId, itemId, targetColumnId) are provided
   - Verify column IDs are correct

### Common Issues

- **Empty Sentence:** Check that source columns contain text or static text parts are provided
- **Column Update Fails:** Verify the target column exists and is writable
- **Authentication Errors:** Check that `MONDAY_SIGNING_SECRET` is configured correctly

## Additional Resources

- [monday.com Apps Documentation](https://developer.monday.com/apps/docs)
- [Custom Actions Documentation](https://developer.monday.com/apps/docs/custom-actions)
- [Multi-Region Feature Documentation](https://developer.monday.com/apps/docs/multi-region-feature)
- [Quickstart Integration Guide](https://developer.monday.com/apps/docs/quickstart-integration)

