import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import Delta from 'quill-delta';

//Explore more Monday React Components here: https://style.monday.com/
import { Button } from "monday-ui-react-core";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();

const App = () => {

  async function capitalizeText() {
    try {
      monday.execute("valueCreatedForUser");

      // set context
      const currentContext = await monday.get('context');
      const { range, focusedBlocks } = currentContext.data;
      
      // loop through "focusedBlocks" to update each block in the highlighted text
      focusedBlocks.forEach(async (block) => {
        let original = new Delta(block.content.deltaFormat);

        // make elements of the current block all uppercase
        const updated = original.map((op) => {
          if (range !== null) {
            const start = range.index;
            const end = range.index + range.length;
            const newInsert = op.insert.substring(0, start) + op.insert.substring(start, end).toUpperCase() + op.insert.substring(end, op.insert.length)
            const ret = {
              insert: newInsert,
              attributes: op?.attributes
            }
            return ret;
          }
          else if (typeof op.insert === 'string') {
            const ret = {
              insert: op.insert.toUpperCase(),
              attributes: op?.attributes
            }
            return ret;
          }
          else {
            return '';
          }
        })
         
        // Use monday.execute() to update the current block
        const id = block.id;
        const content = {
          deltaFormat: updated 
        };
        const data = await monday.execute('updateDocBlock', { id, content })

        return data;
      });
      
      // Use monday.execute() to close the app modal once the action is complete
      monday.execute('closeDocModal');

    } catch (error) {
      console.log(`There was an error: ${error}`);
    }
  }

  return (
    <div className="App">
      <Button onClick={() => capitalizeText()}>Capitalize</Button>
    </div>
  );
};

export default App;
