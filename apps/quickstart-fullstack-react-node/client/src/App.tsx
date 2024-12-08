import React from "react";
import {useState, useEffect} from "react";
import "./App.css";
import mondaySdk, {MondayClientSdk} from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js";
import {TextField} from "@vibe/core";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday: MondayClientSdk = mondaySdk();

const App = () => {
    const [context, setContext] = useState<Object>();
    const [text, setText] = useState<String>();


    const my_key = 'aa';
    useEffect(() => {
        // Notice this method notifies the monday platform that user gains a first value in an app.
        // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
        monday.execute("valueCreatedForUser");

        // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
        monday.listen("context", (res) => {
            setContext(res.data);
        });

        monday.storage.instance.getItem(my_key).then(res => {
            setText(res.data.value);
        })
    }, []);

    useEffect(() => {
        if (text !== undefined) {
            monday.storage.instance.setItem(my_key, text)
        }
    }, [text]);

    //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data
    let attentionBoxText: String = `Could not load context data`
    let attentionBoxType: String = 'warning'

    if (context) {
        attentionBoxText = `Hello, your user_id is: ${context.user.id}`;
        attentionBoxType = 'success';
    }

    return (
        <div className="App">
            <AttentionBox
                title="Hello Monday Apps!"
                text={attentionBoxText}
                type={attentionBoxType}
            />
            <TextField title="My first text field" value={text} onChange={async (value: String, event) => {
                setText(value)
            }}></TextField>

        </div>
    );
};

export default App;
