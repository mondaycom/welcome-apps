import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import React, { useEffect, useState } from "react";
import "./App.css";
//Explore more Monday React Components here: https://style.monday.com/
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js";
import Box from "monday-ui-react-core/dist/Box.js";
import Button from "monday-ui-react-core/dist/Button.js";
import Heading from "monday-ui-react-core/dist/Heading.js";
import TextField from "monday-ui-react-core/dist/TextField.js";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();

const App = () => {
  const [context, setContext] = useState();
  const [key, setKey] = useState("default_key");
  const [value, setValue] = useState("");
  const [storedValueV1, setStoredValueV1] = useState(null);
  const [storedValueV2, setStoredValueV2] = useState(null);

  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    monday.execute("valueCreatedForUser");

    // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
    monday.listen("context", (res) => {
      setContext(res.data);
    });
  }, []);

  // V1 (Instance-based) Storage Operations
  const setItemV1 = async () => {
    const valueToStore = value.trim() || new Date().toString();
    try {
      await monday.storage.instance.setItem(key, valueToStore);
      getItemV1(); // Refresh the displayed value
    } catch (error) {
      console.error("Error setting V1 item:", error);
    }
  };

  const getItemV1 = async () => {
    try {
      const response = await monday.storage.instance.getItem(key);
      setStoredValueV1(response.data.value);
    } catch (error) {
      console.error("Error getting V1 item:", error);
      setStoredValueV1(null);
    }
  };

  const deleteItemV1 = async () => {
    try {
      await monday.storage.instance.deleteItem(key);
      setStoredValueV1(null);
    } catch (error) {
      console.error("Error deleting V1 item:", error);
    }
  };

  // V2 (Instance-less) Storage Operations
  const setItemV2 = async () => {
    const valueToStore = value.trim() || new Date().toString();
    try {
      // TODO: Maor: use this next "debugger" line to stop execution when running client code
      // debugger;
      // TODO: work with TTL
      await monday.storage.setItem(key, valueToStore, { ttl: 42 });
      getItemV2(); // Refresh the displayed value
    } catch (error) {
      console.error("Error setting V2 item:", error);
    }
  };

  const setItemV2HighRate = async () => {
    const valueToStore = value.trim() || new Date().toString();
    try {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          monday.storage.setItem(key, valueToStore, { ttl: i + 10 })
        );
      }
      await Promise.all(promises);
      getItemV2(); // Refresh the displayed value
    } catch (error) {
      console.error("Error setting V2 item:", error);
    }
  };

  const getItemV2 = async () => {
    try {
      const response = await monday.storage.getItem(key);
      setStoredValueV2(response.data.value);
    } catch (error) {
      console.error("Error getting V2 item:", error);
      setStoredValueV2(null);
    }
  };

  const deleteItemV2 = async () => {
    try {
      await monday.storage.deleteItem(key);
      setStoredValueV2(null);
    } catch (error) {
      console.error("Error deleting V2 item:", error);
    }
  };

  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data
  const attentionBoxText = `Hello, your user_id is: ${
    context ? context.user.id : "still loading"
  }.
  Let's start building your amazing app, which will change the world!`;

  return (
    <div
      className="container"
      style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}
    >
      <AttentionBox
        title="Hello Monday Apps!"
        text={attentionBoxText}
        type="success"
        className="monday-style-attention-box"
      />

      <Box padding={Box.paddings.MEDIUM} margin={Box.marginBottoms.MEDIUM}>
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <TextField
            placeholder="Enter storage key"
            value={key}
            onChange={(value) => setKey(value)}
            size={TextField.sizes.MEDIUM}
            validation={key.trim() ? "success" : "error"}
            required
          />
          <TextField
            placeholder="Enter value (or leave empty for current date)"
            value={value}
            onChange={(value) => setValue(value)}
            size={TextField.sizes.MEDIUM}
          />
        </div>

        <div
          style={{
            display: "grid",
            gap: "24px",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <Box
            padding={Box.paddings.MEDIUM}
            border={Box.borders.DEFAULT}
            rounded={Box.roundeds.MEDIUM}
            style={{ backgroundColor: "#ffffff" }}
          >
            <Heading
              type={Heading.types.h3}
              value="V1 Storage (Instance-based)"
            />
            <div style={{ display: "flex", gap: "8px", margin: "16px 0" }}>
              <Button
                size={Button.sizes.MEDIUM}
                onClick={setItemV1}
                disabled={!key.trim()}
              >
                Set
              </Button>
              <Button
                size={Button.sizes.MEDIUM}
                onClick={getItemV1}
                disabled={!key.trim()}
                kind={Button.kinds.SECONDARY}
              >
                Get
              </Button>
              <Button
                size={Button.sizes.MEDIUM}
                onClick={deleteItemV1}
                disabled={!key.trim()}
                kind={Button.kinds.TERTIARY}
              >
                Delete
              </Button>
            </div>
            <div style={{ marginTop: "8px" }}>
              <strong>Stored Value:</strong>{" "}
              {storedValueV1 || "No value stored"}
            </div>
          </Box>

          <Box
            padding={Box.paddings.MEDIUM}
            border={Box.borders.DEFAULT}
            rounded={Box.roundeds.MEDIUM}
            style={{ backgroundColor: "#ffffff" }}
          >
            <Heading
              type={Heading.types.h3}
              value="V2 Storage (Instance-less)"
            />
            <div style={{ display: "flex", gap: "8px", margin: "16px 0" }}>
              <Button
                size={Button.sizes.MEDIUM}
                onClick={setItemV2}
                disabled={!key.trim()}
              >
                Set
              </Button>
              <Button
                size={Button.sizes.MEDIUM}
                onClick={setItemV2HighRate}
                disabled={!key.trim()}
              >
                Set: high rate
              </Button>
              <Button
                size={Button.sizes.MEDIUM}
                onClick={getItemV2}
                disabled={!key.trim()}
                kind={Button.kinds.SECONDARY}
              >
                Get
              </Button>
              <Button
                size={Button.sizes.MEDIUM}
                onClick={deleteItemV2}
                disabled={!key.trim()}
                kind={Button.kinds.TERTIARY}
              >
                Delete
              </Button>
            </div>
            <div style={{ marginTop: "8px" }}>
              <strong>Stored Value:</strong>{" "}
              {storedValueV2 || "No value stored"}
            </div>
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default App;
