import React, { lazy, Suspense, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import Home from '../components/Home';
import { appLoad, clearRedirect } from '../reducers/common';
import Header from './Header';

const Article = lazy(() =>
  import(
    /* webpackChunkName: "Article", webpackPrefetch: true  */ '../components/Article'
  )
);
const Editor = lazy(() =>
  import(
    /* webpackChunkName: "Editor", webpackPrefetch: true  */ '../components/Editor'
  )
);
const AuthScreen = lazy(() =>
  import(
    /* webpackChunkName: "AuthScreen", webpackPrefetch: true  */ '../features/auth/AuthScreen'
  )
);
const Profile = lazy(() =>
  import(
    /* webpackChunkName: "Profile", webpackPrefetch: true  */ '../components/Profile'
  )
);
const SettingsScreen = lazy(() =>
  import(
    /* webpackChunkName: "SettingsScreen", webpackPrefetch: true  */ '../features/auth/SettingsScreen'
  )
);

function App() {
  const dispatch = useDispatch();
  const redirectTo = useSelector((state) => state.common.redirectTo);
  const appLoaded = useSelector((state) => state.common.appLoaded);

  useEffect(() => {
    if (redirectTo) {
      // dispatch(push(redirectTo));
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
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<AuthScreen />} />
            <Route path="/register" element={<AuthScreen isRegisterScreen />} />
            <Route path="/editor/:slug" element={<Editor />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route
              path="/@:username/favorites"
              element={<Profile isFavoritePage />}
            />
            <Route path="/@:username" element={<Profile />} />
          </Routes>
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

export default memo(App);
