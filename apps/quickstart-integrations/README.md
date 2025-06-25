# Integration quickstart

A minimal example to build your first integration app feature. [Learn more in our docs.](https://developer.monday.com/apps/docs/quickstart-deploy-your-first-app)

## Running the example

For the example to work, you need to do the following steps: 
1. Create and configure your app in monday:
    a. Create an app
    b. Add an integration app feature to your app
2. Download the integration example code
3. Deploy the example code to the app you created
4. Test the app on a board

> Prefer a video demo? [Watch here.](https://www.loom.com/share/b982f6b88fc0491f9e70fa424eb91638)

## Create and configure the app in monday
1. Create a new app. Name it something descriptive and press save. 
2. Add a new app feature.
   a. In the dialog that appears, select Integrations for sentence builder and click Next.
   b. Choose the Quickstart Integration - NodeJS template. Click next. 
   c. Check the box to automatically add any missing OAuth scopes.
   d. Ignore the scaffold command prompt. Instead, add a dummy URL: https://myserver.com.
   e. Click Create.

## Download the example code
- Download the files from Github 
```npx degit github:mondaycom/welcome-apps/apps/quickstart-integrations-monday-code```

## Deploy your app
- Run the deployment command: `npm run deploy`
- Follow the prompts in the CLI to select the app you just created and version
- When deployment is complete, you will get a URL
- Paste the URL as the `Base URL` of your workflows feature

### Setting environment variables
- Copy your app’s Signing Secret from the “General info” section
- Set the signing secret by running the following command – `mapps code:env -m set -k MONDAY_SIGNING_SECRET -v <your_signing_secret> -i <your app id>`

### Using the app
- Open a board
- Click "Integrations" on the top and select your app feature
- Add your workflow to the board
- Configure it by selecting an input column, output column, and transformation type. Press 'Add to board'
- Write some text in the input column. It will be transformed and added to the output column

### Local development (optional)
- Run `npm run dev` to start the app server on port 8080
- Run `ngrok http 8080` to create a tunnel
- Paste your ngrok tunnel URL as the `Base URL` of your feature

## Need help?
Post in the [monday developers' community!](https://community.monday.com/c/developers/8) 
