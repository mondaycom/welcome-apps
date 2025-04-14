import React from "react"
import "./App.css"
import mondaySdk from "monday-sdk-js"
import "@vibe/core/tokens";
import { Chips, TextField, Button, Tooltip, Icon, IconButton, Heading } from "@vibe/core";
import { LearnMore, Help } from "@vibe/icons";

const monday = mondaySdk();

class App extends React.Component {
  
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      users: [],
      userIds: [],
      boardId: "",
      firstItemId: "",
      showNotificationSender: false,
      showTextFieldChanger: false
    };
    this.setSettings=this.setSettings.bind(this);
  }

  componentDidMount() {
    // Listener for changes in the settings + Creating an array of selected users
    const WhenSettingsAreChanged = res => {
      let namesArray = [];
      let idsArray = [];
      let usersArray = [res.data.users];
      let teammatesArray = [res.data.users.teammates]
      if(!res.data.users.teammates){
        usersArray.forEach(() => {idsArray.push(res.data.users); })
      } else {
        teammatesArray.forEach(() => {idsArray.push(res.data.users.teammates)})
      }
      this.setState({userIds: idsArray})

      monday.api(`query {users(ids: [${idsArray}]) {name}}`).then(res => {
        for (let i = 0; i < res.data.users.length; i++) {
          namesArray.push(res.data.users[i].name); 
        }
        this.setState({users: namesArray})
      });
    }
    monday.listen(['settings'], WhenSettingsAreChanged);

    // Getting the board ID and the ID of the first item in the board
    const setFirstValues = () => {
      monday.get("context").then(res => {
        const currentBoardId = res.data.boardIds[0];
        this.setState({boardId: currentBoardId})
        monday.api(`query { boards(ids: ${currentBoardId}){ items_page (limit: 1) { items { id } } } }`).then (res => {
          this.setState({firstItemId: Number(res.data.boards[0].items_page.items[0].id)})
        })
        let boardSubscribersArray = [];
        monday.api(`query {boards(ids: ${currentBoardId}) {subscribers {id}}}`).then(res => {
          for (let i = 0; i < res.data.boards[0].subscribers.length; i++) {
            boardSubscribersArray.push(res.data.boards[0].subscribers[i].id)
          }
          monday.set("settings", {"users": boardSubscribersArray});
        })
      })
    }
    setFirstValues();
  }

  // Toggle the notifications sender
  toggleNotificationSender () {
    this.setState({showNotificationSender: !this.state.showNotificationSender})
    this.setState({showTextFieldChanger: false})
  };

  // Toggle the text field changer
  toggleTextFieldChanger () {
    this.setState({showTextFieldChanger: !this.state.showTextFieldChanger})
    this.setState({showNotificationSender: false})
  };

  // Showing the instructions
  showInstructions () {
    this.setState({showTextFieldChanger: false})
    this.setState({showNotificationSender: false})
  };

  // Opening and closing the settings for the app's board view
  openSettings () {
    monday.execute('openSettings');
  };

  closeSettings () {
    monday.execute('closeSettings');
  };

  // Rendering the name of the selected users in chips
  renderUserNames() {
    return this.state.users.map(userName=>{
      return <Chips label={userName} readOnly />
    });
  }

  // Rendering the instructions screen
  renderInstructions(){
    return(
      this.state.showTextFieldChanger===false && this.state.showNotificationSender===false ? 
        <div>
          <Heading className="InstructionsTitle">Instructions:</Heading>
          <p className="InstructionsParagraph">
            This is a basic sample app to give you some tips and tools to improve the onboarding experience for your users. In it you will find examples on:
          </p>
          <ul className="InstructionsParagraph">
            <li> How to <a target="_blank" rel="noreferrer" href="https://developer.monday.com/apps/docs/mondayexecute#open-setting-window">open and close the view settings</a> using the SDK </li>
            <li> How to <a target="_blank" rel="noreferrer" href="https://developer.monday.com/apps/docs/mondayset#setting-application-settings-data">change the view settings</a> from the view itself, using the SDK </li>
            <li> How to implement a <a target="_blank" rel="noreferrer" href="https://developer.monday.com/apps/docs/value-created-event-best-practices">webhook</a> to let monday know when your app has given the account real value for the first time (for future reports) </li>
            <li> How to <a target="_blank" rel="noreferrer" href="https://developer.monday.com/apps/docs/mondaylisten">listen</a> to changes in the view settings using the SDK </li>
            <li> How to <a target="_blank" rel="noreferrer" href="https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data">retrieve the selected settings</a> to use them in your view</li>
            <li> How to use <a target="_blank" rel="noreferrer" href="https://style.monday.com/">Vibe</a>, our design system </li>
            <li> How to use <a target="_blank" rel="noreferrer" href="https://style.monday.com/?path=/docs/popover-tooltip--overview">tooltips</a> to explain how parts of your app work </li>
            <li> How to use <a target="_blank" rel="noreferrer" href="https://developer.monday.com/apps/docs/introduction-to-the-sdk#seamless-authentication">seamless authentication</a> using the SDK </li>
            <li> How to show <a target="_blank" rel="noreferrer" href="https://developer.monday.com/apps/docs/mondayexecute#example-2">notice messages</a> using the SDK </li>
          </ul>
          <p className="InstructionsParagraph">
            You can start using this app by clicking on one of the two available features at the top of the screen.
          </p>
          <div className="InstructionsFooter">
            <div className="CtaText">
              <a href="https://forms.monday.com/forms/cf0a3d75c1be9f92ef089cb7b6038b21?r=use1" target="_blank" rel="noreferrer">
                <p>
                  Send us your feedback
                </p>
              </a>
            </div>
            <div className="CtaText">
              <a href="https://developer.monday.com/apps/docs/intro" rel="noreferrer" target="_blank">
                <p>
                  Documentation
                </p>
              </a>
            </div>
            <div className="CtaText">
              <a href = "https://support.monday.com/hc/en-us/requests/new?ticket_form_id=13855862562962" target="_blank" rel="noreferrer">Email support</a>
            </div>
          </div>
        </div>
      :null
    )
  }

  // Rendering the buttons to open and close the settings
  renderOpenCloseSettings() {
    return(
      <div className="OpenCloseSettingsContainer">
        <div className="CtaButton">
          <Button kind="secondary" className="SendButton" onClick={() => this.openSettings()} >
            Open settings
          </Button>
        </div>

        <div className="CtaButton">
          <Button kind="secondary" className="SendButton" onClick={() => this.closeSettings()} >
            Close settings
          </Button>
        </div>
      </div> 
    )   
  }

  // Render the notification sender
  renderNotificationSender() {
    return (
      this.state.showNotificationSender ? 
      <div>
        <div className="AppTitle">
          <Heading>Notifications sender</Heading>
        </div>

        <div>
          {this.renderOpenCloseSettings()}
        </div>  

          <div className="SelectedUsersContainer">
            <Heading type="h2">Selected users:</Heading>
          <div className="monday-storybook-tooltip_box">
            <Tooltip content="Please use the view's settings to select the users you want to send the notification to">
              <div className="monday-storybook-tooltip_icon-wrapper">
                <Icon icon={LearnMore} className="monday-storybook-tooltip_icon-wrapper TitleIcon"/>
              </div>
            </Tooltip>
          </div>
        </div>

      <div>
        {this.renderUserNames()}
      </div>

      <Heading type="h2" className="BodyTitle">Notification's body:</Heading>

      <div className="TextFieldContainer">
        <TextField
          id= "NotificationTextField"
          className="TextField"
          iconName="fa fa-square"
          placeholder="Write your notification's body here"
          showCharCount
          title=""
          validation={{
            text: 'Please keep it under 100 characters!'
          }}
          wrapperClassName="monday-storybook-text-field_size"
          maxLength="100"
        />
      </div>

      <div className="ButtonContainer">
        <Button kind="secondary" onClick={() => {
          this.sendFirstValueWebhook();
          this.sendNotification()}} >
          Send Notification
        </Button>
      </div>
    </div>
    : null
    )
  }

  // Rendering the text field changer
  renderTextFieldChanger () {
    return (
      this.state.showTextFieldChanger ? 
      <div>
        <div className="AppTitle">
          <Heading>Change the value of a text field in the settings</Heading>
        </div>

       <Heading type="h3" className="SecondaryHeader TextFieldTextArea">Please write the new value the text field will have</Heading>

        <div>
          {this.renderOpenCloseSettings()}
        </div>  

        <div className="TextFieldContainer">
          <TextField
            id= "SetSettingsTextField"
            className="TextField"
            iconName="fa fa-square"
            placeholder="Write the new value of the text field for the settings here"
            showCharCount
            title=""
            validation={{
              text: 'Please keep it under 30 characters!'
            }}
            wrapperClassName="monday-storybook-text-field_size"
            maxLength="30"
          />
        </div>

        <div className="ButtonContainer">
          <Button kind="secondary" onClick={() => this.setSettings()} >
            Change the text field's value in the settings
          </Button>
        </div>
      </div>
    :null
    )
  }

  // Sending a webhook to monday notifying when the user get their first value from using the app
  sendFirstValueWebhook () {
    monday.execute('valueCreatedForUser')
  };

  // Sending a notification to the selected users (first value for the user) (please note that being this a simple sample app, errors are not being contemplated when showing the succcess message) 
  sendNotification () {
    for (let i = 0; i < this.state.userIds.length; i++) {
      monday.api(`mutation {create_notification(text: "${document.getElementById("NotificationTextField").value}", user_id: ${this.state.userIds[i]}, target_id: ${this.state.firstItemId}, target_type: Project) { id }}`);
      this.sendFirstValueWebhook();
      monday.execute("notice", { 
        message: "Your notification was sent successfully. You will see it soon!",
        type: "success", 
        timeout: 5000,
     });
    }
  }

  // Setting the text field's value to what is inside of the text area in our app (please note that being this a simple sample app, errors are not being contemplated when showing the succcess message) 
  setSettings = () => {
    monday.set("settings", {"text": document.getElementById("SetSettingsTextField").value});
    monday.execute("notice", { 
      message: "The text field in the settings was succesfully changed!",
      type: "success", 
      timeout: 5000,
   });
  }

  render() { 
    return <div className="App">
      <div className="MenuBar">
        <div className="CtaButton">
          <IconButton icon={Help} kind="secondary" onClick={() => this.showInstructions()} />
        </div>
        <div className="CtaButton">
          <Button className="SendButton" onClick={() => this.toggleNotificationSender()} >
            Notifications sender
          </Button>
        </div>
        <div className="CtaButton">
          <Button className="SendButton" onClick={() => this.toggleTextFieldChanger()} >
            Text field changer
          </Button>
        </div>
      </div>

      <div className="AppBody">
        <div>
          {this.renderInstructions()}
        </div>
        <div>
          {this.renderNotificationSender()}
        </div>
        <div>
          {this.renderTextFieldChanger()}
        </div>
      </div>
    </div>
  }
}    

export default App;

