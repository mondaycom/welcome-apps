import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();

const App = () => {
  const [context, setContext] = useState();

  useEffect(() => {

    // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
    monday.listen("context", (res) => {
      setContext(res.data);
    });
  }, []);

  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data
  const textareaContent = context ? JSON.stringify(context, 2, 2) : "still loading";

  let controllersDiv = <div></div>
  if (context) {
    const  { type: appFeatureType, name: appFeatureName } = context?.appFeature
    switch (appFeatureType) {
      case "AppFeatureAiItemUpdateActions":
        controllersDiv = <div><button onClick={() => {
          monday.execute('updatePostContentAction', { suggestedRephrase: '<u>Shay</u> ' + Date.now().toString() })}}>Test</button></div>
          break;
      case "AppFeatureAiDocTopBar1":
        break;
      case "AppFeatureAiDocTopBar2":
          break
      case "AppFeatureAiDocTopBar2":
          break
    }
  }
  return (
    <div className="App">
      <textarea value={textareaContent}/>
      {controllersDiv}
    </div>
  );
};

export default App;
