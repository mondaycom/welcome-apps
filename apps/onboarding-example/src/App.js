import React from "react"
import "./App.css"
import mondaySdk from "monday-sdk-js"
import "monday-ui-react-core/dist/main.css"
import Heading from "monday-ui-react-core/dist/Heading.js"
import Chips from "monday-ui-react-core/dist/Chips.js"
import TextField from "monday-ui-react-core/dist/TextField.js"
import Button from "monday-ui-react-core/dist/Button.js"
import Tooltip from "monday-ui-react-core/dist/Tooltip.js"
import Icon from "monday-ui-react-core/dist/Icon.js"
import LearnMore from "monday-ui-react-core/dist/icons/LearnMore"
import Help from "monday-ui-react-core/dist/icons/Help"
import IconButton from "monday-ui-react-core/dist/IconButton.js"

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
        monday.api(`query { boards(ids: ${currentBoardId}){ items (limit: 1) { id } } }`).then (res => {
          this.setState({firstItemId: Number(res.data.boards[0].items[0].id)})
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
          <Heading value="Instructions:" className= "InstructionsTitle"/>
          <p className="InstructionsParagraph">
            This is a basic sample app to give you some tips and tools to improve the onboarding experience for your users. In it you will find examples on:
          </p>
          <ul className="InstructionsParagraph">
            <li> How to <a target="_blank" href="https://developer.monday.com/apps/docs/mondayexecute#open-setting-window">open and close the view settings</a> using the SDK </li>
            <li> How to <a target="_blank" href="https://developer.monday.com/apps/docs/mondayset#setting-application-settings-data">change the view settings</a> from the view itself, using the SDK </li>
            <li> How to implement a <a target="_blank" href="https://developer.monday.com/apps/docs/value-created-event-best-practices">webhook</a> to let monday know when your app has given the account real value for the first time (for future reports) </li>
            <li> How to <a target="_blank" href="https://developer.monday.com/apps/docs/mondaylisten">listen</a> to changes in the view settings using the SDK </li>
            <li> How to <a target="_blank" href="https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data">retrieve the selected settings</a> to use them in your view</li>
            <li> How to use <a target="_blank" href="https://style.monday.com/">Vibe</a>, our design system </li>
            <li> How to use <a target="_blank" href="https://style.monday.com/?path=/docs/popover-tooltip--overview">tooltips</a> to explain how parts of your app work </li>
            <li> How to use <a target="_blank" href="https://developer.monday.com/apps/docs/introduction-to-the-sdk#seamless-authentication">seamless authentication</a> using the SDK </li>
            <li> How to show <a target="_blank" href="https://developer.monday.com/apps/docs/mondayexecute#example-2">notice messages</a> using the SDK </li>
          </ul>
          <p className="InstructionsParagraph">
            You can start using this app by clicking on one of the two available features at the top of the screen.
          </p>
          <div className="InstructionsFooter">
            <div className="CtaText">
              <a href="https://forms.monday.com/forms/cf0a3d75c1be9f92ef089cb7b6038b21?r=use1" target="_blank">
                <p>
                  Send us your feedback
                </p>
              </a>
            </div>
            <div className="CtaText">
              <a href="https://developer.monday.com/apps/docs/intro" target="_blank">
                <p>
                  Documentation
                </p>
              </a>
            </div>
            <div className="CtaText">
              <a href = "mailto: example@example.com" target="_blank">Email support</a>
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
          <Button kind={Button.kinds.SECONDARY} className="SendButton" onClick={() => this.openSettings()} >
            Open settings
          </Button>
        </div>

        <div className="CtaButton">
          <Button kind={Button.kinds.SECONDARY} className="SendButton" onClick={() => this.closeSettings()} >
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
          <Heading value="Notifications sender" />
        </div>

        <div>
          {this.renderOpenCloseSettings()}
        </div>  

          <div className="SelectedUsersContainer">
            <Heading type={Heading.types.h2} value="Selected users:" size="small" />
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

      <Heading type={Heading.types.h2} value="Notification's body:" size="small" className="BodyTitle"/>

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
        <Button kind={Button.kinds.SECONDARY} onClick={() => this.sendFirstValueWebhook(), () => this.sendNotification()} >
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
          <Heading value="Change the value of a text field in the settings" />
        </div>

       <Heading type={Heading.types.h3} value="Please write the new value the text field will have" size="small" className="SecondaryHeader TextFieldTextArea"/>

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
          <Button kind={Button.kinds.SECONDARY} onClick={() => this.setSettings()} >
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
          <IconButton icon={Help} kind={IconButton.kinds.SECONDARY} onClick={() => this.showInstructions()} />
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

