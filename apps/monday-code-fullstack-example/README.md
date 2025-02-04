# MondayBaseAppTS

MondayBaseAppTS is a TypeScript-based back end application designed to jumpstart a fullstack applicartion with OAuth. The front end is fully unopinionated.
Note: Deploy to Monday code first to get your live URL.
The live URL is returned from the BE, where it looks it up in the env manager.

Make sure the following environment variables are added to Monday:

1. `CLIENT_ID`
2. `LIVE_URL`

Make sure these secrets are added to Monday:

1. `CLIENT_SECRET`
2. `MONDAY_SIGNING_SECRET`

The OAuth URL is the same as the LIVE_URL and is the live URL you will find after pushing to monday code. EX:
`https://live1-service-222423429-b13e332373.us.monday.app`

Redirect URL to put in OAuth
`https://live1-service-222423429-b13e332373.us.monday.app/oauth/callback`

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

To start the application, run:

```bash
npm start
```

To deploy the code from the <b>root</b> run:

```bash
npm run deploy
```

First run will take 10-20 minutes.

Then go to the Monday code tab -- and enter the mentioned env varaibles and secrets.

The Live URL will need the app to be promoted to live 1x and then it takes a minute to show up.

Add oauth live url:
Redirect URL to put in OAuth
`https://live1-service-222423429-b13e332373.us.monday.app/oauth/callback`

Make a new version of the app in the dashboard.

Then to add your FE go to features, add a board view using the nothing template. Change the name. Click add build change the route to /view. Save it.

Promote to live.

Go to install under manage -- click install app.

Then add your board view into a board to test and you now have a base app!

## Notes

Anything run from the FE client should go through the clientAuth middleware and have the accountId, userId, etc take from the token.
Anything coming from a monday board should be run through the authorizationMiddleware and things should be taken from the token.
Passing in accountIds, userIds and not having them go through auth middleware is extremely dangerous.

When the app is uninstalled, the secure storage token is deleted. You need to delete all stored user data when it is removed.

Since the app needs to compile the BE and FE to be updated when you run npm run dev:backend it compiles the BE and FE before serving the URL.

Reasons for failures -- your mapps version is out of date!
The api version has updated and you need to move to the newest version.

If you set an env variable like `ENVIRONMENT` to "development" to expose additional endpoints, you will need to make a new version in Monday Code annd push a build to remove the variable.
