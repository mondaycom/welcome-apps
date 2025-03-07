# MondayBaseAppTS

MondayBaseAppTS is a TypeScript-based back end application designed to jumpstart a fullstack applicartion with OAuth. The front end is fully unopinionated.

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
To deploy the code from the <b>root</b> run:

```bash
npm run deploy
```

This will build both the client and backend, then deloy. To deploy your app needs a draft version.

First deploy will take 10-20 minutes.

Then to add your FE go to features, add a board view using the nothing template. Change the name. Click add build in the top right corner change the route to /view. Save it.

Then go to the Monday code tab -- and enter the mentioned env varaibles and secrets.

The values for the assocaited keys are found in the general tab.

Secret Keys:

1. `CLIENT_SECRET`
2. `MONDAY_SIGNING_SECRET`

Environment variable keys:

1. `CLIENT_ID`
2. `LIVE_URL` The Live URL will need the app to be promoted to live 1x and then it takes a minute to show up.

The OAuth URL is the same as the LIVE_URL EX:
`https://live1-service-222423429-b13e332373.us.monday.app`

Add your live url call back to oauth:
Redirect URL to put in OAuth tab under redirect url
`https://live1-service-222423429-b13e332373.us.monday.app/oauth/callback`

Promote to live.

Go to install under manage -- click install app.

Then add your board view into a board to test and you now have a base app!

## Tips

Use mapps:code logs to connect to the live logs of an instance

Example logs:

logger.info(something)
logger.error(error)

## Local use notes


To start the application, run from the root:


```bash
npm run dev-server
```

Because the app has authentication built in, in order to develop locally in the client app.js you should do something like this:

LOCALLY ONLY, NEVER THE PUSHED VERSION
A future enchancment is in the works to better handle local developement, right now the app is largely intended for pushing to monday code to test changes because auth is built in. You would also need to bypass auth middleware for local.

```bash
 useEffect(() => {
    // const checkAuth = async () => {
    //   try {
    //     const sessionToken = await monday.get('sessionToken');
    //     const context = await monday.get('context');
    //     const response = await axios.post(
    //       '/api/monday/oauth-flow',
    //       {
    //         context: context,
    //       },
    //       {
    //         headers: {
    //           authorization: sessionToken.data,
    //         },
    //       }
    //     );

    //     const authCheck = response.data.authenticated;
    //     if (authCheck) {
    //       setAuth(true);
    //     } else {
    //       setAuth(false);
    //     }
    //     setLoaded(true);
    //   } catch (error) {
    //     console.error(error);
    //     setAuth(false);
    //     setAuthError(error.stack);
    //   }
    // };
    // checkAuth();
    setAuth(true);
    setLoaded(true);
  }, []);
```

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
