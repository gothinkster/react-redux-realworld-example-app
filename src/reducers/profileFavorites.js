'use strict';

export default (state = defaultState, action) => {
  switch (action.type) {
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
