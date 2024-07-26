import React, { useEffect, useState } from "react";
import "monday-ui-react-core/dist/main.css";
import "./Welcome.scss";
import Lottie from "react-lottie-player";

import { lottieOptions, buttonStyle } from "./WelcomeConstants";
import Button from "monday-ui-react-core/dist/Button";
import { useNavigate } from "react-router";
import { useAppContext } from "../../hooks/UseAppContext";

const Welcome = () => {
  const history = useNavigate();
  const appContext = useAppContext();
  const [appFeatureType, setAppFeatureType] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    function updateAppFeatureType() {
      if (appContext.data) {
        setAppFeatureType(appContext.data.appFeature.type);
      }
    },
    [appContext]
  );

  useEffect(
    function redirectInActionFeatureType() {
      if (
        appFeatureType &&
        (appFeatureType === "AppFeatureItemMenuAction" ||
          appFeatureType === "AppFeatureAiBoardMainMenuHeader")
      ) {
        history("/menu");
      } else {
        setIsLoading(false);
      }
    },
    [appFeatureType, history]
  );

  return isLoading ? (
    <div></div>
  ) : (
    <div className="container">
      <div className="content">
        <div className="row">
          <div className="textContainer">
            <img
              className="logo"
              src={require("../../assets/images/logo.png")}
              alt=""
            />
            <div className="title">
              monday app framework
              <br />
              Kitchen Sink
            </div>
            <div className="subTitle">
              In this project you will see working examples
              <br />
              of the main features of our SDK and API.
            </div>
            <Button
              style={buttonStyle}
              size={Button.sizes.LARGE}
              onClick={() => history("/menu")}
            >
              Get Started
            </Button>
          </div>
          <div className="imageContainer">
            <Lottie
              className="lottie"
              animationData={lottieOptions.animationData}
              play
              loop
              rendererSettings={lottieOptions.rendererSettings}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
