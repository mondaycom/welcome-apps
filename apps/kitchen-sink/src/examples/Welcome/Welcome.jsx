import React from "react";
import "monday-ui-react-core/dist/main.css";
import "./Welcome.scss";
import Lottie from "react-lottie";
import { lottieOptions, buttonStyle } from "./WelcomeConstants";
import Button from "monday-ui-react-core/dist/Button";
import { useNavigate } from "react-router";

const Welcome = () => {
  const history = useNavigate();

  return (
    <div className="container">
      <div className="content">
        <div className="row">
          <div className="textContainer">
            <img className="logo" src={require("../../assets/images/logo.png")} alt="" />
            <div className="title">
              monday app framework
              <br />
              Kitchen Sink Examples
            </div>
            <div className="subTitle">
              In this project you will see examples
              <br />
              of the main functionality of our SDK and API.
            </div>
            <Button style={buttonStyle} size={Button.sizes.LARGE} onClick={() => history("/menu")}>
              Get Started
            </Button>
          </div>
          <Lottie className="lottie" options={lottieOptions} height={500} width={500} />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
