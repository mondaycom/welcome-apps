import React from "react";
import classes from "./TabLayout.module.scss";
import { CodeBlock, nord } from "react-code-blocks";
import {
  Tab,
  TabList,
  TabsContext,
  TabPanel,
  TabPanels,
} from "monday-ui-react-core";
// import { codeExamples } from "../../constants/code-examples";

const TabLayout = ({ExampleComponent, codeExample}) => {

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
              <CodeBlock
                text={codeExample}
                theme={nord}
                showLineNumbers={true}
                language="jsx"
              />
            </div>
          </TabPanel>
          <TabPanel>
            This is some documentation blah blah blah
          </TabPanel>
        </TabPanels>
      </TabsContext>
    </div>
  );
};

export default TabLayout;
