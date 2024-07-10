import React, { useEffect, useState } from "react";
import MenuButton from "./components/MenuButton";
import "./Menu.scss";
import { menuOptions } from "./MenuConstants";
import { useNavigate } from "react-router-dom";
import {useAppContext} from "../../hooks/UseAppContext";
import { Divider, ListItem, ListTitle, List } from "monday-ui-react-core";

const Menu = () => {
  const history = useNavigate();
  const appContext = useAppContext();
  const [featureType, setFeatureType] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function updateFeatureType() {
    if (appContext.data) {
      setFeatureType(appContext.data.appFeature.type);
      setIsLoading(false);
    }
  }, [appContext])

  const renderSection = (name, subOptions) => {
    return (
      <div key={name} className="sectionContainer">
        <div className="title">{name}</div>
        <div className="subItemsContainer">
          {subOptions.map(({ image, background, name, location }) => (
            <MenuButton
              key={location}
              image={image}
              background={background}
              title={name}
              onPress={() => history(location)}
            />
          ))}
        </div>
      </div>
    );
  };
  const renderHero = () => {
    return (
      <div className="heroContainer">
        <div className="textContainer">
          <div className="title">Get started with ready-made examples</div>
          <div className="subTitle">
            The monday.com examples Kitchen Sink offers a variety of examples
            <br /> that you can test on a board, item, or workspace. 
          </div>
        </div>
        <img alt="" src={require("./assets/hero_image.png")} className="heroImage" />
      </div>
    );
  };

  const renderMenuForActionFeature = (menuOptions) => {
    console.log({menuOptions});
    return (
      <div>
        {menuOptions.map((section) => {
          return (<List className="menuList">
          <ListTitle>{section.name}</ListTitle>
          <div>{section.subOptions.map((option) => {
            return <ListItem onClick={() => history(option.location)}>{option.name}</ListItem>
          })}</div><Divider /></List>
        )
        })}
      </div>
    );
  };

  return (
    (isLoading) ? <div></div> :
    (featureType === "AppFeatureItemMenuAction" || featureType === "AppFeatureAiBoardMainMenuHeader") ?
      <div>{renderMenuForActionFeature(menuOptions)}</div> 
      :
    <div className="menuContainer">
      {renderHero()}
      {menuOptions.map((section) => renderSection(section.name, section.subOptions))}
      <img className="logo" src={require("../../assets/images/logo.png")} alt="" />
    </div>
  );
};

export default Menu;
