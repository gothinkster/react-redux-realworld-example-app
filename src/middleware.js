import agent from './agent';
import { login, register } from './reducers/auth';
import { logout } from './reducers/common';

const localStorageMiddleware = store => next => action => {
  switch (action.type) {
    case register.fulfilled.type:
    case login.fulfilled.type:
      window.localStorage.setItem('jwt', action.payload.user.token);
      agent.setToken(action.payload.user.token);
      break;

    case logout.type:
      window.localStorage.removeItem('jwt');
      agent.setToken(undefined);
      break;

    default:
      return next(action);
  }
};

export { localStorageMiddleware };
