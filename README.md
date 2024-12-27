# Hello monday.com!
This a collection of example monday.com apps, and is a great place for you to get started building your own application on top of the monday.com platform.

The monday.com platform allows developers to extend it using custom apps that anyone can develop. A monday.com app is a client web project (usually written in HTML, JavaScript and CSS) that can be incorporated into an existing monday.com account, and extend its capabilities anyway that you can imagine.

Make sure to visit our [Developer Docs](https://developers.monday.com) for more information on using the monday.com GraphQL API and other capabilities that are available as part of the application development process.

To get started, pick the example app most suitable for your development preferences and start building!

## Developing locally
Some of the examples in this repository require you to run a local server and expose it to the internet.
To do so, you can either:
1. Use a tunneling service such as [ngrok](https://ngrok.com/) or [localtunnel](https://localtunnel.github.io/www/)
2. Or utilize the monday apps CLI tool, which supports local development and tunneling out of the box. 
To do that, you will need to install node on your machine and then run the following:
 - `npm i -g @mondaycom/apps-cli`
 - `mapps init -t <your-personal-token>` (see here: https://developer.monday.com/apps/docs/quickstart-guide-for-monday-code#command-line-interface)
 - `mapps tunnel:create` inside the example directory you want to run

## Reporting a vulnerability
To report a security vulnerability in this code or in monday.com in general, please use the form at: [https://monday.com/security/form/](https://monday.com/security/form/)
