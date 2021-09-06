import React, { useState, useEffect, useContext, useRef } from "react";
import "monday-ui-react-core/dist/main.css";
import "./StorageApi.scss";
import mondaySdk from "monday-sdk-js";
import { Context } from "../../components/context/ContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import storageApiConstants from "./StorageApiConstants";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import randomColorGenerator from "../../utils/randomColorGenerator";

const monday = mondaySdk();

const StorageApi = () => {
  const { items } = useContext(Context);
  const [favouriteItems, setFavouriteItems] = useState([]);

  useEffect(() => {
    monday.storage.instance.getItem("FAVOURITE_ITEMS").then((res) => {
      if (!res.data.value || !res.data.success) {
        monday.storage.instance.setItem("FAVOURITE_ITEMS", JSON.stringify([]));
        return;
      } else {
        setFavouriteItems(JSON.parse(res.data.value));
      }
    });

    monday.execute("notice", {
      message: "Click on the heart icon to mark item as favourite or to remove one",
      type: "info",
      timeout: 10000,
    });
  }, []);

  const changeItemFavouriteState = (itemId, desiredFavouriteState) => {
    let updatedFavourites = [...favouriteItems];
    if (desiredFavouriteState) {
      if (!favouriteItems.includes(+itemId)) {
        updatedFavourites.push(+itemId);
      }
    } else {
      updatedFavourites = updatedFavourites.filter((favouriteItemId) => {
        return favouriteItemId !== +itemId;
      });
    }
    monday.storage.instance.setItem("FAVOURITE_ITEMS", JSON.stringify(updatedFavourites)).then((res) => {
      if (res.data.success) {
        setFavouriteItems(updatedFavourites);
      }
    });
  };

  return (
    <div className="storage-api-container feature-container">
      <ActionHeader
        action="Storage API"
        actionDescription="Using the SDK to use the Storage API for upload key-value pairs"
      />

      <div className="working-with-the-board-items playground">
        <h3 className="playground-header">Playground</h3>
        {items.map((item) => {
          const isFavourite = favouriteItems.includes(+item.id);
          return (
            <Item
              key={item.id}
              item={item}
              action={() => changeItemFavouriteState(item.id, !isFavourite)}
              isFavourite={isFavourite}
              backgroundColor={randomColorGenerator()}
            />
          );
        })}
      </div>
      <CodeBlock contentUrl={storageApiConstants.githubUrl} />
      <Instructions
        paragraphs={storageApiConstants.storageApiInstructionsParagraphs}
        instructionsListItems={storageApiConstants.storageApiInstructionsListItems}
        linkToDocumentation={storageApiConstants.storageApiInstructionslinkToDocumentation}
      />
    </div>
  );
};

export default StorageApi;

const Item = ({ item, action, isFavourite, backgroundColor }) => {
  const initialRandomColor = useRef(backgroundColor);
  return (
    <div className="working-with-the-board-item">
      <div className="rect" style={{ backgroundColor: `rgb${initialRandomColor.current}` }}></div>
      <span className="item-name ellipsis">{item.name}</span>
      <FontAwesomeIcon className="heart-icon" icon={isFavourite ? fasHeart : farHeart} onClick={() => action()} />
      <div className="circle"></div>
    </div>
  );
};
