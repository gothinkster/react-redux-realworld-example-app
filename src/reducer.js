import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import article from "./reducers/article";
import articleList from "./reducers/articleList";
import auth from "./reducers/auth";
import common from "./reducers/common";
import editor from "./reducers/editor";
import home from "./reducers/home";
import profile from "./reducers/profile";
import settings from "./reducers/settings";

export default combineReducers({
  article,
  articleList,
  auth,
  common,
  editor,
  home,
  profile,
  settings,
  router: routerReducer,
});
