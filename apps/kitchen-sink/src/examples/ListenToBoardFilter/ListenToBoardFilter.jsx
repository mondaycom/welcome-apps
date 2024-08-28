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
import {Bullets, Filter} from "monday-ui-react-core/icons"
import { useAppContext } from "../../hooks/UseAppContext"
import _ from "lodash";

const listenToBoardFilterConstants = {
  actionTitle: 'Listen to board filter',
  actionSubtitle: `Use the SDK to see what items the user has filtered.`,
  instructionsParagraphs: [
    `You can use 'monday.listen' to listen for changes to 'itemIds' and 'filter'.`,
    `The 'itemIds' listener will return a list of which items are included in the list. You can use this to quickly filter items in your app without needing to parse filter rules.`,
    `The 'filter' listener will return the current values of the search bar and board filter.`,
    `Remember to debounce your actions on these listeners, as they can emit a lot of events quickly.`,
  ],
  instructionslinkToDocumentation: `https://developer.monday.com/apps/docs/mondaylisten#retrieve-the-search-query-in-your-app`,
  instructionsListItems: [
    `Type something in the search bar above the board view, and/or use the board filter.`,
    `Open the Item IDs tab to see data returned by the 'itemIds' listener.`,
    `Open the Filter tab to see the data returned by the 'filter' listener.`,
  ],
  githubUrl: "Confirmation/Confirmation.jsx",
  codeSample: CodeSamples.ListenToBoardFilter.codeSample,
};

const TabComponent = ({ filterState, searchTerm }) => {
  return (
    <div className="tabsWrapper">
      <TabsContext>
        <TabList className="tabListWrapper">
          <Tab className="tabWrapper" icon={Bullets}>Item IDs</Tab>
          <Tab className="tabWrapper" icon={Filter}>Filter</Tab>
        </TabList>
        <TabPanels animationDirection={TabPanels.animationDirections.LTR} className="tabPanelContainer">
          <TabPanel className="codeDisplayBlock">
            <CodeBlock contentText={JSON.stringify(filterState, null, 2)} />
          </TabPanel>
          <TabPanel>
            <div className="codeDisplayBlock">
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