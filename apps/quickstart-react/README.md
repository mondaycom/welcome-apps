# Building your first monday feature (view/widget)

In this tutorial we will build a simple Hello World app. This tutorial will start simple, and build a more complex app as it goes along. It can be used as a view or a widget. The full code in this example can be found here.

## Before we begin

### You will learn:
+ How to register a monday app
+ How to build a simple "Hello world" app in React
+ How to package and release your app
+ How to allow users to configure settings for your app
+ How to use our SDK to access our APIs


### Previous knowledge
+ Basic understanding of web programming (HTML, CSS, JS)
+ A monday.com account and a basic understanding of monday.com concepts (boards, board views, dashboards, widgets)
+ Working environment of NodeJS on your computer, as well as a package manager like npm or yarn.

*TIP: This particular project uses React, but you should be able to follow along without extensive knowledge of the framework.*

## Part 1: Register your application

The monday apps platform is a set of tools you can use to build on top of monday.com. A single monday app can contain multiple features, and the platform supports adding board views, dashboard widgets, automations and integrations to your apps. A simple app might contain just a single board view, or use multiple views, widgets and integrations to create a set of functionality that extends across contexts.

In this section, we will create a new monday.com app and register a new view or widget feature.


### Create a new app and set up its basic information

To add and manage your apps, click your avatar in the bottom left and select the "Developers" section. In the developers section, click the blue "Create App" button on the top left to create a new application:
![create_app](images/2020/03/create-app.png)

When your app is created, name your app and add a short description. In the collaborators section on the left, add any users on your monday account that you would like to build the application with. Collaborators can access your app's features, add more features and new releases of your application.

### Add a new feature

After adding our app's basic information, we will now add a view or widget to it. Both views and widgets are served to users in an iframe and connect to boards, so for the purpose of this example we can treat them interchangeably.

*TIP: Board views only connect to a single board, while widgets connect to multiple. Widgets can also be resized, so UI elements must be responsive.*

To add a view/widget feature, open the "Features" section of your app and click the "Create Feature" button at the top. Then, choose the option for either a dashboard widget or board view. Once you've added the feature to your application, click the feature's card to configure the individual feature.
![feature_list](images/2020/03/feature-list.png)

Add a title and description to your individual feature. This is what the user will see when they add your app's view/widget to a board or dashboard.
![feature-details](images/2020/03/feature-details.png)

## Part 2: Build a simple "Hello world" app

In this section, we will write some code to display "Hello world" in a board view or widget.

### Download the starter code

We have prepared starter code you can use to begin this exercise. Download it here and install the dependencies by running `npm install` in the directory.

Most of what you will be editing is in the file `src/App.js`. It is already populated with empty functions that we will build out as this tutorial progresses.

<!--
### Create a new React app

We will use `create-react-app` to quickly populate the boilerplate required for our monday app.

Open a terminal window, run **one of the following commands:**
```bash
npx create-react-app hello-world-monday
```
```bash
npm init react-app hello-world-monday
```
```bash
yarn create react-app hello-world-monday
```

This will create a directory of files called hello-world-monday. To test the build was successful, run `npm start` in the directory and open `localhost:3000` in your browser. You should see an animated React logo and a welcome screen. -->

### Edit `src/App.js` to include a simple frontend

Open `App.js` file that you downloaded in the starter code package. In the class `App()` you will see a `render()` function with some HTML tags in it. Replace all the text between the first and last `<div>` tags with the words `Hello world!`. This will display the text "Hello world!" in your board view or widget.

After this step, your `App()` class will look something like this:
```javascript
class App() extends React.Component {
  render() {
    return (
      <div className="App">
        Hello world!
      </div>
    );
  }
}
```

## Part 3: Release your application

To release our simple application, we will bundle it in a ZIP file and upload it to the monday.com server. When uploading a new feature to the monday apps platform, ensure your ZIP file contains a `package.json` that specifies how to build and run it. The starter code already contains this.

