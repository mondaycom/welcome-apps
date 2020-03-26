import React from "react";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    monday.listen("itemIds", this.getItemIds);
  }

  getItemIds = res => {
    const itemIds = res.data;

    monday
    .api(
      `query {
        items(ids: [${itemIds}]) { name, id }
      }`
    )
    .then(res => {
      this.setState({ items: res.data.items });
    });
  };

  render() {
    const { items } = this.state;
    return (
      <div className="monday-app">
        <div className="description">
          This is an example of how to use filtered items
        </div>
        <div className="items">
          {items && items.map( (item, key) => (
            <div className="item" key={key}>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
