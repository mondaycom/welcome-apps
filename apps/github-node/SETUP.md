##overview
In order for this integration to work you will need to create an oAuth app using your github account.
To do so, please follow these steps:

1. Copy the TUNNEL_URL the app printed after running the cli command. Example: https://monday-integration-1.loca.lt
2. Navigate to [github.com](https://github.com/ 'github.com') and login to your github's account.
3. Navigate to OAuth apps page by clicking at your avatar > Settings > Developer settings > OAuth Apps, or by clicking [here](https://github.com/settings/developers 'here').
4. Click the "New OAuth App" button, select a name for your app and fill as follows using the tunnel URL you got from the first step: ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610367525/monday-apps-templates/github-node/Screen_Shot_2021-01-11_at_14.18.24.png)
5. After creating the new OAuth app, click the "generate a new client secret" button under Client secrets
6. Copy the Client ID and the newly created Client Secret: ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610369018/monday-apps-templates/github-node/Screen_Shot_2021-01-11_at_14.42.26.png)
7. Paste the ClientID & Secret into the .env file inside of your code directory: ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610369294/monday-apps-templates/github-node/Screen_Shot_2021-01-11_at_14.47.58.png)
8. Save the .env file and your app should be good to go! You can add one of the recipes to your board and try it out :)