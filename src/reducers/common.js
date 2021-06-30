import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import agent from '../agent';
import { articlePageUnloaded, createArticle, updateArticle } from './article';
import {
  login,
  register,
  loginPageUnloaded,
  registerPageUnloaded,
} from './auth';
import { saveSettings, settingsPageUnloaded } from './settings';
import { profilePageUnloaded } from './profile';
import { homePageUnloaded } from './articleList';

export const deleteArticle = createAsyncThunk(
  'common/deleteArticle',
  agent.Articles.del
);

export const getCurrentUser = createAsyncThunk(
  'common/getCurrentUser',
  agent.Auth.current
);

export const appLoad = token => dispatch => {
  dispatch(commonSlice.actions.loadApp());

  if (token) {
    agent.setToken(token);
    dispatch(commonSlice.actions.setToken(token));
    return dispatch(getCurrentUser());
  }
};

const initialState = {
  appName: 'Conduit',
  token: null,
  appLoaded: false,
  viewChangeCounter: 0,
  currentUser: undefined,
  redirectTo: undefined,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    loadApp(state) {
      state.appLoaded = true;
    },
    logout(state) {
      state.redirectTo = '/';
      delete state.token;
      delete state.currentUser;
    },
    clearRedirect(state) {
      delete state.redirectTo;
    },
  },
  extraReducers: builder => {
    builder.addCase(deleteArticle.fulfilled, state => {
      state.redirectTo = '/';
    });

    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.currentUser = action.payload.user;
    });

    builder.addCase(saveSettings.fulfilled, (state, action) => {
      state.redirectTo = '/';
      state.token = action.payload.user.token;
      state.currentUser = action.payload.user;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.redirectTo = '/';
      state.token = action.payload.user.token;
      state.currentUser = action.payload.user;
    });

    builder.addCase(register.fulfilled, (state, action) => {
      state.redirectTo = '/';
      state.token = action.payload.user.token;
      state.currentUser = action.payload.user;
    });

    builder.addCase(createArticle.fulfilled, (state, action) => {
      state.redirectTo = `/article/${action.payload.article.slug}`;
    });

    builder.addCase(updateArticle.fulfilled, (state, action) => {
      state.redirectTo = `/article/${action.payload.article.slug}`;
    });

    builder.addMatcher(
      action =>
        [
          articlePageUnloaded.type,
          homePageUnloaded.type,
          profilePageUnloaded.type,
          settingsPageUnloaded.type,
          loginPageUnloaded.type,
          registerPageUnloaded.type,
        ].includes(action.type),
      state => {
        state.viewChangeCounter++;
      }
    );
  },
});

export const { logout, clearRedirect } = commonSlice.actions;

export default commonSlice.reducer;
