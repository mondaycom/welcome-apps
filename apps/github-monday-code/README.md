# Github Integration - Monday App Example

## Overview

This repository contains the example Monday app called "Github Integration." The app demonstrates how to implement the following recipes:

1. When the **status** changes to **something**, it creates an **issue** in **this repository**.
2. When an issue is created in **this repository**, it creates an **item**.

## Features

This app showcases how to use various Monday app functionalities, including:

- Using Monday apps storage
- Utilizing Monday logger
- Managing Monday code environment using the Monday code environment manager
- Deploying the app to Monday code
- Implementing an integration recipe
- Creating custom actions and triggers
- Authenticating with JWT (JSON Web Tokens)
- Querying Monday API using short-lived tokens for seamless authentication
- Providing remote options for custom fields
- Mapping items
- Implementing OAuth process for 3rd party integrations

## Extending the Sample Code

The code is designed to be easily understandable and extendable for any other API. We use JSDoc to document the main functions. In the code, you will find `@todo` tags to indicate areas that require adaptation for your specific API.

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

## Setup

1. Follow the instructions listed in the [SETUP.md](SETUP.md) file

## Run

1. To start the server in development, run the following command:

```bash
$ npm run dev
```
or
```bash
$ npm start
```
to run the server

## Deploying the App

1. For the first-time deployment, use this command to initialize Monday code:

```bash
$ npm run mapps init
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