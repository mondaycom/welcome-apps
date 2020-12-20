## Overview

This is the "Quickstart Integration" example Monday app.
<br>It can be used as a board recipe, which transforms data from one text column to another

<br>This app demonstrates how to use:

- integration recipe
- custom action
- call authentication with JWT
- API
- remote options for custom fields

<br>You can find more info in our QuickStart guide [here](https://monday.com/developers/apps/quickstart-integration/)
<br>![Screenshot](https://dapulse-res.cloudinary.com/image/upload/f_mp4,f_auto/remote_mondaycom_static/uploads/VladMystetskyi/c3be2380-c5a5-4a4f-bbe6-305ba3bea620_screencast2020-05-1910-49-37.gif)

## Install

1. Make sure you have Node (v10+) and yarn installed

2. Use the correct node version:

```
$ nvm use
```

<br>
3. Install dependencies with yarn:

```
$ yarn install
```

## Configure Monday App

### Create new app and integration feature

1. Open monday.com, login to your account and go to a "Developers" section.
2. Create new "Integration Example App"
3. Open "Features" section and create new "Integration" feature

### Create new recipe and trigger

1. Open "Recipes" tab
2. Click "Add new recipe"
3. Click "Choose trigger" and choose "When a column changes" trigger
4. Type "When {text column, columnId} changes" in "Sentence" field
5. Configure trigger input fields:
   <br>boardId - Context
   <br>columnId - Recipe Sentence (Text Column)
   <br> ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/uploads/VladMystetskyi/7ca206bf-d494-43f3-bd62-439061d6ec13_monday-Apps2020-06-0722-35-56.png)

### Create new custom action

1. Click "Choose action"
2. Click "Create new action"
3. Name your action "Transform text"
4. Type in "Run URL" field: https://{NGROK_URL}/transformation/transform
   <br> \*\* we will update {NGROK_URL} placeholder later, when we will bring up our local server
5. Add the following input fields that our action will need in order to run:
   <br>Board - boardId
   <br>Item - itemId
   <br>Column - sourceColumnId
   <br>Column - targetColumnId
   <br> ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/uploads/BenRosenfeld/a459fe3d-0242-4eae-bd26-8a4029a81acb_ScreenShot2020-05-18at21.10.51.png)
6. Click "Create action"

### Configure action in the recipe

1. Choose your custom action in the recipe
2. Type “transform to {another column, targetColumnId}” in "Sentence" field
3. Configure action input fields
   <br>boardId - Trigger Output (boardId)
   <br>itemId - Trigger Output (itemId)
   <br>sourceColumnId - Trigger Output (columnId)
   <br>targetColumnId - Recipe Sentence (Text column type)
   <br> ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/uploads/VladMystetskyi/fdd30a2e-7ce0-4e04-844c-b1b7657fd4b4_screencast2020-05-1901-19-15.gif)
   4.Click "Create Recipe" button

## Run the project

1. Add your MONDAY_SIGNING_SECRET to .env file
   <br> \*\* To get your MONDAY_SIGNING_SECRET go to monday.com, open Developers section, open your app and find the Signing Secret in "Basic Information" section
   <br> ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/uploads/VladMystetskyi/4db4f03e-67a5-482d-893e-033db67ee09b_monday-Apps2020-05-1901-31-26.png)
2. Run the server with ngrok tunnel with the command:

```
$ npm start
```

<br> 
3. Open http://localhost:4040/status
 to get your ngrok public url

<br>4. Open custom action "Transform text" that we created before and update {NGROK_URL} part in "Run URL" field with the ngrok public url, that we just got
<br>\*\* Note that on every restart of the server, your ngrok url will change, so you need to change "Run URL" field in the action.
If you want to actively change server-side code and restart the server, you can run `npm run server` and `npm run expose` in 2 different terminal windows

## Add your recipe to the board

1. Go to any board at monday.com (it should have at least 2 text columns) and add your new integration recipe to it
2. Configure source and target columns in your recipe
3. Update the value in the source column and in a few moments the target one will be update with the transformed text
4. Enjoy your recipe!
