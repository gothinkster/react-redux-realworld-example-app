'use strict';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import agent from './agent';
import history from 'history';
import store from './store';

import Article from './components/Article';
import Editor from './components/Editor';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import ProfileFavorites from './components/ProfileFavorites';
import Register from './components/Register';
import Settings from './components/Settings';

class App extends React.Component {
  constructor() {
    super();
    this.state = store.getState();
  }

  componentDidMount() {
    store.subscribe(() => {
      this.setState(store.getState());

      if (store.getState().redirectTo) {
        this.context.router.replace(store.getState().redirectTo);
        store.dispatch({ type: 'REDIRECT' });
      }
    });

    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }

    store.dispatch({
      type: 'APP_LOAD',
      token: token,
      payload: token ? agent.Auth.current() : null,
      skipTracking: true
    });
  }

  render() {
    if (this.state.appLoaded) {
      return (
        <div>
          <Header state={this.state} />
          {this.props.children}
        </div>
      );
    }
    return (
      <div>
        <Header state={this.state} />
      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
};

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
), document.getElementById('main'));
