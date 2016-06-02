'use strict';

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PROFILE_PAGE_LOADED':
      return {
        ...state,
        profile: action.payload[0].profile,
        articles: action.payload[1].articles,
        articlesCount: action.payload[1].articlesCount,
        currentPage: 0
      };
    case 'PROFILE_PAGE_UNLOADED':
      return {
        ...state,
        profile: null,
        articles: null,
        articlesCount: null,
        currentPage: null,
        outstandingActions: null,
        viewChangeCounter: viewChangeCounter + 1
      };
    case 'FOLLOW_USER':
    case 'UNFOLLOW_USER':
      return {
        ...state,
        profile: action.payload.profile
      };
  }

  return state;
};
