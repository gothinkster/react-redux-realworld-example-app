'use strict';

module.exports = (state, action) => {
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
      state = Object.assign({}, state, {
        viewChangeCounter: state.viewChangeCounter + 1
      });
      delete state.articles;
      delete state.tags;
      delete state.tab;
      delete state.articlesCount;
      delete state.currentPage;
      break;
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
