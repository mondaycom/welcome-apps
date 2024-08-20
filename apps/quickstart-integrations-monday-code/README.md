# monday code - integration quickstart

A minimal example to help you get started on monday code. [Learn more.](https://developer.monday.com/apps/docs/hosting-your-app-with-monday-code)

## Running the example

For the example to work, you need to set it up in the monday UI, deploy the app, and set environment variables. 

> Prefer a video demo? [Watch here.](https://www.loom.com/share/b982f6b88fc0491f9e70fa424eb91638)

### Setup
- Download the files from Github – `npx degit github:mondaycom/welcome-apps/apps/quickstart-integrations-monday-code`
- Create an app in monday
- Create a “workflows” feature and use the “Node JS Quickstart” template
- Add the scopes and put an arbitrary URL for the server URL

### Deployment
- Change your working directory to the files you downloaded: `cd mondaycode-quickstart`
- Deploy the code: `mapps code:push`
- Follow the prompts in the CLI to select an app and version
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
