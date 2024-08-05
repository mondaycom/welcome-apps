import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();

const App = () => {
  const [context, setContext] = useState();

  useEffect(() => {
    monday.listen("context", (res) => {
      setContext(JSON.stringify(res.data, null, 2));
    });
  }, []);



  return (
      <div className="App">
        <textarea value={context}/>
        <button onClick={async () => {
          await monday.execute('attachExtensionsToColumn');
          await monday.execute('closeDialog');
        }}
        >Attach Extension
        </button>
        <button onClick={async () => {
          await monday.execute('detachExtensionsToColumn');
          await monday.execute('closeDialog');
        }}
        >Detach Extension
        </button>
      </div>
  );
};

export default App;
