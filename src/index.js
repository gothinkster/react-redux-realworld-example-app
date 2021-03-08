import App from "./components/App";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import React from "react";
import store from "./store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
