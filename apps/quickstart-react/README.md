## Overview
This is the "Quickstart React" example Monday app. 
<br>It can be used as a board view or dashboard widget, connected to a board and render data from the board using settings.

<br>This app demonstrates how to use: 
- [settings](https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data) 
- [context](https://developer.monday.com/apps/docs/mondayget#sample-context-objects-for-each-feature-type) 
- [API](https://developer.monday.com/apps/docs/mondayapi)

<br>You can find more info in our Quickstart guide [here](https://developer.monday.com/apps/docs/quickstart-view)
<br /> ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/w_900/v1591485466/remote_mondaycom_static/developers/screenshots/final_view.gif)

## Install dependencies

In the project directory, run:

### `npm install`

Start the app locally using:

### `npm start`

Find the provided URL in your terminal. This is your public URL, and you can use it to test your application.
Example: https://abcd12345.apps-tunnel.monday.app

## Deploy your app

Deploy the app with: 

### `npm run deploy`

Follow the prompts to select the app and version to connect your deployment to. 

## Configure app in the monday UI

1. Open monday.com, login to your account and go to the "Developers" section.
2. Create a new "Quickstart View Example App"
3. Open "OAuth & Permissions" section and add "boards:read" scope
4. Open "Build > Features" section and create a new "Board View" feature
5. Select a deployment type:
    If testing locally: Select "External hosting", then paste your tunnel URL
    If deployed: Select "Client-side code via CLI". Leave the subroute field empty. 
6. Open a board, and then add your "Quickstart view example app" view!