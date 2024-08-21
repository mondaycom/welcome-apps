import React, { useState, useEffect } from "react";
import './ListenToEvents.scss';

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
  Button
} from "monday-ui-react-core";
import { useAppContext } from "../../hooks/UseAppContext"

const listenToEventsConstants = {
  actionTitle: 'Listen to board events',
  actionSubtitle: `Use the SDK to listen to updates to the connected board.`,
  confirmationInstructionsParagraphs: [`Executes callback function when new event is emitted.`],
  confirmationInstructionslinkToDocumentation: `https://developer.monday.com/apps/docs/mondaylisten#subscribe-to-interaction-based-events-on-the-board`,
  confirmationInstructionsListItems: [
    `Click the button to open this board in another tab.`,
    `Make changes to the board – create items, update columns, etc.`,
    `Check the Playground to see what data these events emit.`,
  ],
  githubUrl: "Confirmation/Confirmation.jsx",
  codeSample: CodeSamples.ListenToEvents.codeSample,
};

const TabComponent = ({ eventsList, mostRecentEvent, url, buttonIsLoading }) => {
  const handleButtonClick = async () => {
    const success = await monday.execute('openLinkInTab', {
      url
    })
  }

  return (
    <div className="tabsWrapper">
      <Button size={Button.sizes.XXS} kind={Button.kinds.SECONDARY} onClick={handleButtonClick} loading={buttonIsLoading}>Open board</Button>
      <TabsContext>
        <TabList className="tabListWrapper">
          <Tab className="tabWrapper">All events</Tab>
          <Tab className="tabWrapper">Most recent event</Tab>
        </TabList>
        <TabPanels animationDirection={TabPanels.animationDirections.LTR} className="tabPanelContainer">
          <TabPanel className="codeDisplayBlock">
            <CodeBlock contentText={JSON.stringify(eventsList, null, 2)} />
          </TabPanel>
          <TabPanel>
            <div className="codeDisplayBlock">
              <CodeBlock contentText={JSON.stringify(mostRecentEvent, null, 2)} />
            </div>
          </TabPanel>
        </TabPanels>
      </TabsContext>
    </div>
  )
}

// @mondaycom-codesample-start
const monday = mondaySdk();

const ListenToEvents = () => {
  const [eventsList, setEventsList] = useState([]);
  const [mostRecentEvent, setMostRecentEvent] = useState({})
  const [boardUrl, setBoardUrl] = useState('');

  const handleNewEvent = async (evt) => {
    monday.execute("notice", {
      message: `A new event happened! Type: ${evt.data.type}`
    })
    setEventsList([...eventsList, evt.data]);
    setMostRecentEvent(evt.data);
  }

  const handleContextUpdate = async (context) => {
    const boardIds = context?.data?.boardIds;
    const accountInfoQuery = await monday.api(`{ account { slug } }`);
    const slug = accountInfoQuery?.data?.account?.slug;
    if (!boardIds || !slug) {
      setBoardUrl('https://monday.com');
    }
    setBoardUrl(`https://${slug}.monday.com/boards/${boardIds[0]}`);
  }

  useEffect(() => {
    const eventsListener = monday.listen('events', handleNewEvent);
    const contextListener = monday.listen('context', handleContextUpdate)

    return () => {
      eventsListener();
      contextListener();
    }
  })

  return (
    <div className="events-listen-container feature-container">
      {/* @mondaycom-codesample-skip-block-start */}
      <CodeBlock contentText={listenToEventsConstants.codeSample} />
      <ActionHeader action={listenToEventsConstants.actionTitle} actionDescription={listenToEventsConstants.actionSubtitle} />
      <div className="events-listen-content working-with-the-board-items playground">
        <h3 className="playground-header">Playground</h3> 
        {/* @mondaycom-codesample-skip-block-end */}
        <TabComponent eventsList={eventsList} mostRecentEvent={mostRecentEvent} url={boardUrl} buttonIsLoading={!boardUrl}/>
      {/* @mondaycom-codesample-skip-block-start */}
      </div>
      <Instructions
        paragraphs={listenToEventsConstants.confirmationInstructionsParagraphs}
        instructionsListItems={listenToEventsConstants.confirmationInstructionsListItems}
        linkToDocumentation={listenToEventsConstants.confirmationInstructionslinkToDocumentation}
      />
      {/* @mondaycom-codesample-skip-block-end */}
    </div>
  );
}
// @mondaycom-codesample-end

export default ListenToEvents;