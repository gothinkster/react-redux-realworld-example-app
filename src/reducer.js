import article from './reducers/article';
import articleList from './reducers/articleList';
import auth from './reducers/auth';
import { combineReducers } from 'redux';
import common from './reducers/common';
import home from './reducers/home';
import profile from './reducers/profile';
import settings from './reducers/settings';
import { connectRouter } from 'connected-react-router';

export default (history) => combineReducers({
  article,
  articleList,
  auth,
  common,
  home,
  profile,
  settings,
  router: connectRouter(history)
});
