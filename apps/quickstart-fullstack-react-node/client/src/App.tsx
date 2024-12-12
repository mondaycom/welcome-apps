import React, {useEffect, useState} from "react";
import "./App.css";
import mondaySdk, {MondayClientSdk} from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://vibe.monday.com/
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js";
import {TextField} from "@vibe/core";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday: MondayClientSdk = mondaySdk();
const STORAGE_EXAMPLE_KEY = 'my_example_key';

const App = () => {
    const [context, setContext] = useState<Object>();
    const [storageExampleText, setStorageExampleText] = useState<String>();

    useEffect(() => {
        // Notice this method notifies the monday platform that user gains a first value in an app.
        // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
        monday.execute("valueCreatedForUser");

        // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
        monday.listen("context", (res) => {
            setContext(res.data);
        });

        monday.storage.instance.getItem(STORAGE_EXAMPLE_KEY).then(res => {
            setStorageExampleText(res.data.value);
        })
    }, []);

    useEffect(() => {
        if (storageExampleText !== undefined) {
            monday.storage.instance.setItem(STORAGE_EXAMPLE_KEY, storageExampleText)
        }
    }, [storageExampleText]);

    //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data

    const getAttentionBox = () => {
        if (context) {
            return {
                attentionBoxText: `Hello, your user_id is: ${context.user.id}`,
                attentionBoxType: 'success'
            }
        } else
        {
            return {
                attentionBoxText: `Could not load context data`,
                attentionBoxType: 'warning'
            }
        }
    };

    const { attentionBoxText, attentionBoxType} = getAttentionBox()

    return (
        <div className="App">
            <AttentionBox
                title="Hello Monday Apps!"
                text={attentionBoxText}
                type={attentionBoxType}
            />
            <TextField title="My first text field" value={storageExampleText} onChange={async (value: String, event) => {
                setStorageExampleText(value)
            }}></TextField>

        </div>
    );
};

export default App;
