import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import store from './store';

import App from './components/App';
import Article from './components/Article';
import Editor from './components/Editor';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import ProfileFavorites from './components/ProfileFavorites';
import Register from './components/Register';
import Settings from './components/Settings';

ReactDOM.render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="login" component={Login} />
        <Route path="register" component={Register} />
        <Route path="editor" component={Editor} />
        <Route path="editor/:slug" component={Editor} />
        <Route path="article/:id" component={Article} />
        <Route path="settings" component={Settings} />
        <Route path="@:username" component={Profile} />
        <Route path="@:username/favorites" component={ProfileFavorites} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'));

import { createStore } from 'redux';

const defaultState = { checked: false };

// well-written reducer should not have side effects -> same result every time called
// reducers do not modify or rely on state
// good practice to encapsulate a lot of logic in reducers, easy to test, debug, refactor
const reducer = function(state = defaultState, action) {
  switch (action.type) {
    case 'TOGGLE':
      return { ...state, checked: !state.checked };
  }
  return state;
}

const store = createStore(reducer);

class App extends React.Component {
  constructor() {
    super();
    this.state = store.getState();
  }

  // componentWillMount function is a "react lifecycle hook"
  // called when component is created, so put initialization logic here
  componentWillMount() {
    // setState function modifies react component's own internal state
    // render function is called whenever state of the app changes
    store.describe(() => this.setState(store.getState()));
  }

  render() {
    return (
      <div>
        <h1>To-Do List</h1>
        <div>
          Learn Redux
        </div>
      </div>

      // <h1>Hello, World!</h1>
    );
  }
}

ReactDOM.render((
  <App />
), document.getElementById('main'));
