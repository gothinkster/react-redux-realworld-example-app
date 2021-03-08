import App from "./components/App";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import React from "react";
import { createStore } from "redux";
import { promiseMiddleware } from "./middleware";

const deaultState = {
  appName: "Boof-xyz",
  articles: null,
};
const reducer = function (state = defaultState, action) {
  switch (action.type) {
    case "HOME_PAGE_LOADED":
      return { ...state, articles: action.payload.articles };
  }
  return state;
};

const store = createStore(reducer, applyMiddleware(promiseMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
