## Overview
This is the "Docs Viewer" example Monday app. 
<br>It can be used as a board view or dashboard widget, connected to a board and open attached documents directly in Monday.

<br>This app demonstrates how to use:
- [settings](https://github.com/mondaycom/monday-sdk-js#mondaygettype-params--) 
- [context](https://github.com/mondaycom/monday-sdk-js#mondaygettype-params--) 
- [API](https://github.com/mondaycom/monday-sdk-js#mondayapiquery-options--)
- [storage](https://github.com/mondaycom/monday-sdk-js#mondaystorage)

<br>You can read more about this app [here](https://developer.monday.com/apps/docs/welcome-apps#online-docs-viewer)
<br> ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/uploads/VladMystetskyi/d2634e30-daec-47d2-816e-c9be7d38d392_3VladTestBoardbugwithrecipe2020-06-0800-45-40.png2020-06-0800-48-02.png)

## Run the project

In the project directory, you should run:

### `npm install`

And then to run an application with automatic virtual tunnel, run:

### `npm start`

When you start the app, you will receive a tunnel URL. You should use it in the following section. 

## Configure Monday App 

1. Open monday.com, login to your account and go to a "Developers" section.
2. Create a new "Docs Viewer Example App"
3. Open "OAuth & Permissions" section and add "boards:read" and "me:read" scopes
4. Open "Features" section and create a new "Boards View" feature
5. Open "View setup" tab and fulfill in "Custom URL" field your ngrok public URL, which you got previously (f.e. https://021eb6330099.ngrok.io)
6. Click "Boards" button and choose one of the boards with some data in it.
7. Click "Preview button"
8. Enjoy the Docs Viewer app!

## Release your app
1. Run script
### `npm run build`
2. Zip your "./build" folder
3. Open "Build" tab in your Feature
4. Click "New Build" button
5. Click "Upload" radio button and upload zip file with your build
6. Go to any board and add your just released view
7. Enjoy!
<br> ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/uploads/VladMystetskyi/d2634e30-daec-47d2-816e-c9be7d38d392_3VladTestBoardbugwithrecipe2020-06-0800-45-40.png2020-06-0800-48-02.png)
