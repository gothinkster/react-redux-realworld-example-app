'use strict';

export default (state, action) => {
  switch (action.type) {
    case 'HOME_PAGE_LOADED':
      return {
        ...state,
        tags: action.payload[0].tags,
        articles: action.payload[1].articles,
        articlesCount: action.payload[1].articlesCount,
        currentPage: 0,
        tab: action.tab
      };
    case 'HOME_PAGE_UNLOADED':
      return {
        ...state,
        articles: null,
        tags: null,
        tab: null,
        articlesCount: null,
        currentPage: null,
        outstandingActions: null,
        viewChangeCounter: state.viewChangeCounter + 1
      };
    case 'CHANGE_TAB':
      return {
        ...state,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        tab: action.tab,
        currentPage: 0,
        tag: null
      };
    case 'APPLY_TAG_FILTER':
      return {
        ...state,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        tab: null,
        tag: action.tag,
        currentPage: 0
      };
  }

  return state;
};
