'use strict';

module.exports = (state = defaultState, action) => {
  switch (action.type) {
    case 'PROFILE_PAGE_LOADED':
      state = Object.assign({}, state, {
        profile: action.payload[0].profile,
        articles: action.payload[1].articles,
        articlesCount: action.payload[1].articlesCount,
        currentPage: 0
      });
      break;
    case 'PROFILE_PAGE_UNLOADED':
      state = Object.assign({}, state);
      delete state.profile;
      delete state.articles;
      delete state.articlesCount;
      delete state.currentPage;
      break;
    case 'FOLLOW_USER':
    case 'UNFOLLOW_USER':
      state = Object.assign({}, state, {
        profile: action.payload.profile
      });
      break;
  }

  return state;
};