1. Create an archive of your app directory (ZIP file).
2. Open your feature, and select the "Releases" tab. Click "New Release" to add a new release of your view/widget.
3. Upload the ZIP you just created. Add a brief description in the release notes.
4. Open a board (or dashboard) and add your app's view (or widget). You should see "Hello world" rendered in monday.com!

Congratulations, you've build a very simple monday app!

## Part 4: Use settings to let the user customize their experience

Now that we have built and released a simple app, we will extend the functionality of this app to include user configuration. In this section, we will allow the user to select the color of our hello world text.

To do this, we will first add a settings field to your feature to get the color value as an input. Then, we will use the monday SDK to retrieve this settings value and use it in our view or widget.

### Adding a color picker settings field to your view or widget

In this step, we will add a color picker setting to our view (or widget). Later, we will update our code to retrieve this setting.

1. Open your app's feature. Open the "View Setup" (or "Widget Setup") pane.
2. On the "View Settings" pane on the right, select the blue "Add Field" button. This will let you add a new field to your feature's settings.
3. In the field selector, choose "Color Picker". This setting field will let the user choose a color.
4. In the field configuration page, change the title to "Text Color". Make sure you keep the "name" of the setting as "color" -- we will use this key to access the setting later.
5. Click done, and save.

Your configuration page should look like this: (ADD SCREENSHOT)

### Accessing the color picker from your view or widget

Now that we have configured the field that the user will change, we need to retrieve this setting and use the value in our app. To do this, we will use the `monday.listen()` method in the SDK.

In the function `componentDidMount`, we will add the `monday.listen()` method to create a listener. Add the following line to your `componentDidMount`:
```javascript
componentDidMount() {
  monday.listen("settings", getSettings);
}
```

Notice that we are calling the `getSettings` function as a callback. We need to add a `settings` field to the app's state and write a function to update this field when the listener makes the callback.

First add the settings to the app's constructor:
```javascript
constructor(props) {
  super(props);
  this.state = {
    settings: {}
  }
}
```

Then add the callback function:

```javascript
getSettings = res => {
  this.setState({settings: res.data});
}
```

A note about the data we receive as settings: the data will be in the form of key-value pairs, where each key is the "name" of the field as configred in your app feature. Since we set the "name" of our color picker field to "color", we can access this particular value by calling `settings.color`.

### Incorporating the color setting in your frontend

Now that we've added functions to retrieve and store our color setting, we need to use this in our app. To set the color of our "hello world" text, we will use the `style` attribute to add the color to our text:
```html
<div className="App" style={{color: (this.state.settings.color)}}>
  Hello world!
</div>
```

By the end of this step, your `render()` function should look like this:
```javascript
render() {
  return (
    <div
      className="App"
      style={{color: (this.state.settings.color)}}
      >
      Hello world!
    </div>
  );
}
```

### Release your application

As we did before, create a ZIP archive of your app files and upload them to your app feature. Once the build is complete, add the feature to a board or widget. It should look like this: **(add screenshot)**

Well done! We've now used the monday SDK to let your users configure what your app shows them. Next, we will use the monday SDK to count the number of items that are on the boards connected to the view/widget, and display them.

## Part 5: Using the monday SDK to read data from a user's monday account

Getting configuration is cool, but the real power of the monday apps platform is displaying data from a user's monday.com account in one experience. In this step, we will extend our feature to count the number of items on the boards connected to your feature (a single board for a view, or multiple for a widget).

### Add a context listener

In the previous step, we initialized a settings listener (`monday.listen("settings", callback)`) when our app is first rendered. Now, we will add another listener to listen to the context that your view/widget is running in.

Add this line to your `componentDidMount()` function:
```javascript
monday.listen("context", this.getContext);
```

Context data lets you understand where your user is accessing your feature from so you can tailor your app's experience without needing additional user input. In our board view/widget feature, the context data will tell us which board (or boards) your feature is being accessed from.

