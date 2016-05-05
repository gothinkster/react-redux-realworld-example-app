'use strict';

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PROFILE_FAVORITES_PAGE_LOADED':
      state = Object.assign({}, state, {
        profile: action.payload[0].profile,
        articles: action.payload[1].articles,
        articlesCount: action.payload[1].articlesCount,
        currentPage: 0
      });
      break;
    case 'PROFILE_FAVORITES_PAGE_UNLOADED':
      if (state.outstandingActions) {
        state.outstandingActions.forEach(promise => promise.cancel());
      }
      return Object.assign({}, state, {
        outstandingActions: null
      });
  }

  return state;
};
