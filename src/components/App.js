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
const AuthScreen = lazy(() =>
  import(
    '../features/auth/AuthScreen' /* webpackChunkName: "AuthScreen", webpackPrefetch: true  */
  )
);
const Profile = lazy(() =>
  import(
    '../components/Profile' /* webpackChunkName: "Profile", webpackPrefetch: true  */
  )
);
const SettingsScreen = lazy(() =>
  import(
    '../features/auth/SettingsScreen' /* webpackChunkName: "SettingsScreen", webpackPrefetch: true  */
  )
);

function App() {
  const dispatch = useDispatch();
  const redirectTo = useSelector((state) => state.common.redirectTo);
  const appLoaded = useSelector((state) => state.common.appLoaded);

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
            <Route path="/login" component={AuthScreen} />
            <Route path="/register" component={AuthScreen} />
            <Route path="/editor/:slug" component={Editor} />
            <Route path="/editor" component={Editor} />
            <Route path="/article/:slug" component={Article} />
            <Route path="/settings" component={SettingsScreen} />
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
