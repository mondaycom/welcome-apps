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

const listenToEventsConstants = {
  actionTitle: 'Listen to board events',
  actionSubtitle: `Use the SDK to listen to changes on the connected board.`,
  instructionsParagraphs: [
    `The monday.listen('events', callback) function executes the callback function when a new event is emitted.`,
    `Events are emitted when the connected board is updated; for example, when items are created or values are changed.`,
    `Your app will get notified only while it is open and subscribed. The listener will stop when the app is closed.`,
  ],
  instructionslinkToDocumentation: `https://developer.monday.com/apps/docs/mondaylisten#subscribe-to-interaction-based-events-on-the-board`,
  instructionsListItems: [
    `Click "Open Board" to open this board in another tab.`,
    `Make changes to the open board: create items, update columns, etc.`,
    `Check the Playground to see the data contained in each of the events.`,
    `You can browse the all events emitted, or only the latest one.`,
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
      <Button className="openBoardButton" size={Button.sizes.S} kind={Button.kinds.PRIMARY} onClick={handleButtonClick} loading={buttonIsLoading}>Open board</Button>
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
    const boardIds = context?.data?.boardIds ?? [context?.data?.boardId];
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
        paragraphs={listenToEventsConstants.instructionsParagraphs}
        instructionsListItems={listenToEventsConstants.instructionsListItems}
        linkToDocumentation={listenToEventsConstants.instructionslinkToDocumentation}
      />
      {/* @mondaycom-codesample-skip-block-end */}
    </div>
  );
}
// @mondaycom-codesample-end

export default ListenToEvents;