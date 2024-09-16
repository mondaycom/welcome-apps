## Overview

## monday setup

### Create an app

To set up the app in Monday, follow these steps:

1. Open monday.com & login to your account. 
2. Open the "Developers" section: Click your avatar menu > Developers
3. Create a new app - "Create app"

### Add an integration feature
1. Open "Features" section and create new "Integration for Sentence Builder" feature.
2. Choose the "Github Integration - NodeJS" template to start. **Don't run the suggested command yet.**
3. Run this project with `npm run dev` and paste the resulting URL (from the command line) into the URL box and press create.
![tunnel url example](./assets/initialize_app.png)

### Configure OAuth in Monday

1. Press `OAuth` in the `General` section of the left menu.
2. Enter the `Redirect URLs` tab.
3. Add the following URL: `https://<YOUR_URL>/auth/monday/callback` and **press save**.
![Redirect URL example](./assets/redirect_url_screenshot.png)

### Add monday OAuth info to .env file

1. Open the `Basic Information` tab
2. Copy-paste your app's client ID, client secret, and signing secret into your app's .env file. 

Congrats, you have successfully set up the app in Monday! 🎉

## Github setup

To integrate with Github, you need to create an OAuth app using your Github account. Follow these steps to set it up:

### Open OAuth apps page in Github
1. Copy the url outputted by running the `npm run dev` command. For example: `https://happy-pig-99.tunnel.monday.app`.
2. Navigate to [github.com](https://github.com/) and login to your github account.
3. Go to the OAuth apps page by clicking on your avatar > Settings > Developer settings > OAuth Apps, or click [here](https://github.com/settings/developers).

### Create OAuth app
4. Click the "New OAuth App" button, choose a name for your app, and fill in the details using the tunnel URL obtained from step 1. Click "Register application" when done:
   - Name your app something descriptive, such as "Github monday example app"
   - Add your app's URL as the homepage URL
   - Add the following Authorization Callback URL: "https://<your URL>/auth/github/callback"
   - Leave "Enable device flow" unchecked
![Screenshot](./assets/oauth-github-setup.png)

### Add client ID and secret to .env file
5. After creating the OAuth app, click the "generate a new client secret" button under Client secrets.
6. Copy the Client ID and the newly created Client Secret:
   ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610369018/monday-apps-templates/github-node/Screen_Shot_2021-01-11_at_14.42.26.png)

7. For development purposes, paste the Client ID, Secret, and your tunnel URL into the .env file inside your code directory:
   ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1689682643/github-monday-code-env-snapshot.png)
> Note: `PORT` should be set to `8080`.

8. Save the .env file, and your app is ready to go! You can add one of the recipes to your board and try it out.

## Test the app in your account

1. Open a board in your monday account
2. Click the "Integrate" button at the top of the page
3. Search for your app's feature name – "Github Integration - NodeJS" by default
4. Select a recipe sentence, configure it, and click "Create automation" to create it

## Deploying your app to monday code hosting
1. Connect to your monday account by running `mapps init` and supplying your account's API token. 

2. Run `mapps code:push` to deploy your app. Select the app in your account from options presented. 

3. After deployment, you can use the `code:env` commands in the monday CLI to set the project secrets:
   1. Call secrets command:
      ```bash
      $ mapps code:secret
      ```
    2. Choose the app to set environment variables > set > enter the secret key > then enter the value of the secret. The secret will be injected into process.env of your deployment.

# Happy building! 🎉
