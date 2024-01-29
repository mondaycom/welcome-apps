# Integration template

## Overview

This repository contains the code for a sample integration app that connects Monday with a 3rd party API. 

## Installation

1. Ensure you have Node.js (v18+), npm, and [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm) installed on your system.

2. Use the correct Node.js version by running the following command:

```bash
$ nvm use
```

3. Install node modules by running:

```bash
$ npm install

```
## Run

1. To start the server in development, run the following command:

```bash
$ npm run dev
```

## Deploying to [monday code](https://developer.monday.com/apps/docs/hosting-your-app-with-monday-code) hosting

1. For the first-time deployment, use this command to initialize Monday code:

```bash
$ npm run mapps:init
```

You will be prompted to insert your Monday access token. To get your token, go to Developer section > My access tokens.

2. Start deployment to monday-code using the following command [monday apps cli](https://github.com/mondaycom/monday-code-cli#mapps-codepush):

```bash
$ npm run deploy
```

    1. Choose your app that will be associated with the deployment.
    2. Choose the draft version to deploy.
    3. Optionally, you can run the following command to receive your server logs if you [are] using [Monday logger](https://github.com/mondaycom/monday-code-cli#mapps-codelogs) :

```bash
$ npm run logs
```


# Using Monday Apps CLI

To use [Monday apps-cli](https://github.com/mondaycom/monday-code-cli) globally, you can run the following command:

```bash
$ npm i -g @mondaycom/apps-cli
```
