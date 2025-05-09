## Overview
This is the "Quickstart React for Board column extension" example. 
<br>It can be used as a board view or dashboard widget, connected to a board and render data from the board using settings.

<br>This app demonstrates how to use: 
- [settings](https://github.com/mondaycom/monday-sdk-js#mondaygettype-params--) 
- [context](https://github.com/mondaycom/monday-sdk-js#mondaygettype-params--) 
- [API](https://github.com/mondaycom/monday-sdk-js#mondayapiquery-options--)

<br>You can find more info in our guide [here](https://developer.monday.com/apps/docs/board-column-extension)

## Run the project

In the project directory, you should run:

### `npm install`

And then to run an application with the monday tunnel, run:

### `npm start`

Find the provided URL in your terminal. This is your local URL: http://localhost:8302, if you like to get a public can use the Apps CLI by running the following command `mapps tunnel:create -p 8302` and then you are expected to get a public url for example: https://abcd12345.apps-tunnel.monday.com

## Configure Monday App 

1. Open monday.com, login to your account and go to a "Developers" section.
2. Create a new "QuickStart Board column extension View Example App"
3. Open "OAuth & Permissions" section and add "boards:read" scope
4. Open "Features" section and create a new "Boards View" feature
5. Open "View setup" tab and fulfill in "Custom URL" field your monday tunnel public URL, which you got previously (example: https://abcd12345.apps-tunnel.monday.com)
6. Click "Boards" button and choose one of the boards with some data in it.
7. Click "Preview button"
8. Enjoy the Quickstart View Example app!

## Release your app
1. Run script
### `npm run build`
2. Zip your "./build" folder
3. Open "Build" tab in your Feature
4. Click "New Build" button
5. Click "Upload" radio button and upload zip file with your build
6. Go to any board and add your just released view
7. Enjoy!
