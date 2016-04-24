'use strict';

module.exports = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
    case 'REGISTER':
      state = Object.assign({}, state);
      state.inProgress = false;
      if (action.error) {
        state.errors = action.payload.errors;
      } else {
        state.redirectTo = '/';
        state.token = action.payload.user.token;
        state.currentUser = action.payload.user;
      }
      break;
    case 'LOGIN_PAGE_UNLOADED':
    case 'REGISTER_PAGE_UNLOADED':
      state = Object.assign({}, state);
      const props = ['errors', 'username', 'email', 'password', 'inProgress']
      for (const key of props) {
        delete state[key];
      }
      break;
    case 'ASYNC_START':
      if (action.subtype === 'LOGIN' || action.subtype === 'REGISTER') {
        state = Object.assign({}, state);
        state.inProgress = true;
      }
      break;
    case 'LOGOUT':
      state = Object.assign({}, state, {
        redirectTo: '/',
        token: null,
        currentUser: undefined
      });
      break;
  }

  return state;
};
