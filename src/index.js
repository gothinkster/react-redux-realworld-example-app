import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import React from 'react';
// import { createBrowserHistory } from "history";
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { store } from './store';
// import { ConnectedRouter } from 'connected-react-router';

import App from './components/App';

// const _history = createBrowserHistory()

createRoot(document.getElementById('root'))
.render(
  <Provider store={store}>
    <Router>
    {/* <ConnectedRouter history={history}> */}
      <App />
    {/* </ConnectedRouter> */}
    </Router>
    
  </Provider>
);
