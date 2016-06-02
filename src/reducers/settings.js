'use strict';

export default (state, action) => {
  switch (action.type) {
    case 'SETTINGS_SAVED':
      state = Object.assign({}, state);
      state.inProgress = false;
      if (action.error) {
        state.errors = action.payload.errors;
      } else {
        state.redirectTo = '/';
        state.currentUser = action.payload.user;
      }
      break;
    case 'SETTINGS_PAGE_UNLOADED':
      return Object.assign({}, state, {
        errors: null,
        inProgress: null,
        outstandingActions: null,
        viewChangeCounter: state.viewChangeCounter + 1
      });
    case 'ASYNC_START':
      if (action.subtype === 'SETTINGS_SAVED') {
        state = Object.assign({}, state, { inProgress: true });
      }
      break;
  }

  return state;
};
