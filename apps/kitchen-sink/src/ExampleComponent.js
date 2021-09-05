import React, { useState, useEffect } from "react";
// import "./ExampleComponent.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js";

const monday = mondaySdk();

const query = `query ($boardIds: [Int]) { boards (ids:$boardIds) { name items(limit:1) { name column_values { title text } } } }`;

const DEFAULT_SETTINGS_VALUES = {
  attentionBoxTitle: "Default Title",
  attentionBoxMessage: "Default Message",
  attentionBoxType: "primary",
};

const ExampleComponent = () => {
  // Component's state
  const [settings, setSettings] = useState({});
  const [boardData, setBoardData] = useState("");

  // Component's add listeners
  useEffect(() => {
    monday.listen("settings", (res) => {
      setSettings(res.data);
    });

    monday.listen("context", (res) => {
      //You can use 'monday.get("context")' in order to fetch and update the data once.
      monday.api(query, { variables: { boardIds: res.data.boardIds } }).then((res) => {
        setBoardData(res.data);
      });
    });

    return function cleanup() {};
  }, []);

  return (
    <div className="ExampleComponent" style={{ background: settings.background || "#e2445c" }}>
      <AttentionBox
        title={settings.attentionBoxTitle || DEFAULT_SETTINGS_VALUES.attentionBoxTitle}
        text={settings.attentionBoxMessage || DEFAULT_SETTINGS_VALUES.attentionBoxMessage}
        type={settings.attentionBoxType || DEFAULT_SETTINGS_VALUES.attentionBoxType}
      />
      {JSON.stringify(boardData, null, 2)}
    </div>
  );
};

export default ExampleComponent;
