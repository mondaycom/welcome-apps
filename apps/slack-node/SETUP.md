# Overview
Follow these steps to create your Slack integration.

# App setup & local development

In order for this integration to work you will need to create an oAuth app using your slack account.
To do so, please follow these steps:

## Create app in monday
To set up the app in Monday, follow these steps:

1. Open monday.com & login to your account. 
2. Open the "Developers" section: Click your avatar menu > Developers
3. Create a new app - "Create app"

### Add an integration feature
1. Open "Features" section and create new "Integration for Sentence Builder" feature.
2. Choose the "Slack Integration - NodeJS" template to start. **Don't run the suggested command yet.**
3. Run this project with `npm run start` and paste the resulting URL (from the command line) into the URL box and press create.

### Add monday OAuth info to .env file

1. Open the `Basic Information` tab
2. Copy-paste your app's signing secret and server URL into the `.env` file. 

## Create app in Slack

1. Navigate to [Slack apps](https://api.slack.com/apps/ 'slack apps') and login to your slack account.
2. Create a new app and choose the relevant workspace. 
3. Copy-paste your app's Client ID and Client Secret into the `.env` file. 

### Add your OAuth info

1. Click "OAuth & permissions" 
2. Scroll to "Scopes" and add the `chat:write` and `channels:read` scope. 
3. Scroll to "Redirect URLs" and add the following - `https://<your_url>/auth`
4. Press "Save URLs"

## Test your app on a board

1. Open a board in your monday account
2. Click "Integrate" at the top of your board
3. Select your integration feature – "Slack Integration - NodeJS" by default
4. Select a Slack channel to send updates to, and add the integration
5. Click an item 
6. Write something in the Updates text box and hit "Update" – the item should be sent to the selected slack channel too

> Don't know how to add an update to an item? [Follow these steps](https://support.monday.com/hc/en-us/articles/115005900249-The-Updates-Section)

# Deploy to monday code

Once you have the app working in your development environment, you can deploy it to monday code. 

## Initialize the monday CLI

`npm run deploy:init`

## Deploy to monday code

1. Run `npm run deploy`
2. Select the app to deploy your code to
3. Select the app version to deploy to

## Add your monday code URL to Slack app config

1. Open your Slack app at api.slack.com
2. Go to "OAuth and permissions"
3. Add the following Redirect URL - `https://<your_monday_code_deployment_url>/auth`

## Add environment variables

1. Open your app in the developer center
2. Navigate to "Host on monday" > General > Environment variables tab
3. Add the following environment variables: 
```
TOKEN_HOST=https://slack.com
TOKEN_PATH=/api/oauth.v2.access
AUTHORIZE_PATH=/oauth/v2/authorize
LOCAL_SERVER_URL=your_monday_code_url
```
## Add secrets

1. Open your app in the developer center
2. Navigate to "Host on monday" > General > Secrets tab
3. Add the following secrets:
```
MONDAY_SIGNING_SECRET=your_monday_signing_secret
CLIENT_ID=your_slack_client_id
CLIENT_SECRET=your_slack_client_secret
```

## Try it out!

1. Open a board and add your integration (same steps as when developing locally)
2. If you run into any issues, errors will be logged in the "Host on monday" > "Logs" section of the Developer Center. 
