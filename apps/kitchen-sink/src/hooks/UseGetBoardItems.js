import { useState, useEffect } from "react";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

export function useGetBoardItems(boardId) {
    function getBoardItems(boardId) {
        return monday.api(`{
            boards(ids:${boardId}) {
              id
              items_page (limit:5) {
                items {
                  id
                  name
                }
              }
            }
          }`).then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log('error in use get board items.')
            console.log(err);
          });
      }
    const { boardItemsData, setBoardItemsData } = useState({});

    useEffect(() => {
        getBoardItems(boardId)
            .then((res) => {
                console.log(res);
                setBoardItemsData({ 
                    items: res.data.boards[0].items_page.items,
                    boardId
                  })
            });
    }, [boardId, setBoardItemsData])
    
    return boardItemsData;
}