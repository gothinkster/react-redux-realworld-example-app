import { configureStore } from '@reduxjs/toolkit';
import { promiseMiddleware, localStorageMiddleware } from './middleware';
import createRootReducer from './reducer';

import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

// Build the middleware for intercepting and dispatching navigation actions
const myRouterMiddleware = routerMiddleware(history);

export const store = configureStore({
  reducer: createRootReducer(history),
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware => [
    myRouterMiddleware,
    promiseMiddleware,
    localStorageMiddleware,
    ...getDefaultMiddleware({ serializableCheck: false }),
  ],
});
