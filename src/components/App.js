import React, { lazy, Suspense, useEffect } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';

import Header from './Header';
import { appLoad, clearRedirect } from '../reducers/common';
import { store } from '../store';
import Home from '../components/Home';
const Article = lazy(() =>
  import(
    '../components/Article' /* webpackChunkName: "Article", webpackPrefetch: true  */
  )
);
const Editor = lazy(() =>
  import(
    '../components/Editor' /* webpackChunkName: "Editor", webpackPrefetch: true  */
  )
);
const Login = lazy(() =>
  import(
    '../components/Login' /* webpackChunkName: "Login", webpackPrefetch: true  */
  )
);
const Profile = lazy(() =>
  import(
    '../components/Profile' /* webpackChunkName: "Profile", webpackPrefetch: true  */
  )
);
const Register = lazy(() =>
  import(
    '../components/Register' /* webpackChunkName: "Register", webpackPrefetch: true  */
  )
);
const Settings = lazy(() =>
  import(
    '../components/Settings' /* webpackChunkName: "Settings", webpackPrefetch: true  */
  )
);

const mapStateToProps = state => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo,
  };
};

const mapDispatchToProps = dispatch => ({
  onLoad: token => dispatch(appLoad(token)),
  onRedirect: () => dispatch(clearRedirect()),
});

function App(props) {
  useEffect(() => {
    if (props.redirectTo) {
      store.dispatch(push(props.redirectTo));
      props.onRedirect();
    }
  }, [props.redirectTo, props.onRedirect]);

  useEffect(() => {
    const token = window.localStorage.getItem('jwt');
    props.onLoad(token);
  }, []);

  if (props.appLoaded) {
    return (
      <div>
        <Header appName={props.appName} currentUser={props.currentUser} />
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/editor/:slug" component={Editor} />
            <Route path="/editor" component={Editor} />
            <Route path="/article/:id" component={Article} />
            <Route path="/settings" component={Settings} />
            <Route path="/@:username/favorites" component={Profile} />
            <Route path="/@:username" component={Profile} />
          </Switch>
        </Suspense>
      </div>
    );
  }
  return (
    <div>
      <Header appName={props.appName} currentUser={props.currentUser} />
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
