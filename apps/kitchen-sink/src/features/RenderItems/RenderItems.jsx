import React, { useState, useEffect } from "react";
import "monday-ui-react-core/dist/main.css";
import "./RenderItems.scss";
import Item from "../../components/common/Item/Item";
import randomColorGenerator from "../../utils/randomColorGenerator";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

const RenderItems = ({ itemsData, action, actionButtonContent, customComponent }) => {
  const [activeCard, setActiveCard] = useState();

  useEffect(() => {
    monday.execute("notice", {
      message: "Please note that every action you take in the playground affects the real board",
      type: "info",
      timeout: 5000,
    });
  }, []);

  return (
    <div className="working-with-the-board-items playground">
      <h3 className="playground-header">Playground</h3>
      {customComponent}
      {itemsData.map((item, index) => {
        return (
          <Item
            key={item.id}
            item={item}
            action={action}
            actionButtonContent={actionButtonContent}
            backgroundColor={randomColorGenerator()}
            isActive={activeCard === index}
            index={index}
            setActiveCard={setActiveCard}
          />
        );
      })}
    </div>
  );
};

export default RenderItems;
