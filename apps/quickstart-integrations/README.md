# Build your first integration on monday.com

A minimal example to build and deploy your first integration app feature. [Learn more in our docs.](https://developer.monday.com/apps/docs/quickstart-deploy-your-first-app)

The integration will watch a text column on a board, and automatically capitalize (or lowercase) the text in it. 

> **Note:** This example can be used as a backend for either the *Integration for Sentence Builder* or *Integration for monday workflows* app features. We recommend starting with the Sentence Builder. 

# Before you begin

Complete the following pre-requisites before trying this tutorial: 
- Install NodeJS 18+ on your machine
- Have a monday.com account (you can sign up for a [developer account here](https://auth.monday.com/users/sign_up_new?developer=true&utm_source=welcome_apps#soft_signup_from_step))
- Find your API token in the monday developer center ([instructions](https://developer.monday.com/api-reference/docs/authentication#accessing-your-token))

# Setting up the example app

You need to complete the following steps for this example app to work: 
1. Create and configure a new monday app in the monday.com Developer Center:
    - Create an app
    - Add an app feature to your app: "Integration for Sentence Builder"
2. Download the example code
3. Upload and deploy the example code to monday servers
4. Test your new app on a board!

> Prefer a video demo? [Watch here.](https://www.loom.com/share/b982f6b88fc0491f9e70fa424eb91638)

## Part 1: Create the app in monday
1. Create a new app [in the Developer Center.](https://developer.monday.com/apps/docs/create-an-app#creating-an-app-in-the-developer-center) Name it something descriptive and press save. 
2. Navigate to "Build" > "Features" and [create a new app feature.](https://developer.monday.com/apps/docs/create-an-app#adding-an-app-feature-in-the-developer-center)
   - In the dialog that appears, select **Integrations for sentence builder**. Click Next.
   - Choose the **Quickstart Integration - NodeJS** template. Click next. 
   - Check the box to automatically add any missing OAuth scopes.
   - Ignore the step to scaffold an app. Instead, add a dummy URL: https://myserver.com. We will replace this URL when we deploy our app. 
   - Click Create.

## Part 2: Download the example code

We now need to download the files from Github. You have two options: 
- Clone the entire repo, then change your working directory to "apps/quickstart-integrations", or
- Use `degit` to clone the subdirectory with one command: `npx degit github:mondaycom/welcome-apps/apps/quickstart-integrations`

## Part 3: Deploy the example code to monday code

In this step, we will deploy the project files to monday code and link the deployment to the app we created in part 1.

1. Run `npm install` to install the app's dependencies
2. Run `npm run deploy` to deploy the app to monday servers
3. Follow the prompts in the CLI to add [your API token](https://developer.monday.com/api-reference/docs/authentication#accessing-your-token), and choose the app and version to deploy to
4. Wait a few minutes for the deployment process to complete
5. Open the "Integration for sentence builder" feature you created in part 1
6. Under "Feature Deployment", select "Server-side code (monday code)". Leave the sub-route field blank.

Your app is now hosted on monday servers!

## Part 4: Add your app's "Signing Secret" to environment variables

The example app uses your app's OAuth signing secret for authentication. Add it to your app's environment variables via the CLI:

1. Open your app in the monday Developer Center. Navigate to the "General Settings" section.
2. Copy your app’s Signing Secret from the [“General settings" section](https://developer.monday.com/apps/docs/the-developer-center#general-settings) of your app in the Developer Center
2. Add the signing secret as an environment variable:
```
mapps code:env -m set -k MONDAY_SIGNING_SECRET -v <your_signing_secret> -i <your app id>
```

## Part 5: Try the app on a board

Now that your app is created and deployed, you can try it out on a board!

1. Open a board
2. Add two text columns to the board if they don't exist already. 
3. Click "Integrations" on the top and search for your app feature's name - "Quickstart Integration - NodeJS" by default
4. Choose the sentence "When text column changes, transform it into text column"
5. Configure the sentence by selecting input and output columns, and a transformation type. Press 'Add to board'
6. Now it's time to test it! Write some text in the input column. It will be transformed and added to the output column. 

> How it works: When the trigger event occurs (the specific text column changing), monday sends a POST request to your app's `monday/execute_action` endpoint. The function is defined in `src/index.js`. 

## Setting up for local development (optional)

Follow these steps to set up your local dev environment. 

1. Add your app's signing secret to the `.env` file
2. Run `npm run dev` to start the app server on port 8080. Copy the resulting tunnel URL
3. Open your app > "Build" > "Features" > Select the integration feature
4. Under "Feature deployment", select "External hosting". 
5. Paste your tunnel URL as the URL to be rendered
6. Press save. Your monday app is now connected to your local environment. Every time your integration runs, monday will send a request to the local server. 

# Using this app with monday workflows: Configuring the app feature

This example can be used as a backend for an integration with monday workflows. 

You'll need to create two features: an integration feature and a custom field.

You will need your monday code version URL for these steps. You can get it from the developer center, under **Host on monday > Server-side code**

***Note:** Complete Parts 3 and 4 above before proceeding.*

### Create the integration feature

In this step, we'll create an "Integration for monday workflows" app feature that handles the core business logic: reading a column value and transforming its text case.

1. Navigate to "Build" > "Features" and [create a new app feature.](https://developer.monday.com/apps/docs/create-an-app#adding-an-app-feature-in-the-developer-center)
2. In the dialog that appears, select **"Integration for monday workflows"**. Click Next.
4. Block name: "Change text case"
5. Block type: "Action"
6. Add the fields from the table below
7. Scroll down and add the following execution URL: `[YOUR VERSION URL]/monday/execute_action`
6. Click Create.

#### Field IDs and types

Add the following fields to your block. Make sure the field key is copied exactly otherwise the integration will not work. 

| Field type     | Field key/title   |
| -------------- | ----------------- |
| Board          | boardId           |
| Item           | itemId            |
| Text column    | sourceColumnId    |
| Text column    | targetColumnId    |

### Create the custom field

Now we'll create a custom dropdown field to represent the transformation type. 

1. Navigate to "Build" > "Features" and [create a new app feature.](https://developer.monday.com/apps/docs/create-an-app#adding-an-app-feature-in-the-developer-center) Select "Custom field for monday workflows"
2. Add the field name: **Transformation type**
3. Add the default field key: **transformationType**
4. For schema type, select **String**
5. Under Configuration, click Add remote options. 
    - Remote options URL: `[YOUR SERVER URL]/monday/get_remote_list_options`
7. Leave the credentials and field dependencies blank

### Add the custom field to the block feature

Now let's add the field to the block we created. 

1. Navigate to **Build > Features** and select the **Integration for monday workflows** feature you created earlier
2. Add a new input field
3. For field type, choose the **Transformation type** field you just created
4. Leave the field key as the default - **transformationType**
5. For field title, type **Transformation type**
6. Press Save

### Promote it to live and install your app

1. Open your app in the monday Developer Center
2. In the top left corner, click the blue **Promote to Live** button. Your version will be locked after doing this, so double check all your settings before doing it! 
3. Go to **Distribute > Install**. Click **Install App**

You can now add your integration to a workflow and see it in action!

> Note: if you need to make changes to your app feature after promoting it to live, [create a new draft version](https://developer.monday.com/apps/docs/app-versioning#create-a-new-version) and make the changes there.

## Need help?
Post in the [monday developers' community!](https://community.monday.com/c/developers/8) 
