import React from "react";
import CodeBlock from "../CodeBlock/CodeBlock";
import classes from "./TabLayout.module.scss";

import {
  Tab,
  TabList,
  TabsContext,
  TabPanel,
  TabPanels,
} from "monday-ui-react-core";
// import { codeExamples } from "../../constants/code-examples";

const TabLayout = ({ExampleComponent, codeExample, documentationText}) => {

  return (
    <div className={classes.tabsWrapper}>
      <TabsContext>
        <TabList size="sm">
          <Tab className={classes.tabWrapper}>App Preview</Tab>
          <Tab className={classes.tabWrapper}>Code Sample</Tab>
          <Tab className={classes.tabWrapper}>Documentation</Tab>
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
          <TabPanel>
            {documentationText}
          </TabPanel>
        </TabPanels>
      </TabsContext>
    </div>
  );
};

export default TabLayout;
