## Overview
This is an onboarding tips and good practices example Monday app. 
<br>It contains a board view feature in which we use some tools that can help you create a better onboarding experience for your users.

<br>         
You will find examples on:
How toopen and close the view settings using the SDK
How to change the view settings from the view itself, using the SDK 
How to implement a webhook to let monday know when your app has given the account real value for the first time (for future reports) 
How to listen to changes in the view settings using the SDK 
How to retrieve the selected settingsto use them in your view
How to use Vibe, our design system 
How to use tooltips to explain how parts of your app work 
How to use seamless authentication using the SDK 
How to show notice messages using the SDK 

<br>
You can check our explanatory video here (https://www.youtube.com/watch?v=MaEHUar1rAY)

## Run the project

In the project directory, you should run:

### `npm install`

And then you can run

### `npm run start`

Take the URL from your CLI you can then paste in your app's board view feature's custom URL.

## Configure Monday App 

1. Open monday.com, login to your account and go to a "Developers" section.
2. Create a new app
3. Open "OAuth & Permissions" section and add "boards:read", "users:read" and "notifications:write" scopes
4. Open "Features" section and create a new "Boards View" feature from scratch
5. Open "View setup" tab and fulfill in "Custom URL" field your public URL, which you got previously
6. Save the feature, go to any of your boards and add the board view to it
