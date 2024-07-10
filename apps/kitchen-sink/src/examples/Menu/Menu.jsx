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
  const [visibleOptions, setVisibleOptions] = useState([]);

  useEffect(function updateFeatureType() {
    if (appContext.data) {
      setFeatureType(appContext.data.appFeature.type);
      setIsLoading(false);
    }
  }, [appContext])

  useEffect(function hideUnsupportedExamples() {
    if (featureType) {
      const options = menuOptions.map((section) => {
        // const filteredOptions = section.subOptions.filter(option => option?.disableFor.includes(featureType))
        console.log({section});
        const filteredOptions = section.subOptions.filter((option) => {
          if (option.disableFor) {
            if (!option.disableFor.includes(featureType)) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        })
        return {name: section.name, subOptions: filteredOptions};
      })
      setVisibleOptions(options)
      console.log({options});
    }
  }, [featureType])

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
            The monday.com Kitchen Sink app shows a variety of examples
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
      <div>{renderMenuForActionFeature(visibleOptions)}</div> 
      :
    <div className="menuContainer">
      {renderHero()}
      {visibleOptions.map((section) => renderSection(section.name, section.subOptions))}
      <img className="logo" src={require("../../assets/images/logo.png")} alt="" />
    </div>
  );
};

export default Menu;
