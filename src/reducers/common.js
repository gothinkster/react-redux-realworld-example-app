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
    case 'ASYNC_START':
      const promise = Object.assign(action.promise, { cancel: action.cancel })
      return Object.assign({}, state, {
        outstandingActions: (state.outstandingActions || []).concat([promise])
      });
    case 'ASYNC_END':
      if (state.outstandingActions) {
        const filter = p => p !== action.promise;
        return Object.assign({}, state, {
          outstandingActions: state.outstandingActions.filter(filter)
        });
      }
  }

  return state;
};
