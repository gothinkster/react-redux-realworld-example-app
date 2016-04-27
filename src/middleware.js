'use strict';

const agent = require('./agent');

exports.promiseMiddleware = store => next => action => {
  if (isPromise(action.payload)) {
    let cancelled = false;
    if (!action.skipTracking) {
      store.dispatch({
        type: 'ASYNC_START',
        subtype: action.type,
        promise: action.payload,
        cancel: () => { cancelled = true; }
      });
    }
    action.payload.then(
      res => {
        if (cancelled) {
          return;
        }
        console.log('RESULT', res);
        action.payload = res;
        if (!action.skipTracking) {
          store.dispatch({ type: 'ASYNC_END', promise: action.payload });
        }
        store.dispatch(action);
      },
      error => {
        if (cancelled) {
          return;
        }
        console.log('ERROR', error);
        action.error = true;
        action.payload = error.response.body;
        if (!action.skipTracking) {
          store.dispatch({ type: 'ASYNC_END', promise: action.payload });
        }
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
