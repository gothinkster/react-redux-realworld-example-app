import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import agent from '../agent';
import { articlePageUnloaded, createArticle, updateArticle } from './article';
import { profilePageUnloaded } from './profile';
import { homePageUnloaded } from './articleList';
import {
  getUser,
  login,
  logout,
  register,
  setToken,
  updateUser,
} from '../features/auth/authSlice';

export const deleteArticle = createAsyncThunk(
  'common/deleteArticle',
  agent.Articles.del
);

export const appLoad = (token) => (dispatch) => {
  dispatch(commonSlice.actions.loadApp());

  if (token) {
    agent.setToken(token);
    dispatch(setToken(token));
    return dispatch(getUser());
  }
};

const initialState = {
  appName: 'Conduit',
  appLoaded: false,
  viewChangeCounter: 0,
  redirectTo: undefined,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    loadApp(state) {
      state.appLoaded = true;
    },
    clearRedirect(state) {
      delete state.redirectTo;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteArticle.fulfilled, (state) => {
      state.redirectTo = '/';
    });

    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.redirectTo = '/';
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.redirectTo = '/';
    });

    builder.addCase(register.fulfilled, (state, action) => {
      state.redirectTo = '/';
    });

    builder.addCase(logout, (state) => {
      state.redirectTo = '/';
    });

    builder.addCase(createArticle.fulfilled, (state, action) => {
      state.redirectTo = `/article/${action.payload.article.slug}`;
    });

    builder.addCase(updateArticle.fulfilled, (state, action) => {
      state.redirectTo = `/article/${action.payload.article.slug}`;
    });

    builder.addMatcher(
      (action) =>
        [
          articlePageUnloaded.type,
          homePageUnloaded.type,
          profilePageUnloaded.type,
        ].includes(action.type),
      (state) => {
        state.viewChangeCounter++;
      }
    );
  },
});

export const { clearRedirect } = commonSlice.actions;

export default commonSlice.reducer;
