import React from "react";
import CodeBlock from "../CodeBlock/CodeBlock";
import classes from "./TabLayout.module.scss";

import {
  Tab,
  TabList,
  TabsContext,
  TabPanel,
  TabPanels
} from "monday-ui-react-core";
// import { codeExamples } from "../../constants/code-examples";

const TabLayout = ({ExampleComponent, codeExample, documentationText}) => {

  return (
    <div className={classes.tabsWrapper}>
      <TabsContext>
        <TabList className={classes.tabListWrapper}>
          <Tab className={classes.tabWrapper}>Playground</Tab>
          <Tab className={classes.tabWrapper}>Code</Tab>
        </TabList>
        <TabPanels animationDirection={TabPanels.animationDirections.LTR} className={classes.tabPanelContainer}>
          <TabPanel className="monday-storybook-tabs_bg-color">
            <div className={classes.appTabContent}>
              <ExampleComponent />
            </div>
          </TabPanel>
          <TabPanel>
            <div className={classes.codeDisplayBlock}>
            <CodeBlock contentText={codeExample} />
            </div>
          </TabPanel>
        </TabPanels>
      </TabsContext>
    </div>
  );
};

export default TabLayout;
