# Quickstart minimal samples for monday-code

This repo contains a bare bones structure for the server technologies that are supported in monday-code. Their sole purpose is to demonstrate a "Hello world" setup that enables to deploy each quick-start setup to monday code

## How to

1. First, you'll need to create an app on monday.com, see here: https://developer.monday.com/apps/docs/manage
2. Then, inside the developer center within your app page go to the "hosting" tab and click on the "monday code" section
3. Accept terms and conditions, and you will be able to connect your app to monday code
4. You will need to install monday's apps CLI. To do so:
- Install nodejs on your machine
- Install our CLI: `npm install -g @mondaycom/apps-cli`. 
- CLI docs can be found here: https://developer.monday.com/apps/docs/monday-code-cli
5. Connect to monday code - https://developer.monday.com/apps/docs/monday-code-cli#mapps-init
6. Now, `cd` into one of the quick starts, according to your favorite programming language and run the following command:
```
mapps code:push
```
6. After choosing your app and the version to which this code is going to be deployed, the CLI will start a deploy process that might take around 20 minutes. Don't worry, next deployments will be much shorter (around 3 minutes)
7. After the deployment is done, you'll receive a publically available URL in your CLI where your web app is running.
8. To see live logs, you can now run:
```
mapps code:logs
```
9. Run the URL that you've received in your browser
