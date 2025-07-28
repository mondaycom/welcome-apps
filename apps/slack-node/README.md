## Overview

This is an example of how to create an "Integration for monday workflows" that connects Monday.com with Slack.
<br>It demonstrates building a recipe sentence integration that can be used on any board:

- When an update is created, post it in <b>this channel</b>

<br>This app shows you how to build integrations using:

- integration recipe for monday workflows
- custom action handling
- JWT authentication with monday
- monday API queries using short lived tokens (seamless authentication)
- remote options for dynamic custom fields
- oAuth flow integration with third-party services (Slack)

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
$ npm run dev
```

## Add your tunnel URL to .env

The monday CLI will print your app's URL in the format `https://abcd1234.apps-tunnel.monday.com`. Copy this URL and paste it in the .env file.
