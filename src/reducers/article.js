'use strict';

export default (state, action) => {
  switch (action.type) {
    case 'ARTICLE_PAGE_LOADED':
      state = Object.assign({}, state, {
        article: action.payload[0].article,
        comments: action.payload[1].comments
      });
      break;
    case 'DELETE_ARTICLE':
      state = Object.assign({}, state, { redirectTo: '/' });
      break;
    case 'ARTICLE_PAGE_UNLOADED':
      if (state.outstandingActions) {
        state.outstandingActions.forEach(promise => promise.cancel());
      }
      return Object.assign({}, state, {
        article: null,
        comments: null,
        commentErrors: null,
        outstandingActions: null
      });
  }

  return state;
};
