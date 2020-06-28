import React from "react";
import "./App.scss";

import HeaderComponent from "./header/header-component";
import MenuComponent from "./menu/menu-component";
import CodeViewerComponent from "./code-viewer/code-viewer-component";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedExample: null, selectedTab: "preview" };
  }

  onSelectExample = (example) => {
    this.setState({ selectedExample: example });
  };

  onSelectTab = (tab) => {
    this.setState({ selectedTab: tab });
  };

  getContentComponent() {
    const { selectedExample, selectedTab } = this.state;
    if (selectedTab == "code") return CodeViewerComponent;
    return selectedExample?.component || false;
  }

  render() {
    const { selectedExample, selectedTab } = this.state;
    const ContentComponent = this.getContentComponent();
    return (
      <div className="App">
        <div className="app-inner">
          <div className="header">
            <HeaderComponent
              selectedTab={selectedTab}
              onSelect={this.onSelectTab}
            />
          </div>
          <div className="content-wrapper">
            <div className="menu">
              <MenuComponent
                selectedExample={selectedExample}
                onSelect={this.onSelectExample}
              />
            </div>
            <div className="content">
              {ContentComponent && (
                <ContentComponent selectedExample={selectedExample} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
