import React from "react";
import "./code-viewer-component.scss";

export default class CodeViewerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.iframeRef = React.createRef();
  }

  componentDidMount() {
    const url =
      "https://github.com/mondaycom/welcome-apps/blob/master/apps/docs-viewer/src/App.js";
    this.iframeRef.current.contentDocument.write(
      `<script src="https://emgithub.com/embed.js?target=${url}&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on"></script>`
    );
  }

  render() {
    return (
      <div className="code-viewer-component">
        <iframe ref={this.iframeRef}></iframe>
      </div>
    );
  }
}
