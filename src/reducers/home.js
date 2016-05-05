'use strict';

export default (state, action) => {
  switch (action.type) {
    case 'HOME_PAGE_LOADED':
      state = Object.assign({}, state, {
        tags: action.payload[0].tags,
        articles: action.payload[1].articles,
        articlesCount: action.payload[1].articlesCount,
        currentPage: 0,
        tab: action.tab
      });
      break;
    case 'HOME_PAGE_UNLOADED':
      if (state.outstandingActions) {
        state.outstandingActions.forEach(promise => promise.cancel());
      }
      return Object.assign({}, state, {
        articles: null,
        tags: null,
        tab: null,
        articlesCount: null,
        currentPage: null,
        outstandingActions: null
      });
    case 'CHANGE_TAB':
      state = Object.assign({}, state, {
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        tab: action.tab,
        currentPage: 0,
        tag: null
      });
      break;
    case 'APPLY_TAG_FILTER':
      state = Object.assign({}, state, {
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        tab: null,
        tag: action.tag,
        currentPage: 0
      });
      break;
  }

  return state;
};
