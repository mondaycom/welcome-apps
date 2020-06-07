## Run the project

In the project directory, you should run:

### `npm install`

And then to run an application with automatic virtual ngrok tunnel, run:

### `npm start`

Visit http://localhost:4040/status and under "command_line section" find the URL. This is the public URL of your app, so you can use it to test it.
F.e.: https://021eb6330099.ngrok.io

## Configure Monday App 

1. Open monday.com, login to your account and go to a "Developers" section.
2. Create a new "Word Cloud Example App"
3. Open "OAuth & Permissions" section and choose "boards:read" scope
4. Open "Features" section and create a new "Boards View" feature
5. Open "View setup" tab and fulfill in "Custom URL" field your ngrok public URL, which you got previously (f.e. https://021eb6330099.ngrok.io)
6. Click "Boards" button and choose one of the boards with some data in it.
7. Click "Preview button"
8. Enjoy the Word Cloud app!

## Add View Settings field
Our app can have some settings field and it will rerender itself based on them. Let's add them to our feature

1. Click "Add Fields" button and choose "Column" on the left pane.
2. Don't change any of the settings and save it
3. Add another field with the type "Buttons". Add Title `Max number of words` and Name `maxWords`
Add any options for it as you wish, f.e.:
50, 100, 150, 200, 300
<br /> ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/uploads/VladMystetskyi/fcd37840-645a-42d8-a115-866c34a46dea_13monday-Apps2020-06-0322-01-53.png)

4. Add another field with type "Buttons". Add Title `Padding` and Name `padding`.
Add any options for it, f.e.:
Small | 10
Medium | 20
Large | 30
<br /> ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/uploads/VladMystetskyi/df9a7ecb-94aa-4a29-8f21-189b04db141c_13monday-Apps2020-06-0322-03-39.png)
5. Preview your application and try to change the view settings and look how it reacts to it!
<br /> ![Screenshot](https://dapulse-res.cloudinary.com/image/upload/f_mp4,f_auto/remote_mondaycom_static/uploads/VladMystetskyi/b0eb2f62-5664-440a-8385-3011328f36b8_screencast2020-06-0322-36-16.gif)

## Release your app
1. Run script
### `npm run build`
2. Zip your "./build" folder
3. Open "Build" tab in your Feature
4. Click "New Build" button
5. Click "Upload" radio button and upload zip file with your build
6. Go to any board and add your just released view
7. Enjoy!
