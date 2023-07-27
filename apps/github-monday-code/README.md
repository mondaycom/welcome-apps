## Overview

This is the "Github Integration" example Monday app.

It can implement the following recipes:

- When **status** changes to **something**, create an **issue** in **this repository**
- When an issue is created in **this repository**, create an **item**

### Features

This app demonstrates how to use:

- use monday apps storage
- deploy to monday code
- integration recipe
- custom action
- custom trigger
- call authentication with JWT
- query monday API using short lived token (seamless authentication)
- remote options for custom fields
- item mapping
- OAuth proccess to 3rd party

### Extending the sample code

The code is designed to be easy to understand and extend to any other API. We use JSDoc to document the main functions. There are `@todo` tags to explain some of the parts you need to adapt to your own API.

## Install

1. Make sure you have Node (v18+), npm , and [Node version manager](https://github.com/nvm-sh/nvm) installed

2. Use the correct node version:

```
$ nvm use
```

3. Run node modules install:

```
$ npm install
```

## Setup

1. Follow the instructions listed in the [SETUP.md](SETUP.md) file

## Run

1. Run the server with the command:

```
$ npm start
```

## Deploy

1. For the first time,use this command to initialize monday code

```
$ npm run mapps init
```

you will be prompted to insert your monday access token, to get your token go to Developer section > My access tokens

2. start deployment to monday-code using the following command:

```
$ npm run deploy
```

3. choose your app that will be associated with the deployment
4. 
