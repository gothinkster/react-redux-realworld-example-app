import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import agent from '../agent';
import { profilePageUnloaded } from './profile';

export const changeTab = (tab) => (dispatch) => {
  dispatch(articleListSlice.actions.changeTab(tab));
  return dispatch(getAllArticles());
};

export const getArticlesByAuthor = createAsyncThunk(
  'articleList/getArticlesByAuthor',
  ({ author, page } = {}) => agent.Articles.byAuthor(author, page)
);

export const getAllArticles = createAsyncThunk(
  'articleList/getAll',
  ({ page, author, tag, favorited } = {}, thunkApi) =>
    thunkApi.getState().articleList.tab === 'feed'
      ? agent.Articles.feed(page)
      : agent.Articles.all({
          page: page ?? thunkApi.getState().articleList.currentPage,
          author: author ?? thunkApi.getState().articleList.author,
          tag: tag ?? thunkApi.getState().articleList.tag,
          favorited: favorited ?? thunkApi.getState().articleList.favorited,
          limit: thunkApi.getState().articleList.articlesPerPage ?? 10,
        })
);

export const getArticlesByTag = createAsyncThunk(
  'articleList/getArticlesByTag',
  ({ tag, page } = {}) => agent.Articles.byTag(tag, page)
);

export const getFavoriteArticles = createAsyncThunk(
  'articleList/getFavoriteArticles',
  ({ username, page } = {}) => agent.Articles.favoritedBy(username, page)
);

export const favoriteArticle = createAsyncThunk(
  'articleList/favoriteArticle',
  agent.Articles.favorite
);

export const unfavoriteArticle = createAsyncThunk(
  'articleList/unfavoriteArticle',
  agent.Articles.unfavorite
);

const initialState = {
  articles: [],
  articlesCount: 0,
  currentPage: 0,
  articlesPerPage: 10,
  tab: undefined,
  tag: undefined,
  author: undefined,
  favorited: undefined,
};

const articleListSlice = createSlice({
  name: 'articleList',
  initialState,
  reducers: {
    homePageUnloaded: () => initialState,
    changeTab: (state, action) => {
      state.tab = action.payload;
      delete state.tag;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(favoriteArticle.fulfilled, (state, action) => {
      state.articles = state.articles.map((article) =>
        article.slug === action.payload.article.slug
          ? {
              ...article,
              favorited: action.payload.article.favorited,
              favoritesCount: action.payload.article.favoritesCount,
            }
          : article
      );
    });

    builder.addCase(unfavoriteArticle.fulfilled, (state, action) => {
      state.articles = state.articles.map((article) =>
        article.slug === action.payload.article.slug
          ? {
              ...article,
              favorited: action.payload.article.favorited,
              favoritesCount: action.payload.article.favoritesCount,
            }
          : article
      );
    });

    builder.addCase(getAllArticles.fulfilled, (state, action) => {
      state.articles = action.payload.articles;
      state.articlesCount = action.payload.articlesCount;
      state.currentPage = action.meta.arg?.page ?? 0;
    });

    builder.addCase(getArticlesByTag.fulfilled, (state, action) => ({
      articles: action.payload.articles,
      articlesCount: action.payload.articlesCount,
      currentPage: action.meta.arg?.page ?? 0,
      tag: action.meta.arg?.tag,
      articlesPerPage: 10,
    }));

    builder.addCase(getArticlesByAuthor.fulfilled, (_, action) => ({
      articles: action.payload.articles,
      articlesCount: action.payload.articlesCount,
      currentPage: action.meta.arg?.page ?? 0,
      author: action.meta.arg?.author,
      articlesPerPage: 5,
    }));

    builder.addCase(getFavoriteArticles.fulfilled, (_, action) => ({
      articles: action.payload.articles,
      articlesCount: action.payload.articlesCount,
      currentPage: action.meta.arg?.page ?? 0,
      favorited: action.meta.arg?.username,
      articlesPerPage: 5,
    }));

    builder.addMatcher(
      (action) => [profilePageUnloaded.type].includes(action.type),
      () => initialState
    );
  },
});

export const { homePageUnloaded } = articleListSlice.actions;

export default articleListSlice.reducer;
