import React, { useState, useEffect } from "react";
import './ListenToBoardFilter.scss';

import mondaySdk from "monday-sdk-js";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import CodeSamples from "../../constants/codeSamples";
import {
  Tab,
  TabList,
  TabsContext,
  TabPanel,
  TabPanels,
  Tooltip, 
  Button,
  AttentionBox,
} from "monday-ui-react-core";
import { useAppContext } from "../../hooks/UseAppContext"
import _ from "lodash";

const listenToBoardFilterConstants = {
  actionTitle: 'Listen to board filter',
  actionSubtitle: `Use the SDK to see what items the user has filtered.`,
  instructionsParagraphs: [`Executes callback function when filter or search changes.`],
  instructionslinkToDocumentation: `https://developer.monday.com/apps/docs/mondaylisten#retrieve-the-search-query-in-your-app`,
  instructionsListItems: [
    `Type something in the board search, or use the board filter.`,
    `Check the Playground to see how this data is passed to your app.`,
  ],
  githubUrl: "Confirmation/Confirmation.jsx",
  codeSample: CodeSamples.ListenToBoardFilter.codeSample,
};

const TabComponent = ({ filterState, searchTerm }) => {
  return (
    <div className="tabsWrapper">
      <TabsContext>
        <TabList className="tabListWrapper">
          <Tab className="tabWrapper">Item IDs</Tab>
          <Tab className="tabWrapper">Search & Filter</Tab>
        </TabList>
        <TabPanels animationDirection={TabPanels.animationDirections.LTR} className="tabPanelContainer">
          <TabPanel className="codeDisplayBlock">
            The item IDs object tells you which items are currently filtered in:
            <CodeBlock contentText={JSON.stringify(filterState, null, 2)} />
          </TabPanel>
          <TabPanel>
            <div className="codeDisplayBlock">
                The 'filter' object tells you the state of the board search & filter:
              <CodeBlock contentText={JSON.stringify(searchTerm, null, 2)} />
            </div>
          </TabPanel>
        </TabPanels>
      </TabsContext>
    </div>
  )
}

// @mondaycom-codesample-start
const monday = mondaySdk();

const ListenToBoardFilter = () => {
  const [eventsList, setEventsList] = useState([]);
  const [mostRecentEvent, setMostRecentEvent] = useState({})
  const [filterState, setFilterState] = useState();
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = async (evt) => {
    monday.execute('notice', {
        message: `Item IDs changed - ${evt.data.length} items to show`
    })
    setFilterState(evt);
  }

  const handleSearchChange = async (evt) => {
    monday.execute('notice', {
        message: `Search term changed – ${evt.data.term}`
    })
    setSearchTerm(evt);
  }

  const debouncedHandleSearchChange = _.debounce(handleSearchChange, 500);
  const debouncedHandleFilterChange = _.debounce(handleFilterChange, 500);


  useEffect(() => {
    const eventsListener = monday.listen('itemIds', debouncedHandleFilterChange);
    const contextListener = monday.listen('filter', debouncedHandleSearchChange)

    return () => {
      eventsListener();
      contextListener(); 
    }
  }, [])

  return (
    <div className="events-listen-container feature-container">
      {/* @mondaycom-codesample-skip-block-start */}
      <CodeBlock contentText={listenToBoardFilterConstants.codeSample} />
      <ActionHeader action={listenToBoardFilterConstants.actionTitle} actionDescription={listenToBoardFilterConstants.actionSubtitle} />
      <div className="events-listen-content working-with-the-board-items playground">
        <h3 className="playground-header">Playground</h3> 
        {/* @mondaycom-codesample-skip-block-end */}
        <TabComponent filterState={filterState} searchTerm={searchTerm}/>
      {/* @mondaycom-codesample-skip-block-start */}
      </div>
      <Instructions
        paragraphs={listenToBoardFilterConstants.instructionsParagraphs}
        instructionsListItems={listenToBoardFilterConstants.instructionsListItems}
        linkToDocumentation={listenToBoardFilterConstants.instructionslinkToDocumentation}
      />
      {/* @mondaycom-codesample-skip-block-end */}
    </div>
  );
}
// @mondaycom-codesample-end

export default ListenToBoardFilter;