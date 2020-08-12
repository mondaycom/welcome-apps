## Overview
This is the "Custom Trigger" example Monday app. 
<br>It can be used as a board recipe, and will invoke the trigger every 5 seconds. 

<br>This app demonstrates how to use: 
- integration recipe
- custom trigger
- call authentication with JWT

<br>You can find more info in our QuickStart guide [here](https://monday.com/developers/apps/quickstart-integration/)

## Install

1. Make sure you have Node (v10+) and npm installed

2. Use the correct node version:

```
$ nvm use
```

3. Run node modules install:

```
$ npm install
```
4. Build the database and project:
```
npm run build
```


## Configure your monday App

### Create a new app and integration feature
1. Open monday.com, login to your account and go to a "Developers" section.
2. Create new "Integration Example App"
3. Open "Features" section and create new "Integration" feature
### Create new recipe and custom trigger
1. Open "Recipes" tab
2. Click "Add new recipe"
3. Click "Choose trigger" and choose "Create new custom trigger"
4. Configure trigger input fields and click "Update trigger". We will use a placeholder for our subscribe and unsubscribe URLs until we start our server:
![Custom Trigger Config](https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/uploads/DiproBhowmik/18a8a57b-d928-4e66-9a2b-f3514838bbb3_custom-trigger-config.png)
6. Type "Every 5 seconds" in "Sentence" field

### Configure action

1. Click "Choose action"
2. Click "Create an item"
3. Set the sentence to "create an {item, itemColumnValues}"
4. Configure the output fields as follows:<br>
boardId - context<br>
itemColumnValues - recipe sentence
5. Click "Save recipe". Your recipe should look like this: 
![Recipe config](https://dapulse-res.cloudinary.com/image/upload/f_mp4,f_auto/remote_mondaycom_static/uploads/DiproBhowmik/6248cee3-6c15-4679-8742-697f6970fe18_custom-trigger-recipe.gif)

## Run the project

1. Download, install and build the project according to the instructions in the **Install** section.
2. Add your MONDAY_SIGNING_SECRET to the `.env` file <br>
*To get your `MONDAY_SIGNING_SECRET` go to monday.com, open Developers section, open your app and find the Signing Secret in "Basic Information" section:*
<br> ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/uploads/VladMystetskyi/4db4f03e-67a5-482d-893e-033db67ee09b_monday-Apps2020-05-1901-31-26.png)
3. Run the server with ngrok tunnel with the command:

```
$ npm start
``` 
4. Open http://localhost:4040/status
 to get your ngrok public url
5. Open custom trigger "Every 5 seconds, do something" that we created before and update the {NGROK_URL} placeholders with the ngrok public url that we just got.
<br>** Note that on every restart of the server your ngrok url will change, so you need to change URLs field in the trigger accordingly.
If you want to actively change server-side code and restart the server, you can run ```npm run server``` and ```npm run expose``` in 2 different terminal windows

## Add your recipe to a board
1. Go to any board at monday.com and add your new integration recipe to it
2. Configure the item values in the recipe and press "Create recipe". 
3. Every 5 seconds, the custom trigger will be invoked and a new item will be created on your board.
4. Enjoy your recipe!   

