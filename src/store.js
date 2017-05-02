import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger'
import { promiseMiddleware, localStorageMiddleware } from './middleware';
import reducer from './reducer';

const getMiddleware = () => {
  if (process.env.NODE_ENV === 'production') {
    return applyMiddleware(promiseMiddleware, localStorageMiddleware);
  } else {
    // Enable additional logging in non-production environments.
    return applyMiddleware(promiseMiddleware, localStorageMiddleware, createLogger())
  }
}

const store = createStore(reducer, getMiddleware(), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store;
