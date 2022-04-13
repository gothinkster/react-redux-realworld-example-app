import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import App from './components/App';
import store from './app/store';

// const _history = createBrowserHistory()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        {/* <ConnectedRouter history={history}> */}
        <App />
        {/* </ConnectedRouter> */}
      </Router>
    </Provider>
  </React.StrictMode>
);
// https://www.cypress.io/blog/2018/11/14/testing-redux-store/
/* istanbul ignore else */
if (window.Cypress) {
  window.store = store;
}
