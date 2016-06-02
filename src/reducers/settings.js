'use strict';

export default (state, action) => {
  switch (action.type) {
    case 'SETTINGS_SAVED':
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload.errors : null,
        redirectTo: action.error ? null : '/',
        currentUser: action.error ? null : action.payload.user
      };
    case 'SETTINGS_PAGE_UNLOADED':
      return {
        ...state,
        errors: null,
        inProgress: null,
        outstandingActions: null,
        viewChangeCounter: state.viewChangeCounter + 1
      };
    case 'ASYNC_START':
      return {
        ...state,
        inProgress: true
      };
  }

  return state;
};
