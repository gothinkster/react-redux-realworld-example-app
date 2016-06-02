'use strict';

export default (state, action) => {
  switch (action.type) {
    case 'APP_LOAD':
      const assignments = {
        token: action.token || null,
        appLoaded: true
      };
      if (action.payload) {
        assignments.currentUser = action.payload.user;
      }
      state = Object.assign({}, state, assignments)
      break;
    case 'REDIRECT':
      state = Object.assign({}, state, { redirectTo: null });
      break;
    case 'UPDATE_FIELD':
      state = Object.assign({}, state, { [action.key]: action.value });
      break;
  }

  return state;
};
