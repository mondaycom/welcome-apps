## Overview

This is the "Quickstart Integration" example Monday app.
<br>It can be used as a board recipe, which transforms data from one text column to another

<br>This app demonstrates how to use:

- integration recipe
- custom action
- custom trigger
- API
- remote options for custom fields

## Install

1. Make sure you have Node (v12+) and npm installed

2. Use the correct node version:

```
$ nvm i 14 && nvm use 14
```

<br>
3. Run node modules install:

```
$ npm install
```

4. init database (sqlite3 + sequelize)
```
$ npm run db:init
```

## Configure Monday App

### Create new slack app

1. Create a new slack app by clicking **Create New App** [here](https://api.slack.com/apps)
2. Copy the created slack app's secrets: **Client ID**, **Client Secret** and **Signing Secret** into the .env file
3. under Add features and functionality add the following:
    1. **Permissions**:
        1. Install the app to the workspace (for enabling `slash` commands)
        2. Add to `Redirect URLs` your auth callback url (currently <NGROK_ADDRESS>/auth)
        3. In `Scopes` (Bot Token Scopes) add `commands` scope
    2. **Slash Commands**:
        1. Add new command - `/monday_createitem`
        2. Add request URL (currently `<NGROK_ADDRESS>/slack/trigger`)
        3. Save


###########

## Run the project

1. Add your MONDAY_SIGNING_SECRET to .env file
   <br> \*\* To get your MONDAY_SIGNING_SECRET go to monday.com, open Developers section, open your app and find the Signing Secret in "Basic Information" section
   <br> ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/uploads/VladMystetskyi/4db4f03e-67a5-482d-893e-033db67ee09b_monday-Apps2020-05-1901-31-26.png)
2. Run the server with ngrok tunnel with the command:

```
$ npm start
```

3. Your ngrok url will be printed in the terminal (example bellow):

```
$ listening at localhost:8302 || tunnel: https://af55cda7254c.ngrok.io
```

## Add your recipe to the board

1. Go to any board at monday.com and add your new integration recipe to it
2. Enjoy your recipe!
