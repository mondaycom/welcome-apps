# new info: 
Kitchen sink app. Some stuff to know: 

## How to start it

1. Run `nvm use` – this app uses node 14
2. Run `npm install` then `npm run start`
3. Open `localhost:4040` to see your ngrok url
4. Paste ngrok URL into a board view

## Todo: 

### to fix:
- Fix vulnerabilities
- Migrate code snippets to react hooks
- Migrate snippets to v 2023-10
- Fix how we retrieve code samples
- Review copy 

### nice to have - 
- Package as a workspace app or object app
- Update design and layout
- Add tests

# old info: 

## Overview

This is the "Kitchen Sink" example Monday app.
<br>It should be used as a board view, connected to a board and fetching all items data from it.
<br>Please notice that listening to itemIds via SDK is not working in preview mode at this point. this feature allows you to use Monday filters to get relevant items to the application.

<br>This app demonstrates how to use:

- [SDK](https://github.com/mondaycom/monday-sdk-js)
- [API](https://api.developer.monday.com/docs)

## Run the project

In the project directory, you should run:

### `npm install`

And then to run an application with automatic virtual ngrok tunnel, run:

### `npm start`

Visit http://localhost:4040/status and under "command_line section" find the URL. This is the public URL of your app, so you can use it to test it.
F.e.: https://021eb6330099.ngrok.io

## Configure Monday App

1. Open monday.com, login to your account and go to a "Developers" section.
2. Create a new Application
3. Open "OAuth & Permissions" section and add "boards:read" and "boards:write" scope
4. Open "Features" section and create a new "Boards View" feature
5. Open "View setup" tab and fulfill in "Custom URL" field your ngrok public URL, which you got previously (f.e. https://021eb6330099.ngrok.io)
6. Click "Boards" button and choose one of the boards with some data in it.
7. Click "Preview button"
8. Enjoy the Kitchen Sink app!
## Release your app

1. Run script

### `npm run build`

2. Zip your "./build" folder
3. Open "Build" tab in your Feature
4. Click "New Build" button
5. Click "Upload" radio button and upload zip file with your build
6. Go to any board and add your just released view
7. Enjoy!
