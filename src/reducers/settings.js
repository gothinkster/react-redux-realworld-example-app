'use strict';

module.exports = (state, action) => {
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
      state = Object.assign({}, state, {
        viewChangeCounter: state.viewChangeCounter + 1
      });
      for (const key of ['errors', 'inProgress']) {
        delete state[key];
      }
      break;
    case 'ASYNC_START':
      if (action.subtype === 'SETTINGS_SAVED') {
        state = Object.assign({}, state, { inProgress: true });
      }
      break;
  }

  return state;
};
