import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import React, { useEffect, useState } from "react";
import "./App.css";

// Modern Monday UI components
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js";
import Box from "monday-ui-react-core/dist/Box.js";
import Button from "monday-ui-react-core/dist/Button.js";
import Heading from "monday-ui-react-core/dist/Heading.js";
import TextField from "monday-ui-react-core/dist/TextField.js";
import Divider from "monday-ui-react-core/dist/Divider.js";
import Loader from "monday-ui-react-core/dist/Loader.js";
import Tooltip from "monday-ui-react-core/dist/Tooltip.js";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();

const App = () => {
  const [context, setContext] = useState();
  const [key, setKey] = useState("default_key");
  const [value, setValue] = useState("");
  const [storedValueV1, setStoredValueV1] = useState(null);
  const [storedValueV2, setStoredValueV2] = useState(null);
  const [loading, setLoading] = useState({ v1: false, v2: false });

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
    setLoading(prev => ({ ...prev, v1: true }));
    try {
      await monday.storage.instance.setItem(key, valueToStore);
      await getItemV1(); // Refresh the displayed value
    } catch (error) {
      console.error("Error setting V1 item:", error);
    } finally {
      setLoading(prev => ({ ...prev, v1: false }));
    }
  };

  const getItemV1 = async () => {
    setLoading(prev => ({ ...prev, v1: true }));
    try {
      const response = await monday.storage.instance.getItem(key);
      setStoredValueV1(response.data.value);
    } catch (error) {
      console.error("Error getting V1 item:", error);
      setStoredValueV1(null);
    } finally {
      setLoading(prev => ({ ...prev, v1: false }));
    }
  };

  const deleteItemV1 = async () => {
    setLoading(prev => ({ ...prev, v1: true }));
    try {
      await monday.storage.instance.deleteItem(key);
      setStoredValueV1(null);
    } catch (error) {
      console.error("Error deleting V1 item:", error);
    } finally {
      setLoading(prev => ({ ...prev, v1: false }));
    }
  };

  const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const createManyItemsV1 = async () => {
    const TOTAL_ITEMS = 10000;
    const BATCH_SIZE = 25;
    const totalBatches = Math.ceil(TOTAL_ITEMS / BATCH_SIZE);

    setLoading(prev => ({ ...prev, v1: true }));
    try {
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batchPromises = [];
        const itemsInThisBatch = Math.min(BATCH_SIZE, TOTAL_ITEMS - (batchIndex * BATCH_SIZE));

        for (let i = 0; i < itemsInThisBatch; i++) {
          const randomKey = generateRandomString(5);
          const randomValue = `Value-${generateRandomString(8)}`;
          batchPromises.push(monday.storage.instance.setItem(randomKey, randomValue));
        }

        await Promise.all(batchPromises);
        console.log(`Completed batch ${batchIndex + 1}/${totalBatches}`);
      }

      console.log('Successfully created 10,000 items');
    } catch (error) {
      console.error('Error creating items:', error);
    } finally {
      setLoading(prev => ({ ...prev, v1: false }));
    }
  };

  // V2 (Instance-less) Storage Operations
  const setItemV2 = async () => {
    const valueToStore = value.trim() || new Date().toString();
    setLoading(prev => ({ ...prev, v2: true }));
    try {
      await monday.storage.setItem(key, valueToStore, { ttl: 42 });
      await getItemV2(); // Refresh the displayed value
    } catch (error) {
      console.error("Error setting V2 item:", error);
    } finally {
      setLoading(prev => ({ ...prev, v2: false }));
    }
  };

  const setItemV2HighRate = async () => {
    const valueToStore = value.trim() || new Date().toString();
    setLoading(prev => ({ ...prev, v2: true }));
    try {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          monday.storage.setItem(key, valueToStore, { ttl: i + 10 })
        );
      }
      await Promise.all(promises);
      await getItemV2(); // Refresh the displayed value
    } catch (error) {
      console.error("Error setting V2 item:", error);
    } finally {
      setLoading(prev => ({ ...prev, v2: false }));
    }
  };

  const getItemV2 = async () => {
    setLoading(prev => ({ ...prev, v2: true }));
    try {
      const response = await monday.storage.getItem(key);
      setStoredValueV2(response.data.value);
    } catch (error) {
      console.error("Error getting V2 item:", error);
      setStoredValueV2(null);
    } finally {
      setLoading(prev => ({ ...prev, v2: false }));
    }
  };

  const deleteItemV2 = async () => {
    setLoading(prev => ({ ...prev, v2: true }));
    try {
      await monday.storage.deleteItem(key);
      setStoredValueV2(null);
    } catch (error) {
      console.error("Error deleting V2 item:", error);
    } finally {
      setLoading(prev => ({ ...prev, v2: false }));
    }
  };

  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data
  const attentionBoxText = `Hello, your user_id is: ${
    context ? context.user.id : "still loading"
  }. Let's start building your amazing app, which will change the world!`;

  return (
    <div className="app-container">
      <div className="app-header">
        <AttentionBox
          title="🚀 Welcome to Monday Apps!"
          text={attentionBoxText}
          type="success"
          className="welcome-attention-box"
        />
      </div>

      {/* Configuration Section */}
      <Box 
        padding={Box.paddings.LARGE} 
        margin={Box.marginBottoms.LARGE}
        className="config-section"
      >
        <Heading 
          type={Heading.types.h3} 
          value="Storage Configuration"
          style={{ marginBottom: "24px", color: "var(--primary-text-color)" }}
        />
        
        <div className="input-grid">
          <div className="input-group">
            <label className="input-label">Storage Key</label>
            <TextField
              placeholder="Enter storage key"
              value={key}
              onChange={(value) => setKey(value)}
              size={TextField.sizes.MEDIUM}
              validation={key.trim() ? "success" : "error"}
              required
              className="config-input"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Value</label>
            <TextField
              placeholder="Enter value (or leave empty for current date)"
              value={value}
              onChange={(value) => setValue(value)}
              size={TextField.sizes.MEDIUM}
              className="config-input"
            />
          </div>
        </div>
      </Box>

      <Divider />

      {/* Storage Operations Sections */}
      <div className="storage-sections">
        {/* V1 Storage Section */}
        <Box
          padding={Box.paddings.LARGE}
          className="storage-section v1-section"
        >
          <div className="section-header">
            <div className="section-title-group">
              <Heading
                type={Heading.types.h4}
                value="V1 Storage (Instance-based)"
                style={{ margin: 0 }}
              />
              <span className="badge legacy-badge">Legacy</span>
            </div>
            {loading.v1 && (
              <Loader 
                size={Loader.sizes.SMALL} 
                className="section-loader"
              />
            )}
          </div>

          <div className="button-group">
            <Tooltip content="Store a new item in V1 storage">
              <Button
                size={Button.sizes.MEDIUM}
                onClick={setItemV1}
                disabled={!key.trim() || loading.v1}
                className="action-button primary-action"
              >
                📝 Set
              </Button>
            </Tooltip>
            
            <Tooltip content="Retrieve item from V1 storage">
              <Button
                size={Button.sizes.MEDIUM}
                onClick={getItemV1}
                disabled={!key.trim() || loading.v1}
                kind={Button.kinds.SECONDARY}
                className="action-button"
              >
                🔍 Get
              </Button>
            </Tooltip>
            
            <Tooltip content="Delete item from V1 storage">
              <Button
                size={Button.sizes.MEDIUM}
                onClick={deleteItemV1}
                disabled={!key.trim() || loading.v1}
                kind={Button.kinds.TERTIARY}
                className="action-button"
              >
                🗑️ Delete
              </Button>
            </Tooltip>
            
            <Tooltip content="Create 10,000 items for stress testing">
              <Button
                size={Button.sizes.MEDIUM}
                onClick={createManyItemsV1}
                kind={Button.kinds.PRIMARY}
                color={Button.colors.NEGATIVE}
                disabled={loading.v1}
                className="action-button danger-action"
              >
                ⚡ SUPER-SPAM! (10K Items)
              </Button>
            </Tooltip>
          </div>

          <Box
            padding={Box.paddings.MEDIUM}
            className="value-display"
          >
            <div className="value-label">Stored Value:</div>
            <div className="value-content">
              {storedValueV1 || "No value stored"}
            </div>
          </Box>
        </Box>

        {/* V2 Storage Section */}
        <Box
          padding={Box.paddings.LARGE}
          className="storage-section v2-section"
        >
          <div className="section-header">
            <div className="section-title-group">
              <Heading
                type={Heading.types.h4}
                value="V2 Storage (Instance-less)"
                style={{ margin: 0 }}
              />
              <span className="badge modern-badge">Modern</span>
            </div>
            {loading.v2 && (
              <Loader 
                size={Loader.sizes.SMALL} 
                className="section-loader"
              />
            )}
          </div>

          <div className="button-group">
            <Tooltip content="Store a new item in V2 storage with TTL">
              <Button
                size={Button.sizes.MEDIUM}
                onClick={setItemV2}
                disabled={!key.trim() || loading.v2}
                className="action-button primary-action"
              >
                📝 Set
              </Button>
            </Tooltip>
            
            <Tooltip content="Store multiple items rapidly for stress testing">
              <Button
                size={Button.sizes.MEDIUM}
                onClick={setItemV2HighRate}
                disabled={!key.trim() || loading.v2}
                kind={Button.kinds.SECONDARY}
                className="action-button"
              >
                🚀 Set: High Rate
              </Button>
            </Tooltip>
            
            <Tooltip content="Retrieve item from V2 storage">
              <Button
                size={Button.sizes.MEDIUM}
                onClick={getItemV2}
                disabled={!key.trim() || loading.v2}
                kind={Button.kinds.SECONDARY}
                className="action-button"
              >
                🔍 Get
              </Button>
            </Tooltip>
            
            <Tooltip content="Delete item from V2 storage">
              <Button
                size={Button.sizes.MEDIUM}
                onClick={deleteItemV2}
                disabled={!key.trim() || loading.v2}
                kind={Button.kinds.TERTIARY}
                className="action-button"
              >
                🗑️ Delete
              </Button>
            </Tooltip>
          </div>

          <Box
            padding={Box.paddings.MEDIUM}
            className="value-display"
          >
            <div className="value-label">Stored Value:</div>
            <div className="value-content">
              {storedValueV2 || "No value stored"}
            </div>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default App;
