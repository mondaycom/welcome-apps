## Overview

### Setting up the app in Github
In order for this integration to work you will need to create an OAuth app using your github account.

To do so, please follow these steps:

1. Copy the TUNNEL_URL the app printed after running the `scaffold` command or `npm run start`. Example: https://abc1234.apps-tunnel.monday.com

2. Navigate to [github.com](https://github.com/) and login to your github account.

3. Navigate to OAuth apps page by clicking at your avatar > Settings > Developer settings > OAuth Apps, or by clicking [here](https://github.com/settings/developers 'here').

4. Click the "New OAuth App" button, select a name for your app and fill as follows using the tunnel URL you got from the first step: <br/>![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610367525/monday-apps-templates/github-node/Screen_Shot_2021-01-11_at_14.18.24.png)

5. After creating the new OAuth app, click the "generate a new client secret" button under Client secrets

6. Copy the Client ID and the newly created Client Secret: <br/>![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610369018/monday-apps-templates/github-node/Screen_Shot_2021-01-11_at_14.42.26.png)

7. Paste the ClientID & Secret into the .env file inside of your code directory: <br/>![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610369294/monday-apps-templates/github-node/Screen_Shot_2021-01-11_at_14.47.58.png)

8. Save the .env file and your app should be good to go! You can add one of the recipes to your board and try it out :)

### Troubleshooting the sqlite3 server

This app uses `sqlite3`, which is included as a dependency. If you receive an error when installing it, refer to the [sqlite3 package documentation](https://www.npmjs.com/package/sqlite3) for troubleshooting tips.

### Happy building! 