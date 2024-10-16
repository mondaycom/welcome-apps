import React, { useState, useEffect } from 'react'
import mondaySdk from 'monday-sdk-js'
// import ReactWordcloud from "react-wordcloud";
import { Text } from '@visx/text'
import { scaleLinear } from '@visx/scale'
import Wordcloud from '@visx/wordcloud/lib/Wordcloud'
import { AttentionBox } from 'monday-ui-react-core'
import 'monday-ui-react-core/dist/main.css'
import { stopWords } from './stop-words'
import _ from 'lodash'

const monday = mondaySdk()

function App() {
  // declare state variables
  const [settings, setSettings] = useState({})
  const [context, setContext] = useState({})
  const [boards, setBoards] = useState([])
  const [wordList, setWordList] = useState([])
  const [itemIds, setItemIds] = useState(false)
  const [hasNoBoards, setHasNoBoards] = useState(false)
  const [hasApiError, setHasApiError] = useState(false)

  // initialize listeners
  useEffect(() => {
    const settingsListener = monday.listen(
      'settings',
      debouncedHandleSettingsChange
    )
    const contextListener = monday.listen(
      'context',
      debouncedHandleContextChange
    )
    const itemIdsListener = monday.listen(
      'itemIds',
      debouncedHandleItemIdsChange
    )
    return () => {
      settingsListener() // unsubscribes to the listener
      contextListener()
      itemIdsListener()
    }
  }, [])

  const handleSettingsChange = (evt) => {
    setSettings(evt.data)
  }
  const debouncedHandleSettingsChange = _.debounce(handleSettingsChange, 500)

  const handleItemIdsChange = (evt) => {
    console.log('item IDs changed')
    const filteredItems = {}
    evt.data.forEach((id) => (filteredItems[id] = true))
    setItemIds(filteredItems)
  }
  const debouncedHandleItemIdsChange = _.debounce(handleItemIdsChange, 500)

  const handleContextChange = (evt) => {
    const context = evt.data
    console.log('context updated:', JSON.stringify(context))
    setContext(context)
  }
  const debouncedHandleContextChange = _.debounce(handleContextChange, 500)

  useEffect(
    function getBoardItems() {
      const boardIds = context.boardIds || [context.boardId]
      if (boardIds.length === 0) {
        setHasNoBoards(true)
      }
      else {
        monday
          .api(
            `
          query {
            boards(ids: [${boardIds}]) {
              id
              items_page (limit:300) {
                items {
                  id
                  name
                  column_values {
                    id
                    text
                  }
                }
              }
            }
          }
        `
          )
          .then((res) => {
            console.log(
              'Board items: ',
              res.data.boards[0].items_page.items
                .slice(0, 10)
                .map((item) => item.id)
            )
            setBoards(res.data.boards)
            setHasNoBoards(false)
            setHasApiError(false)
          })
          .catch((err) => {
            if (err.message === 'Graphql validation errors') {
              setHasApiError(true)
            }
          })
      }
    },
    [context, itemIds]
  )

  const maxWords = settings.maxWords ? parseInt(settings.maxWords) : 100

  const padding = settings.padding ? parseInt(settings.padding) : 10

  useEffect(() => {
    const text = getText()
    console.log('text:', text)
    const lines = text.split(/[,. ]+/g)

    var wordsMap = {}
    lines.forEach((word) => {
      word = word.toLowerCase().trim()
      if (!wordsMap[word]) wordsMap[word] = 0
      wordsMap[word] += 1
    })
    console.log(JSON.stringify({ wordsMap }))

    var words = []
    Object.keys(wordsMap).map((word) => {
      if (word && word.length > 2 && wordsMap[word] && !stopWords[word]) {
        words.push({ text: word, value: wordsMap[word] })
      }
      return word
    })
    console.log(JSON.stringify({ words }))
    const shortenedWordList = words.sort((a, b) => a.value - b.value).slice(0, maxWords);
    setWordList(shortenedWordList)
  }, [boards, settings]);

  const getText = () => {
    console.log(JSON.stringify({ msg: 'getting text', boards, itemIds }))
    const result = boards.map((board) => {
      return board.items_page.items
        .filter((item) => !itemIds || itemIds[item.id])
        .map((item) => {
          let columnIds, values
          if (settings.column) columnIds = Object.keys(settings.column)

          if (columnIds && columnIds.length > 0) {
            const columnValues = item.column_values.filter((cv) => {
              return columnIds.includes(cv.id)
            })
            values = columnValues
              .map((cv) => cv.text)
              .filter((t) => t && t.length > 0)
              .join(' ')

            if (columnIds.includes('name')) values += item.name
            return values
          } else {
            return item.name
          }
        })
    })
    console.log(JSON.stringify({ msg: 'text result:', result }))
    return _.flatten(result).join(' ')
  }

  const fontScale = scaleLinear({
    domain: [Math.min(...wordList.map((w) => w.value)), Math.max(...wordList.map((w) => w.value))],
    range: [16, 64],
  });
  const fontSizeSetter = (datum) => fontScale(datum.value);

  const rotations = [-60, -45, -30, 0, 30, 45, 60]
  const rotationSetter = () => rotations[Math.floor(Math.random() * rotations.length)]

  const ContentToRender = () => {
    if (hasNoBoards) {
      return (
        <AttentionBox
          title="No boards connected"
          text="Please connect a board to continue."
          type={AttentionBox.types.DANGER}
        />
      )
    }
    if (hasApiError) {
      return (
        <AttentionBox
          title="GraphQL API error"
          text="Please check the browser console for more details."
          type={AttentionBox.types.DANGER}
        />
      )
    }
    return (
      <>
        <Wordcloud
          words={wordList}
          width={500}
          height={500}
          fontSize={fontSizeSetter}
          font={'Roboto'}
          fontWeight={700}
          random={() => 0.5}
          rotate={rotationSetter}
          padding={padding}
        // options={{
        //   fontFamily: 'Roboto',
        //   fontSizes: [18, 36],
        //   fontWeight: 700,
        //   deterministic: true,
        //   colors: colors,
        //   padding: padding,
        //   spiral: "archimedean"
        // }}
        >
          {(cloudWords) => cloudWords.map((w, i) => {
            console.log(JSON.stringify(cloudWords));
            return (<Text
              fill={colors[i % colors.length]}
              key={i}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              // x={w.x}
              // y={w.y}
              fontSize={w.size}
              fontFamily={w.font}
              textAnchor={'middle'}
            >
              {w.text}
            </Text>)
          })
          }
        </Wordcloud>
      </>
    )
  }

  // render() {
  //   const ContentToRender = this.contentToRender;
  //   return (
  //     <div className="monday-app">
  //       <ContentToRender />
  //     </div>
  //   )
  // }

  return (
    <>
      <ContentToRender />
    </>
  )
}

