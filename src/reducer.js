'use strict';

import article from './reducers/article';
import articleList from './reducers/articleList';
import auth from './reducers/auth';
import { combineReducers } from 'redux';
import comment from './reducers/comment';
import common from './reducers/common';
import editor from './reducers/editor';
import home from './reducers/home';
import profile from './reducers/profile';
import profileFavorites from './reducers/profileFavorites';
import settings from './reducers/settings';

const defaultState = {
  appName: 'Conduit',
  token: null,
  viewChangeCounter: 0
};

export default (state = defaultState, action) => {
  state = article(state, action);
  state = articleList(state, action);
  state = auth(state, action);
  state = comment(state, action);
  state = common(state, action);
  state = editor(state, action);
  state = home(state, action);
  state = profile(state, action);
  state = profileFavorites(state, action);
  state = settings(state, action);

  return state;
};
