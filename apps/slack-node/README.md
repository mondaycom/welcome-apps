## Overview

This is the "Slack Integration" example Monday app.
<br>It can be used as a board recipe:

- When an update is created, post it in <b>this channel</b>

<br>This app demonstrates how to use:

- integration recipe
- custom action
- call authentication with JWT
- query monday API using short lived token (seamless authentication)
- remote options for custom fields
- oAuth proccess to 3rd party

## Install

1. Make sure you have Node (v10+) and npm installed

2. Use the correct node version:

```
$ nvm use
```

<br>
3. Run node modules install:

```
$ npm install
```

## Run the project

1. Run the server with the command:

```
$ npm start
```

## Add your tunnel URL to .env

The monday CLI will print your app's URL in the format `https://abcd1234.apps-tunnel.monday.com`. Copy this URL and paste it in the .env file. 