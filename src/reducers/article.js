'use strict';

export default (state, action) => {
  switch (action.type) {
    case 'ARTICLE_PAGE_LOADED':
      return {
        ...state,
        article: action.payload[0].article,
        comments: action.payload[1].comments
      };
      break;
    case 'DELETE_ARTICLE':
      return { ...state, redirectTo: '/' };
    case 'ARTICLE_PAGE_UNLOADED':
      return {
        ...state,
        article: null,
        comments: null,
        commentErrors: null,
        outstandingActions: null,
        viewChangeCounter: state.viewChangeCounter + 1
      };
  }

  return state;
};
