'use strict';

export default (state, action) => {
  switch (action.type) {
    case 'LOGIN':
    case 'REGISTER':
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload.errors : null,
        redirectTo: action.error ? null : '/',
        token: action.error ? null : action.payload.user.token,
        currentUser: action.error ? null : action.payload.user
      };
    case 'LOGIN_PAGE_UNLOADED':
    case 'REGISTER_PAGE_UNLOADED':
      return {
        ...state,
        errors: null,
        username: null,
        email: null,
        password: null,
        inProgress: null,
        outstandingActions: null,
        viewChangeCounter: state.viewChangeCounter + 1
      };
    case 'ASYNC_START':
      if (action.subtype === 'LOGIN' || action.subtype === 'REGISTER') {
        return { ...state, inProgress: true };
      }
      break;
    case 'LOGOUT':
      return { ...state, redirectTo: '/', token: null, currentUser: null };
  }

  return state;
};
