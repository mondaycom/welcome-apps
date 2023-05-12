## Overview

<a href="https://auth.monday.com/oauth2/authorize?client_id=2c984df48bbeb34a02f6084b07eaad6c&response_type=install">
                <img
                  alt="Add to monday.com"
                  height="42"
                  src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/uploads/Tal/4b5d9548-0598-436e-a5b6-9bc5f29ee1d9_Group12441.png"
                />
              </a>

This is the "Github Integration" example Monday app.

It can implement the following recipes:

- When **status** changes to **something**, create an **issue** in **this repository**
- When an issue is created in **this repository**, create an **item**

### Features

This app demonstrates how to use:

- integration recipe
- custom action
- custom trigger
- call authentication with JWT
- query monday API using short lived token (seamless authentication)
- remote options for custom fields
- item mapping
- OAuth process to 3rd party

### Extending the sample code

The code is designed to be easy to understand and extend to any other API. We use JSDoc to document the main functions. There are `@todo` tags to explain some of the parts you need to adapt to your own API.

Learn more in this video: [Exploring the Github sample app](https://www.youtube.com/watch?v=oxG6HVSQh5M)

## Install

1. Make sure you have Node (v10+), npm , and [Node version manager](https://github.com/nvm-sh/nvm) installed

2. Use the correct node version:

```
nvm use
```

3. Run node modules install:

```
npm install
```

## Setup

1. Follow the instructions listed in the [SETUP.md](SETUP.md) file

## Run

1. Run the server with the command:

```
npm start
```
