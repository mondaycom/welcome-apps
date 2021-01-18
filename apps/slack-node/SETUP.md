## overview
In order for this integration to work you will need to create an oAuth app using your slack account.
To do so, please follow these steps:

1. Copy the tunnel url the app printed after running the cli command. Example: https://monday-integration-1.loca.lt
2. Navigate to [slack apps](https://api.slack.com/apps/ 'slack apps') and login to your slack account.
3. Click the "Create New App" button, fill the name, select the workspace and click "Create App".
4. On the left pane under "Features" click "OAuth & Permissions".
5. Add your tunnel url as a "Redirect URL" with the /auth route: <br/>![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610370577/monday-apps-templates/slack-node/Screen_Shot_2021-01-11_at_15.09.25.png) 
6. Scroll down and add the following User Token Scopes: <br/>![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610369859/monday-apps-templates/slack-node/Screen_Shot_2021-01-11_at_14.57.09.png)
7. On the left pane under "Settings" click "Basic Information".
8. Copy the Client ID and Client Secret from the App Credentials: <br/>![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610369924/monday-apps-templates/slack-node/Screen_Shot_2021-01-11_at_14.58.31.png)
9.  Paste the ClientID & Secret into the .env file inside of your code directory: <br/>![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1610370048/monday-apps-templates/slack-node/Screen_Shot_2021-01-11_at_15.00.36.png)
10. Save the .env file and your app should be good to go! You can add one of the recipes to your board and try it out :)