### Start your getContext function

Find the `getContext` function in the starter code. This will handle updating our feature when its context changes.

**TIP: Context changes can include changing boards, switching to dark mode, etc -- but for now we will only focus on the boards our view is connected to.**

First, let's add the context and board IDs to our app's state:
```javascript
getContext = res => {
  this.setState({context: res.data});
  this.setState({boardIds: this.state.context.boardIds});
}
```

### Construct an API query to return the items on the connected boards

Now that we know which boards the user has connected our feature to, we can make a query to the monday API to get the items on these boards.

Our API uses GraphQL, and any call to the API needs to be structured as a query. In this example, we will construct a query that retrieves the IDs of the items on the boards listed in our `context` data. Here's what it looks like generally:
```
query {
  boards (ids:[YOUR_BOARD_ID_HERE]) {
    items {
      id
    }
  }
}
```

Let's break this down. GraphQL queries have a nesting pattern, and each level of nesting specifies an object I want to retrieve as well as the fields I want returned. Here's the same example above, but with a human readable translation of each step:
```
query {                                       // I want to return:
  boards (ids:[YOUR_BOARD_ID_HERE]) {         //    the boards with IDs given. For each board, return:
    items {                                   //        all the items. For each item, return:
      id                                      //            the ID.
    }
  }
}
```

We have not added any of this to our code yet. In the next step, we will go over how to add board IDs to this query dynamically, and then add it to our program.

### Add variables to our query

We're almost there! Now we need to specify which boards to return from, and we need to be able to do it dynamically. We can use GraphQL variables for this.

_Tip: Adding the board IDs dynamically prevents us from having to do string interpolation, which can be costly and inconsistent._

Here is our previous query but in variable form. Notice that we declare the variable in the `query` constructor and then reference it in the query itself:
```
query ($boardIds: [Int]) {
  boards (ids: $boardIds) {
    items {
      id
    }
  }
}
```

As for the actual values of the variables, we will send those as a JSON object when we make the actual API call itself:
```javascript
{
  variables: {boardIds: [12345, 23456]}
}
```

### Make the API call

Now, let's add this query to our `getContext` function -- so we can get a list of items on our boards. We will use the `monday.api()` method for this:

```javascript
if (this.state.boardIds.length > 0) { // only make API call if 1 or more boards are connected
  monday.api(`query ($boardIds: [Int]) { boards (ids:$boardIds) { items { id } } }`,
    { variables: {boardIds: this.state.boardIds} }
  )
  .then(res => this.countItems(res)) // call countItems function upon success
  .catch(err => console.log(err));
} else {
  this.setState({itemCount: 0});
}
```

Since the `monday.api()` method returns a promise, we add a `.then` clause right after to pass the returned data to our `countItems` function.

### Count the items returned by the API call

In this step, we will populate the `countItems` function to count the number of items on each board. The returned data will mirror the structure of our query, and will look like this:
```javascript
{
  data: {
    boards: [
      {
        items: [100, 101,102]
      },
      {
        items: [200, 201]
      }
    ]
  }
}
```

To count this data, we're going to use the `forEach` method:
```javascript
countItems = res => {
  let count = 0;
  res.data.boards.forEach(board => {
    count += board.items.length;
  });
  this.setState({itemCount: count})
}
```

Congratulations! We've now added code to retrieve the items on the boards, count them, and then add this value to your app's state.

### Adding this data to our feature

Let's display this count to the users of our application. Add a break and some additional text to your render method, so it looks like this:
```javascript
render() {
  return (
    <div
      className="App"
      style={{color: (this.state.settings.color)}}
      >
      Hello world! <br/>
      The number of items on the connected boards are {this.state.itemCount}
    </div>
  );
}
```

### Release your feature

Like we did before, create a ZIP archive of your feature and upload it to the monday apps platform.

## Part 6: Celebrate!

Well done! You've now created a simple monday app that displays data and is configurable by the user.
