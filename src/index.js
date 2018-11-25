//@flow
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app";
import "./styles/index.scss";

const element = document.getElementById("root");
if (element) {
    ReactDOM.render(<App/>, element);
}
