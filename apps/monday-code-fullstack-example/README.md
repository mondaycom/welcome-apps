# MondayBaseAppTS

MondayBaseAppTS is a TypeScript-based back end application designed to jumpstart a fullstack application with OAuth. The front end is fully unopinionated.

## Monday CLI

To start using the CLI, you must first install it using the following command:

```bash
npm install -g @mondaycom/apps-cli
```

After installing the CLI, use the mapps init command to add your API token taken from the developers tab:

```bash
mapps init -t <SECRET_TOKEN>
```

<img width="1499" alt="Screenshot 2025-03-07 at 12 12 47 PM" src="https://github.com/user-attachments/assets/807aa53f-6b0a-4ea4-9f87-e01684a7272c" />

## Installation

To install the app, follow these steps:

1. Clone the repository

2. Navigate to the project directory:
   ```bash
   cd MondayBaseAppTS
   ```
3. Install dependencies:

   ```bash
   npm install
   ```

4. Install FE dependencies:
   ```bash
   cd client npm install
   ```

## Usage

Create a new app in monday dev:

<img width="1487" alt="Screenshot 2025-03-07 at 12 58 19 PM" src="https://github.com/user-attachments/assets/21664dc6-62a2-4fc6-ad26-f6773e106331" />

To deploy the code from the <b>root</b> run:

```bash
npm run deploy
```

This will build both the client and backend, then deloy. To deploy your app needs a draft version.
<img width="1507" alt="Screenshot 2025-03-07 at 12 22 47 PM" src="https://github.com/user-attachments/assets/3696aa13-c895-4cdf-997f-d9e78f61c8b3" />

First deploy will take 10-20 minutes.

Then to add your FE go to features, add a board view using the nothing template. Change the name. Click add build in the top right corner change the route to /view. Save it.

<img width="1512" alt="Screenshot 2025-03-07 at 12 24 15 PM" src="https://github.com/user-attachments/assets/07cb4bbe-f20b-4db5-9864-41bc28595381" />
<img width="1302" alt="Screenshot 2025-03-07 at 12 25 10 PM" src="https://github.com/user-attachments/assets/9995360a-3492-42ef-819b-b403708389b6" />
<img width="1227" alt="Screenshot 2025-03-07 at 12 26 12 PM" src="https://github.com/user-attachments/assets/b399e8d7-3619-4f69-a0a0-208fa0cdc519" />
<img width="1301" alt="Screenshot 2025-03-07 at 12 27 11 PM" src="https://github.com/user-attachments/assets/b7187e4e-8c7a-40bc-96da-b3ea07a8051f" />

Then go to the Monday code general tab -- and enter the mentioned env varaibles and secrets.

The values for the assocaited keys are found in the general tab.
<img width="1493" alt="Screenshot 2025-03-07 at 12 30 53 PM" src="https://github.com/user-attachments/assets/9dbf199f-4929-4e90-9698-f99430c0381e" />

Secret Keys:
<img width="1492" alt="Screenshot 2025-03-07 at 12 32 51 PM" src="https://github.com/user-attachments/assets/8dc0d5e2-50d6-48a9-a6b5-83840ae20876" />

1. `CLIENT_SECRET`
2. `MONDAY_SIGNING_SECRET`

Environment variable keys:
<img width="1480" alt="Screenshot 2025-03-07 at 12 31 54 PM" src="https://github.com/user-attachments/assets/8fc4c2ff-2516-47e5-898e-bfd706ed47c5" />

1. `CLIENT_ID`
2. `LIVE_URL` The Live URL will need the app to be promoted to live 1x and then it takes a minute to show up, then add it as an env variable.
   <img width="1484" alt="Screenshot 2025-03-07 at 12 29 23 PM" src="https://github.com/user-attachments/assets/027bea34-d217-4ab0-9d73-976e81ef23ea" />

Make a new draft version.

Go to the Oauth tab and add the scope you think your app needs, the oauth token is permanent and so are its permissions you will need to update your users token if the scopes change. An app will automatically show a permissions warning if the scopes change at the top of a view and allow a user to update. There is also an interceptor in the front end to use optinally that will make it a large pop up if the scopes are not matching.

<img width="1484" alt="Screenshot 2025-03-07 at 12 34 00 PM" src="https://github.com/user-attachments/assets/bff5d8c9-a0a5-44d7-a7ae-8dcd45e752fe" />

The OAuth URL is the same as the LIVE_URL EX:
`https://live1-service-222423429-b13e332373.us.monday.app`

Add your live url call back to oauth:
Redirect URL to put in OAuth tab under redirect url
`https://live1-service-222423429-b13e332373.us.monday.app/oauth/callback`

<img width="1483" alt="Screenshot 2025-03-07 at 12 38 56 PM" src="https://github.com/user-attachments/assets/2573bc5e-fab0-44ec-9089-256b21af2206" />

There are now several ways you can test with this app, you can add the board view as a version or install the app and always use the live version.

If you are using the version method you can use a single app for this, if you are using the live installed method you will likely end up needed a QA and Prod app split.

Version Method:
<img width="1122" alt="Screenshot 2025-03-07 at 12 51 21 PM" src="https://github.com/user-attachments/assets/f087524b-08e7-4388-8dea-256aff554378" />

Then add your board view into a board to test and you now have a base app!

<img width="637" alt="Screenshot 2025-03-07 at 12 53 57 PM" src="https://github.com/user-attachments/assets/0918ff47-c100-424c-a8ef-5d648ed75291" />

## What did doing this get us?

We now have an app that is fully deployable to Monday Code with built in Oauth, examples of every authentication method, and a utils folder in the backend with monday logger, secure storage, secrets manager, a graphql query manager, and env manger, and etc.

## Tips

Use mapps:code logs to connect to the live logs of an instance

Example logs:

logger.info(something)
logger.error(error)

## Local use notes

Create a .env in the roor and look at the .example-env to see what to do to run locally.

Just having your API_KEY and LOCAL=true should be enough to do everything locally
To start the application, run from the root:

```bash
npm run dev-server
```

cd to the client and

```bash
npm run start
```

With these two things running all changes should update in real time and allow local dev. On localhost:3000

Local dev runs in strict mode for react, you will see things render 2x. You can remove this in the clients App.js file if desired.

## Notes

Deploy to Monday code first to get your live URL.
The live URL is returned from the BE, where it looks it up in the env manager.

Anything run from the FE client should go through the clientAuth middleware and have the accountId, userId, etc take from the token.

Anything coming from a monday board should be run through the authorizationMiddleware and things should be taken from the token.
Passing in accountIds, userIds and not having them go through auth middleware is dangerous.

When the app is uninstalled, the secure storage token is deleted if you set up lifecycle hooks. You need to delete all stored user data when it is removed.

Since the app needs to compile the BE and FE to be updated when you run npm run dev:backend it compiles the BE and FE before serving the URL.

Reasons for failures -- your mapps version is out of date!
The api version has updated and you need to move to the newest version.

If you set an env variable like `ENVIRONMENT` to "development" to expose additional endpoints, you will need to make a new version in Monday Code and push a build to remove the variable.
