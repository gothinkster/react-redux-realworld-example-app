import { render } from '@testing-library/react';
// import { ConnectedRouter } from 'connected-react-router';
import { BrowserRouter as Router } from 'react-router-dom';
// import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';

import { makeStore } from '../app/store';

export default function _render(
  ui,
  { store = makeStore() /* history = createMemoryHistory() */ } = {}
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <Router>{children}</Router>
      </Provider>
    ),
  });
}
