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

const initialState = {
  article: undefined,
  inProgress: false,
  errors: undefined,
};

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    articlePageUnloaded: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getArticle.fulfilled, (state, action) => {
      state.article = action.payload.article;
      state.inProgress = false;
    });

    builder.addCase(createArticle.fulfilled, (state) => {
      state.inProgress = false;
    });

    builder.addCase(createArticle.rejected, (state, action) => {
      state.errors = action.error.errors;
      state.inProgress = false;
    });

    builder.addCase(updateArticle.fulfilled, (state) => {
      state.inProgress = false;
    });

    builder.addCase(updateArticle.rejected, (state, action) => {
      state.errors = action.error.errors;
      state.inProgress = false;
    });

    builder.addMatcher(
      (action) => action.type.endsWith('/pending'),
      (state) => {
        state.inProgress = true;
      }
    );

    builder.addDefaultCase((state) => {
      state.inProgress = false;
    });
  },
});

export const { articlePageUnloaded } = articleSlice.actions;

export default articleSlice.reducer;
