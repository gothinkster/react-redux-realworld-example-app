import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import agent from '../agent';

export const getArticle = createAsyncThunk(
  'article/getArticle',
  agent.Articles.get
);

export const getCommentsForArticle = createAsyncThunk(
  'article/getCommentsForArticle',
  agent.Comments.forArticle
);

export const addComment = createAsyncThunk(
  'article/addComment',
  ({ slug, comment }) => agent.Comments.create(slug, comment)
);

export const deleteComment = createAsyncThunk(
  'article/deleteComment',
  async ({ slug, commentId }, { rejectWithValue }) => {
    try {
      agent.Comments.delete(slug, commentId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        return rejectWithValue(error);
      }
    }
  }
);

export const articlePageLoaded = slug => dispatch =>
  Promise.all([
    dispatch(getArticle(slug)),
    dispatch(getCommentsForArticle(slug)),
  ]);

const initialState = {
  article: undefined,
  comments: [],
  commentErrors: undefined,
};

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    articlePageUnloaded: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(getArticle.fulfilled, (state, action) => {
      state.article = action.payload.article;
    });

    builder.addCase(getCommentsForArticle.fulfilled, (state, action) => {
      state.comments = action.payload.comments;
    });

    builder.addCase(addComment.fulfilled, (state, action) => {
      state.comments.concat(action.payload.comment);
    });

    builder.addCase(addComment.rejected, (state, action) => {
      state.commentErrors = action.payload.errors;
    });

    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.comments = state.comments.filter(
        comment => comment.id === action.meta.arg.commentId
      );
    });
  },
});

export const { articlePageUnloaded } = articleSlice.actions;

export default articleSlice.reducer;
