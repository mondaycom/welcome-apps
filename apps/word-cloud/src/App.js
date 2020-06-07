import React, { useState, useEffect } from "react";
import mondaySdk from "monday-sdk-js";
import ReactWordcloud from "react-wordcloud";
import { stopWords } from "./stop-words";
import _ from "lodash";

const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {},
      context: {},
      boards: [],
      words: [],
      itemIds: false
    };
  }

  componentDidMount() {
    monday.listen("settings", this.getSettings);
    monday.listen("context", this.getContext);
    monday.listen("itemIds", this.getItemIds);
  }

  getSettings = (res) => {
    this.setState({ settings: res.data });
    console.log("settings!", res.data);
    this.generateWords();
  };

  getItemIds = (res) => {
    const itemIds = {};
    res.data.forEach((id) => (itemIds[id] = true));
    this.setState({ itemIds: itemIds });
    this.generateWords();
  };

  getContext = (res) => {
    const context = res.data;
    console.log("context!", context);
    this.setState({ context });

    const boardIds = context.boardIds || [context.boardId];
    monday
      .api(`query { boards(ids:[${boardIds}]) { id, items { id, name, column_values { id, text } } }}`)
      .then((res) => {
        this.setState({ boards: res.data.boards }, () => {
          console.log(res.data.boards[0].items.slice(0, 10).map((item) => item.id));
          this.generateWords();
        });
      });
  };

  generateWords = () => {
    const words = this.getWords();
    console.log("words", words);
    this.setState({ words });
  };

  getWords = () => {
    const text = this.getText();
    const lines = text.split(/[,\. ]+/g);

    const wordsMap = {};
    lines.forEach((word) => {
      word = word.toLowerCase().trim();
      if (!wordsMap[word]) wordsMap[word] = 0;
      wordsMap[word] += 1;
    });

    const words = [];
    Object.keys(wordsMap).map((word) => {
      if (word && word.length > 2 && wordsMap[word] && !stopWords[word]) {
        words.push({ text: word, value: wordsMap[word] });
      }
    });
    return words;
  };

  getText = () => {
    const { boards, settings, itemIds } = this.state;
    const result = boards.map((board) => {
      return board.items
        .filter((item) => !itemIds || itemIds[item.id])
        .map((item) => {
          let columnIds, values;
          if (settings.column) columnIds = Object.keys(settings.column);

          if (columnIds && columnIds.length > 0) {
            const columnValues = item.column_values.filter((cv) => {
              return columnIds.includes(cv.id);
            });
            values = columnValues
              .map((cv) => cv.text)
              .filter((t) => t && t.length > 0)
              .join(" ");

            if (columnIds.includes("name")) values += item.name;
            return values;
          } else {
            return item.name;
          }
        });
    });
    return _.flatten(result).join(" ");
  };

  maxWords = () => {
    const { settings } = this.state;
    return settings.maxWords ? parseInt(settings.maxWords) : 100;
  };

  padding = () => {
    const { settings } = this.state;
    return settings.padding ? parseInt(settings.padding) : 10;
  };

  render() {
    const { settings, context, words } = this.state;
    return (
      <div className="monday-app">
        <ReactWordcloud
          words={words}
          maxWords={this.maxWords()}
          options={{
            fontFamily: "Roboto",
            fontSizes: [18, 36],
            fontWeight: 700,
            deterministic: true,
            colors: colors,
            padding: this.padding()
            // spiral: "archimedean"
          }}
        />
      </div>
    );
  }
}

export default App;

const colors = [
  "#fdab3d",
  "#00c875",
  "#e2445c",
  "#0086c0",
  "#579bfc",
  "#a25ddc",
  "#037f4c",
  "#CAB641",
  "#FFCB00",
  "#BB3354",
  "#FF158A",
  "#FF5AC4",
  "#784BD1",
  "#9CD326",
  "#66CCFF",
  "#7F5347",
  "#FF642E"
];
