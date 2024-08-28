import React, { useState } from "react";
import "monday-ui-react-core/dist/main.css";
import "./GetUpdates.scss";
import mondaySdk from "monday-sdk-js";
import RenderItems from "../RenderItems/RenderItems.jsx";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock.jsx";
import Instructions from "../../components/common/Instructions/Instructions.jsx";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader.jsx";
import { useBoardContext } from "../../hooks/UseBoardContext.js";
import { Icon, DialogContentContainer, List, ListItem } from "monday-ui-react-core";
import {Heading} from "monday-ui-react-core/next"
import { Close } from "monday-ui-react-core/icons";
import CodeSamples from "../../constants/codeSamples";

const getUpdatesConstants = {
  title: "Get updates",
  description: "Use Platform API to get communication from board",
  getUpdatesInstructionsParagraphs: [
    `The updates section contains additional notes and communication outside of board column data.`,
    `This examples shows how to retrieve updates from an item using the platform API`,
  ],
  getUpdatesInstructionslinkToDocumentation: `https://developer.monday.com/api-reference/reference/updates#queries`,
  getUpdatesInstructionsListItems: [
    `Click an item from the list which has updates.`,
    `Query the platform API for the updates from this item, using item ID and board ID.`,
    `Display the updates in a dialog box.`,
  ],
  githubUrl: "GetUpdates/GetUpdates.jsx",
  codeSample: CodeSamples.GetUpdates.codeSample,
};


// @mondaycom-codesample-start
const monday = mondaySdk(); 

const GetUpdates = () => {
  const context = useBoardContext();
  const { items, boardId } = context.state;
  const [selectedItem, setSelectedItem] = useState();
  const [updatesData, setUpdatesData] = useState([]);

  const noticeNoUpdatesForItem = () => {
    monday.execute(`notice`, {
      message: "The selected item doesn`t have updates.",
      type: "error",
      timeout: 10000,
    });
  };

  function handleGetUpdates(boardId, item) {
    monday.api(
      `query ($board_id: [ID!], $item_id: [ID!]) {
        boards(ids: $board_id) {
          items_page(query_params: {ids:$item_id}) {
            items {
              updates {
                id
                text_body
                body
                creator {
                  id
                  name
                }
              }
            }
          }
        }
      }`, {
      variables: { board_id: boardId, item_id: item.id },
    }).then((res) => {
      if (res.data.boards[0]?.items_page?.items[0]?.updates.length === 0) {
        noticeNoUpdatesForItem();
      } else {
        const updatesData = res.data?.boards[0]?.items_page?.items[0]?.updates.map((update) => {
          return { id: update.id, name: update.text_body };
        });
        setSelectedItem(item)
        setUpdatesData(updatesData);
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <div className="get-updates-items-container feature-container">
      {/* @mondaycom-codesample-skip-block-start */}
      <CodeBlock contentText={getUpdatesConstants.codeSample} />
      <ActionHeader
        action={getUpdatesConstants.title}
        actionDescription={getUpdatesConstants.description}
      />
      {/* @mondaycom-codesample-skip-block-end */}
      <RenderItems
        itemsData={items}
        actionButtonContent="Get Updates"
        action={(item) => {
          handleGetUpdates(boardId, item)
        }}
      />
      {/* @mondaycom-codesample-skip-block-start */}
      <Instructions
        paragraphs={getUpdatesConstants.getUpdatesInstructionsParagraphs}
        instructionsListItems={getUpdatesConstants.getUpdatesInstructionsListItems}
        linkToDocumentation={getUpdatesConstants.getUpdatesInstructionslinkToDocumentation}
      />
      {/* @mondaycom-codesample-skip-block-end */}
      {updatesData.length > 0 && (
        <div className="overlay">
          <DialogContentContainer className="popup">
            <Icon
              icon={Close}
              onClick={() => {
                setSelectedItem();
                setUpdatesData([]);
              }}
            />
            <Heading className="overlay-header">Updates of {selectedItem.name}</Heading>
            <List>
              {updatesData.map((update) => {
                return <ListItem>{update.name}</ListItem>
              })}
            </List>
          </DialogContentContainer>
        </div>
      )}
    </div>
  );
};
// @mondaycom-codesample-end
export default GetUpdates;
