'use strict';

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PROFILE_FAVORITES_PAGE_LOADED':
      return {
        ...state,
        profile: action.payload[0].profile,
        articles: action.payload[1].articles,
        articlesCount: action.payload[1].articlesCount,
        currentPage: 0
      };
    case 'PROFILE_FAVORITES_PAGE_UNLOADED':
      return {
        ...state,
        outstandingActions: null,
        viewChangeCounter: state.viewChangeCounter + 1
      };
  }

  return state;
};
