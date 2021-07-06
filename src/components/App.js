import { push } from 'connected-react-router';
import React, { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Home from '../components/Home';
import { appLoad, clearRedirect } from '../reducers/common';
import Header from './Header';

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

function App() {
  const dispatch = useDispatch()
  const redirectTo = useSelector(state => state.common.redirectTo)
  const appLoaded = useSelector(state => state.common.appLoaded)

  useEffect(() => {
    if (redirectTo) {
      dispatch(push(redirectTo));
      dispatch(clearRedirect());
    }
  }, [redirectTo]);

  useEffect(() => {
    const token = window.localStorage.getItem('jwt');
    dispatch(appLoad(token));
  }, []);

  if (appLoaded) {
    return (
      <>
        <Header />
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/editor/:slug" component={Editor} />
            <Route path="/editor" component={Editor} />
            <Route path="/article/:slug" component={Article} />
            <Route path="/settings" component={Settings} />
            <Route path="/@:username/favorites" component={Profile} />
            <Route path="/@:username" component={Profile} />
          </Switch>
        </Suspense>
      </>
    );
  }
  return (
    <>
      <Header />
      <p>Loading...</p>
    </>
  );
}

export default App;
