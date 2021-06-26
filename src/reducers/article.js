import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import agent from '../agent';

function serializeError(error) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
    };
  }

  if (typeof error === 'object' && error !== null) {
    return error;
  }

  return { message: String(error) };
}

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
  ({ slug, comment }) => agent.Comments.create(slug, { body: comment }),
  { serializeError }
);

export const deleteComment = createAsyncThunk(
  'article/deleteComment',
  ({ slug, commentId }) => agent.Comments.delete(slug, commentId),
  { serializeError }
);

export const createArticle = createAsyncThunk(
  'article/createArticle',
  agent.Articles.create,
  { serializeError }
);

export const updateArticle = createAsyncThunk(
  'article/updateArticle',
  agent.Articles.update,
  { serializeError }
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
  inProgress: false,
  errors: undefined,
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
      state.inProgress = false;
    });

    builder.addCase(getCommentsForArticle.fulfilled, (state, action) => {
      state.comments = action.payload.comments;
      state.inProgress = false;
    });

    builder.addCase(addComment.fulfilled, (state, action) => {
      state.comments.unshift(action.payload.comment);
      state.inProgress = false;
    });

    builder.addCase(addComment.rejected, (state, action) => {
      state.commentErrors = action.error.errors;
      state.inProgress = false;
    });

    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.comments = state.comments.filter(
        comment => comment.id !== action.meta.arg.commentId
      );
      state.inProgress = false;
    });

    builder.addCase(createArticle.fulfilled, state => {
      state.inProgress = false;
    });

    builder.addCase(createArticle.rejected, (state, action) => {
      state.errors = action.error.errors;
      state.inProgress = false;
    });

    builder.addCase(updateArticle.fulfilled, state => {
      state.inProgress = false;
    });

    builder.addCase(updateArticle.rejected, (state, action) => {
      state.errors = action.error.errors;
      state.inProgress = false;
    });

    builder.addMatcher(
      action => action.type.endsWith('/pending'),
      state => {
        state.inProgress = true;
      }
    );

    builder.addDefaultCase(state => {
      state.inProgress = false;
    });
  },
});

export const { articlePageUnloaded } = articleSlice.actions;

export default articleSlice.reducer;
