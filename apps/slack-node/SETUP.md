# Setup Guide

Follow these steps to set up your Monday Slack Integration.

# App setup & local development

This is a Monday integration that posts item updates to Slack channels using a recipe sentence.

## Prerequisites

1. Make sure you have Node (v10+) and npm installed
2. Use the correct node version:

```
$ nvm use
```

3. Run node modules install:

```
$ npm install
```

## Create app in Slack

1. Navigate to [Slack apps](https://api.slack.com/apps/ 'slack apps') and login to your slack account
2. Create a new app and choose the relevant workspace

### Add your OAuth info

1. Click "OAuth & permissions"
2. Scroll to "Scopes" and add the following 3 scopes: `chat:write`, `channels:read`, and `channels:join`
3. Scroll to "Redirect URLs" and add the following - `https://apps-credentials.monday.com/authorize/oauth2/redirect-uri`
4. Press "Save URLs"

## Create app in monday

To set up the app in Monday, follow these steps:

1. Open monday.com & login to your account
2. Open the "Developers" section: Click your avatar menu > Developers
3. Create a new app - "Create app"

### Step 1: Create credentials app feature

1. Click on Build -> Features -> Create Feature > Integration > Credentials
2. Follow all the steps as described
3. Fill the basic details, in the parameters section you can leave it empty for now
4. In the next section make sure you copied the URL: `https://apps-credentials.monday.com/authorize/oauth2/redirect-uri` in Slack and if not - do it now
5. In the "Enter your application credentials" section:
   - Add your Client ID and Client Secret of Slack
   - Choose to include them in the Request header
6. In the "Configure OAuth endpoint" section:
   - Authorization URL: set a GET request - `https://slack.com/oauth/v2/authorize`
   - Scope: Paste the following scopes: `channels:join,channels:read,chat:write`
   - Access token request: `https://slack.com/api/oauth.v2.access`
   - Refresh token request: `https://slack.com/api/oauth.v2.access`
7. In the "Extra details" section:
   - Provide the route for our unique identifier request: `{your-tunnel-url}/credentials/provider-identifier`
   - (Hint: your tunnel URL will be shown when you run `npm run dev` in the format: `https://abcd1234.apps-tunnel.monday.com`)
   - Token expiration time (in seconds): `3600`
   - Retrieve params: Keep the fields empty for now

### Step 2: Create custom field for monday workflows

1. Go to Build -> Features -> Create Feature -> Integration > custom field for monday workflows
2. Create a custom field that will get our Slack channels and let users choose which channel to notify
3. Fill the basic details, call the name "GetChannels"
4. In field schema choose "String"
5. In configuration make sure your remote options URL is: `{your-tunnel-url}/monday/get_remote_list_options`
6. Fill a placeholder for empty list as you wish
7. In credentials section choose the credential field we created in step 1
8. Leave the dependencies empty for now

### Step 3: Create the workflow integration

1. Go to Build -> Features -> Create Feature -> Integration -> Integration for monday workflows
2. Fill the basic details and choose block type as "Action"
3. Choose the credential field we created in step 1
4. In input fields, add the following input fields:
   - Board with the key `boardId`
   - The custom field "GetChannels" with the key `channel`
   - Item with the key `itemId`
   - Column with the key `columnId`
5. Keep the output fields empty for now
6. In API Configuration, add your execution URL: `{your-tunnel-url}/monday/execute_action`
7. In the last section you can create a Lite builder for sentence or leave it empty

Well done - you created your first workflow integration app!

### Make your app live

1. Make your app live
2. Go to Distribute -> Share app to install the app on the account
3. Make sure to fill the .env file in the code (your `MONDAY_SIGNING_SECRET` and `LOCAL_SERVER_URL`) before running your app

Once the app is installed you can create a workflow and test your app!

## Test your app locally

1. Run the development server:

```
$ npm run dev
```

2. Open a board in your monday account
3. Create a new workflow and test your app

> Don't know how to add an update to an item? [Follow these steps](https://support.monday.com/hc/en-us/articles/115005900249-The-Updates-Section)

# Deploy to monday code

Once you have the app working in your development environment, you can deploy it to monday code.

## Initialize the monday CLI

```
$ npm run deploy:init
```

## Deploy to monday code

1. Run `npm run deploy`
2. Select the app to deploy your code to
3. Select the app version to deploy to

## Add environment variables

1. Open your app in the developer center
2. Navigate to "Host on monday" > General > Environment variables tab
3. Add the following environment variables:

```
LOCAL_SERVER_URL=your_monday_code_url
```

## Add secrets

1. Open your app in the developer center
2. Navigate to "Host on monday" > General > Secrets tab
3. Add the following secrets:

```
MONDAY_SIGNING_SECRET=your_monday_signing_secret
```

## Try it out!

1. Open an account and add a new workflow with a board
2. Choose a trigger "When column changes" and choose your board and a status column within it
3. Choose your slack integration as an action and fill all the related fields.
4. Change a status to an item in your board in the related column and watch your automation runs!
5. If you run into any issues, errors will be logged in the "Host on monday" > "Logs" section of the Developer Center
