import React from "react";
import "./code-viewer-component.scss";

export default class CodeViewerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.iframeRef = React.createRef();
  }

  componentDidMount() {
    this.renderCode();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedExample != this.props.selectedExample) {
      this.renderCode();
    }
  }

  renderCode() {
    const { selectedExample } = this.props;
    const url = selectedExample?.sourceUrl;
    if (!url) return;
    this.iframeRef.current.contentDocument.write(
      `<script src="https://emgithub.com/embed.js?target=${url}&style=github-gist&showBorder=on&showLineNumbers=on"></script>`
    );
  }

  render() {
    return (
      <div className="code-viewer-component">
        <iframe key={Math.random().toString()} ref={this.iframeRef}></iframe>
      </div>
    );
  }
}
