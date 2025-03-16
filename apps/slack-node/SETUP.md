# overview
In order for this integration to work you will need to create an oAuth app using your slack account.
To do so, please follow these steps:

## new instructions

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


## old instructions

1. Copy the tunnel url the app printed after running the cli command. Example: https://monday-integration-1.loca.lt
2. Navigate to [slack apps](https://api.slack.com/apps/ 'slack apps') and login to your slack account.
3. Click the "Create New App" button, fill the name, select the workspace and click "Create App".
4. On the left pane under "Features" click "OAuth & Permissions".
5. Add your tunnel url as a "Redirect URL" with the /auth route: <br/>![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610370577/monday-apps-templates/slack-node/Screen_Shot_2021-01-11_at_15.09.25.png) 
6. Scroll down and add the following User Token Scopes: <br/>![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610369859/monday-apps-templates/slack-node/Screen_Shot_2021-01-11_at_14.57.09.png)
7. On the left pane under "Settings" click "Basic Information".
8. Copy the Client ID and Client Secret from the App Credentials: <br/>![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610369924/monday-apps-templates/slack-node/Screen_Shot_2021-01-11_at_14.58.31.png)
9.  Paste the ClientID & Secret into the .env file inside of your code directory: <br/>![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610370048/monday-apps-templates/slack-node/Screen_Shot_2021-01-11_at_15.00.36.png)
10. Save the .env file and your app should be good to go! You can add one of the recipes to your board and try it out :)
