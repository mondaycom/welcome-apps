## Overview

This is the Jira JQL custom monday app integration recipe: 
- When an issue with this <b>JQL</b> is updated, create an <b>item</b> and keep in sync.
![recipe](https://dapulse-res.cloudinary.com/image/upload/v1624649879/remote_mondaycom_static/uploads/HelenLu/Jira%20Node%20Images/recipe.png)

> **Warning:** This example does not support monday code yet. For examples that use monday code, try our Github or Slack integrations instead. 

This integration recipe allows you to specify a JQL query. When an issue is updated or created within the scopes of the JQL query, an item will be created on your monday.com board and will be kept in sync. All future updates made in Jira will be pushed over to the relevant item on your board.

<br>This app demonstrates how to use:
- integration recipe
- custom trigger
- custom action
- item mapping

## Why it Works

This integration recipes uses the Jira API with basic authentication to create and delete [Jira webhooks](https://developer.atlassian.com/server/jira/platform/webhooks/). 

## Configuring your monday.com Custom App

### Create a new app and integration feature

1. Open monday.com and log into your account
2. Create a new "Jira JQL App" 
3. Open the "Features" section and create a new "Integration" feature

### Create your recipe's blocks: a custom trigger, dynamic mapping custom field, and custom action

1. Open the "Field Types" tab
2. Click the "Create new" button and configure your field to have the following config: 
![dynamicmapping](/apps/jira-node/public/jira-node-dynamic-mapping.png)

3. Open the "Workflow Blocks" tab
4. Click the "Create new" button and select "Trigger." Configure your custom trigger to have the following configuration:
![trigger1](/apps/jira-node/public/jira-node-custom-trigger-1.png)
![trigger2](/apps/jira-node/public/jira-node-custom-trigger-2.png)
5. Click the "Create new" button again and select "Action." Configure your custom action to have the following configuration:
![action](/apps/jira-node/public/jira-node-custom-action-1.png)
![action2](/apps/jira-node/public/jira-node-custom-action-2.png)

### Create a recipe with your custom blocks

1. Switch to the "Recipes" tab now, and click "Create Recipe" to use your custom blocks
2. In the trigger configuration, select the custom trigger block you just created. 
3. Next, set up your action configuration by clicking into the action and selecting the custom action block you created. 
4. For 'itemMapping', the "Source Entity" should be "issueFields," the dynamic mapping custom field we created, and the dependency field should be "Trigger-boardId". 
5. For 'issueId', set the Trigger output field key to 'issueId'. 
6. You're done! Click "Save Recipe" to save your new custom recipe. 

## Setting up Authorization and Credentials

In order for this integration recipe to work you will need to generate a new API token for your Jira account. 

1. Click into your Jira profile to see your profile menu. 
2. Click on "Account Settings."
3. In the left-hand menu, click on "Security"
4. Under the "API token" section, click the "Create and manage API tokens" text.
5. Click "Create API token" to create a new API token. Input an API token label of your choosing. 
6. Copy the API token after the "API_KEY=" text in the .env file, along with your Jira account URL (i.e. https://example.atlassian.net) and your username (i.e. example@example.com). 
7. Copy your new app's Signing Secret in monday.com after the "MONDAY_SIGNING_SECRET=" text in the .env file.
8. You're good to go! Start using your new JQL integration recipe. 

## Installing and Starting the Server

1. The monday CLI requires node 18+, make sure you have it installed from the [Node.js website](https://nodejs.org/en/download/).
2. Use the correct node version:
```
$ nvm use
```

3. Run node modules install:
```
$ npm install
```

4. Run the server with the command:
```
$ npm run start
```

5. Paste the outputted URL in the "Feature Details" tab of your "Jira JQL App" in monday.com, under "Base URL" and in the .env file under "LOCAL_SERVER_URL".
6. You're now ready to go and start using this app! Add the recipe to a board to start testing. 

## Adapting this Example App

As an example app, this code is meant to serve as an inspiration and jumping off point for monday apps developers. It demonstrates how to utilize dynamic mapping in your custom integration recipes, as well as how to create an integration column that will automatically populate with the IDs of your imported Jira issues. 

To modify this code, start by checking out the monday-controller.js file, the integration-controller.js file, as well as the jira-service.js file and the monday-service.js file. These files hold the bulk of what you would potentially be modifying: the logic of the trigger of how a Jira webhook is created, and the logic of the action of how an item is searched for and created or updated. 

## Things to Keep in Mind

The usage of the SQLite database in this example app is just for demo purposes. Apps built for production need to store tokens securely in encrypted databases, such as Vault. 
