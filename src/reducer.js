import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import article from './reducers/article';
import articleList from './reducers/articleList';
import auth from './reducers/auth';
import common from './reducers/common';
import profile from './reducers/profile';
import settings from './reducers/settings';
import tags from './features/tags/tagsSlice';

export default (history) =>
  combineReducers({
    article,
    articleList,
    auth,
    common,
    profile,
    settings,
    tags,
    router: connectRouter(history),
  });
