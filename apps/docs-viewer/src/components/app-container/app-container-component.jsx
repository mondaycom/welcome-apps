import React from "react";
import "./app-container-component.scss";
import NavgiationComponent from "../navigation/navigation-component";
import ViewerComponent from "../viewer/viewer-component";
import { getDocs, removeDoc } from "../../services/docs-service";
import { bigBrainTrack, BIGBRAIN_KINDS } from "../../services/bigbrain-service";

export default class AppContianerComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { docs: [], filteredDocs: [], selectedItem: null, searchTerm: "" };
  }

  async componentDidMount() {
    await this.fetchDocs();
  }

  fetchDocs = async () => {
    const { selectedItem, searchTerm } = this.state;
    const docs = await getDocs();
    const filteredDocs = await getDocs(searchTerm);
    const newSelectedItem = selectedItem || docs.length > 0 ? docs[0] : null;
    this.setState({ docs, filteredDocs, selectedItem: newSelectedItem });
  };

  onFilterTermChange = (searchTerm) => {
    this.setState({ searchTerm }, async () => {
      await this.fetchDocs();
    });
  };

  onClick = (item) => {
    bigBrainTrack(BIGBRAIN_KINDS.FILE_CLICKED, { id: item.id, name: item.name, url: item.url });
    this.setState({ selectedItem: item });
  };

  onAfterItemAdded = async () => {
    await this.fetchDocs();
  };

  onRemoveItemClick = async (item) => {
    const { selectedItem } = this.state;
    const docs = await removeDoc(item);

    const newState = { docs };
    if (item.id === selectedItem.id) newState.selectedItem = docs.length > 0 ? docs[0] : null;

    this.setState(newState);
  };

  render() {
    const { docs, filteredDocs, selectedItem, searchTerm } = this.state;
    const selectedItemId = selectedItem ? selectedItem.id : -1;

    return (
      <div className="app-container-component">
        <ViewerComponent item={selectedItem} onAfterItemAdded={this.onAfterItemAdded} />
        <NavgiationComponent
          selectedItemId={selectedItemId}
          docs={docs}
          filteredDocs={filteredDocs}
          onClick={this.onClick}
          onRemoveItemClick={this.onRemoveItemClick}
          onAfterItemAdded={this.onAfterItemAdded}
          onFilterTermChange={this.onFilterTermChange}
          searchTerm={searchTerm}
        />
      </div>
    );
  }
}
