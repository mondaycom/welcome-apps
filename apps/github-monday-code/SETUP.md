## Overview

### Base setup of the app in Monday

To set up the app in Monday, follow these steps:

1. Open monday.com, login to your account and go to a "Developers" section.
2. Create new "monday-code Github Workflow Example App".
3. Open "Features" section and create new "Workflow" feature.
4. Choose the "Github Integration - NodeJS" template to start. **Don't** run the suggested command.
5. Run this project with `npm run dev` and paste the resulting URL (from the command output) into the URL box and press create.

### Configure OAuth in Monday

1. Press `OAuth` in the `General` section of the left menu.
2. Enter the `Redirect URLs` tab.
3. Add the following URL: `https://<YOUR_URL>/auth/monday/callback` and **press save**.

Congrats, you have successfully set up the app in Monday! 🎉

## Setting up the app in Github

To integrate with Github, you need to create an OAuth app using your Github account. Follow these steps to set it up:

1. Copy the url outputted by running the `npm run dev` command. For example: `https://happy-pig-99.tunnel.monday.app`.

2. Navigate to [github.com](https://github.com/) and login to your github account.

3. Go to the OAuth apps page by clicking on your avatar > Settings > Developer settings > OAuth Apps, or click [here](https://github.com/settings/developers).

4. Click the "New OAuth App" button, choose a name for your app, and fill in the details using the tunnel URL obtained from step 1:
   ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610367525/monday-apps-templates/github-node/Screen_Shot_2021-01-11_at_14.18.24.png)

5. After creating the OAuth app, click the "generate a new client secret" button under Client secrets.

6. Copy the Client ID and the newly created Client Secret:
   ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610369018/monday-apps-templates/github-node/Screen_Shot_2021-01-11_at_14.42.26.png)

7. For development purposes, paste the Client ID, Secret, and your tunnel URL into the .env file inside your code directory:
   ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1689682643/github-monday-code-env-snapshot.png)
   Note: `PORT` should be set to `8080`.

8. Save the .env file, and your app is ready to go! You can add one of the recipes to your board and try it out.

9. For setting environment variables in production after deploying to monday-code, you can use @mondaycom/apps-cli to set the project secrets:
   1. Install apps-cli:
      ```bash
      $ npm i -g @mondaycom/apps-cli
      ```
   2. Set secrets:
      ```bash
      $ mapps code:env
      ```
      Choose the app to set environment variables > set > enter the secret key > then enter the value of the secret. The secret will be injected into process.env of your deployment.

### Happy building! 🎉
