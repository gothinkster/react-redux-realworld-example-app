'use strict';

const agent = require('./agent');

exports.promiseMiddleware = store => next => action => {
  if (isPromise(action.payload)) {
    store.dispatch({ type: 'ASYNC_START', subtype: action.type });
    const initialView = store.getState().viewChangeCounter;
    action.payload.then(
      res => {
        // The view might have changed mid-promise, so if the view unloaded,
        // don't dispatch the action.
        const finalView = store.getState().viewChangeCounter;
        if (finalView !== initialView) {
          return;
        }
        console.log('RESULT', res);
        action.payload = res;
        store.dispatch(action);
      },
      error => {
        const finalView = store.getState().viewChangeCounter;
        if (finalView !== initialView) {
          return;
        }
        console.log('ERROR', error);
        action.error = true;
        action.payload = error.response.body;
        store.dispatch(action);
      }
    );

    return;
  }

  next(action);
};

exports.localStorageMiddleware = store => next => action => {
  if (action.type === 'REGISTER' || action.type === 'LOGIN') {
    if (!action.error) {
      window.localStorage.setItem('jwt', action.payload.user.token);
      agent.setToken(action.payload.user.token);
    }
  } else if (action.type === 'LOGOUT') {
    window.localStorage.setItem('jwt', '');
    agent.setToken(null);
  }

  next(action);
};

function isPromise(v) {
  return v && typeof v.then === 'function';
}
