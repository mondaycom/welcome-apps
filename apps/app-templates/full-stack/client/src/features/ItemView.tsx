import React from "react";
import { useState, useEffect } from "react";
import mondaySdk from "monday-sdk-js";
//Explore more Monday React Components here: https://style.monday.com/
import { AttentionBox } from "monday-ui-react-core";
import "monday-ui-react-core/dist/main.css";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();

const ItemView = () => {
    const [context, setContext] = useState<undefined | Record<any, any>>();

    useEffect(() => {
        monday.listen("context", (res) => {
            setContext(res.data);
        });
    }, []);

    const attentionBoxText = `Hello, your user_id is: ${
        context ? context.user.id : "still loading"
    }.
  Let's start building your amazing index, which will change the world!`;

    return (
        <div className="App">
            <AttentionBox
                title="Hello ItemView App!"
                text={attentionBoxText}
                type={AttentionBox.types.SUCCESS}
            />
        </div>
    );
};

export default ItemView;