/**
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {},
      context: {},
      boards: [],
      words: [],
      itemIds: false,
      hasNoBoards: false,
      hasApiError: false,
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
      .api(`
        query {
          boards(ids: [${boardIds}]) {
            id
            items_page {
              items {
                id
                name
                column_values {
                  id
                  text
                }
              }
            }
          }
        }
      `)
      .then((res) => {
        const noBoardsReturned = res.data.boards.length === 0;
        if (noBoardsReturned) {
          // no boards returned
          this.setState({ hasNoBoards : true })
        } else {
          this.setState({ boards: res.data.boards, hasNoBoards: false,  hasApiError: false }, () => {
            console.log(res.data.boards[0].items_page.items.slice(0, 10).map((item) => item.id));
            this.generateWords();
          });
        }
      })
      .catch((err) => {
        if (err.message === 'Graphql validation errors') {
          this.setState({ hasApiError : true });
        }
      });
  };

  generateWords = () => {
    const words = this.getWords();
    console.log("words", words);
    this.setState({ words });
  };

  getWords = () => {
    const text = this.getText();
    const lines = text.split(/[,. ]+/g);

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
      return word;
    });
    return words;
  };

  getText = () => {
    const { boards, settings, itemIds } = this.state;
    const result = boards.map((board) => {
      return board.items_page.items
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

  contentToRender = () => {
    const { words, hasNoBoards,  hasApiError } = this.state;
    if (hasNoBoards) {
      return (
          <AttentionBox 
            title="No boards connected" 
            text="Please connect a board to continue." 
            type={AttentionBox.types.DANGER}
          />
      )
    }
    if (hasApiError) {
      return (
          <AttentionBox 
            title="GraphQL API error" 
            text="Please check the browser console for more details." 
            type={AttentionBox.types.DANGER}
          />
      )
    }
    return (
        <Wordcloud
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
        >
          {(wordsToShow) => wordsToShow.map((word) => {
            <Text>{word.text}</Text>
          })}
        </Wordcloud>
    );
  }

  render() {
    const ContentToRender = this.contentToRender;
    return (
      <div className="monday-app">
        <ContentToRender />
      </div>
    )
  }
}
   */

export default App

const colors = [
  '#fdab3d',
  '#00c875',
  '#e2445c',
  '#0086c0',
  '#579bfc',
  '#a25ddc',
  '#037f4c',
  '#CAB641',
  '#FFCB00',
  '#BB3354',
  '#FF158A',
  '#FF5AC4',
  '#784BD1',
  '#9CD326',
  '#66CCFF',
  '#7F5347',
  '#FF642E',
]
