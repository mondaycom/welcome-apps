## Overview

This is the Jira JQL custom monday app integration recipe: 
- When an issue with this <b>JQL</b> is updated, create an <b>item</b> and keep in sync

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

### Create a with custom trigger, dynamic mapping custom field, and custom action

1. Open the "Custom Blocks" tab
2. Click the "Create new" button and select "Trigger." Configure your custom trigger to have the following configuration:

3. Click the "Create new" button again and select "Action." Configure your custom action to have the following configuration:

4. Lastly, click the "Create new" button one last time and select "Field Type." In the "Type" dropdown, select "Dynamic Mapping" and give it the following configuration:

### Create a recipe with your custom blocks

1. Switch to the "Recipes" tab now, and click "Create Recipe" to use your custom blocks
2. In the trigger configuration, select the custom trigger block you just created. Your trigger sentence should read: "When an issue with this {JQL, jql} is created or updated,"
3. The input field for the "jql" field should be "Recipe Sentence," and the input field for the "boardId" field should be "Context."
4. Next, set up your action configuration by clicking into the action and selecting the custom action block you created. Your action sentence should read: "create an {item, itemMapping} and keep in sync."
5. The input field for the "boardId" field should be "Context," the input field for "itemMapping" should be "Recipe Sentence," the "Source Entity" should be "issueFields," the dynamic mapping custom field we created, and the dependency field should be "Trigger-boardId":

6. Lastly, the "issueId" field for your custom block will have "Trigger Output" as its input field, with the trigger output field key being "issueId."
7. You're done! Click "Save Recipe" to save your new custom recipe. 

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

1. Make sure you have Node (v10+) and npm installed from the [Node.js website](https://nodejs.org/en/download/).
2. Use the correct node version:
```
$ nvm use
```
<br>

3. Run node modules install:
```
$ npm install
```

4. Run the server with the command:
```
$ npm run start
```

5. Paste the outputted URL (it should be https://jql-app-803.loca.lt) in the "Feature Details" tab of your "Jira JQL App" in monday.com, under "Base URL."
6. You're now ready to go and start using this app! Add the recipe to a board to start testing. 

## Adapting this Example App

As an example app, this code is meant to serve as an inspiration and jumping off point for monday apps developers. It demonstrates how to utilize dynamic mapping in your custom integration recipes, as well as how to create an integration column that will automatically populate with the IDs of your imported Jira issues. 

To modify this code, start by checking out the monday-controller.js file, the integration-controller.js file, as well as the jira-service.js file and the monday-service.js file. These files hold the bulk of what you would potentially be modifying: the logic of the trigger of how a Jira webhook is created, and the logic of the action of how an item is searched for and created or updated. 