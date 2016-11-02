import { applyMiddleware, createStore } from 'redux';
import { promiseMiddleware } from './middleware';

const defaultState = {
  appName: 'conduit',
  articles: null
};
const reducer = function(state = defaultState, action) {
  switch (action.type) {
    case 'HOME_PAGE_LOADED':
      return { ...state, articles: action.payload.articles };
  }
  return state;
};

const middleware = applyMiddleware(promiseMiddleware);

const store = createStore(reducer, middleware);

export default store;
