import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import agent from '../../agent';
import { isApiError, loadingReducer, Status } from '../../common/utils';
import { selectIsAuthenticated, selectUser } from '../auth/authSlice';

/**
 * @typedef  {object}   CommentsState
 * @property {Status}   status
 * @property {number[]} ids
 * @property {Record<string, import('../../agent').Comment>} entities
 * @property {Record<string, string[]>} errors
 */

const commentAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

/**
 * Send a create request
 *
 * @param {object} argument
 * @param {string} argument.articleSlug
 * @param {object} argument.comment
 * @param {string} argument.comment.body
 */
export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ articleSlug, comment: newComment }, thunkApi) => {
    try {
      const { comment } = await agent.Comments.create(articleSlug, newComment);

      return comment;
    } catch (error) {
      if (isApiError(error)) {
        return thunkApi.rejectWithValue(error);
      }

      throw error;
    }
  },
  {
    condition: (_, { getState }) =>
      selectIsAuthenticated(getState()) && !selectIsLoading(getState()),
    getPendingMeta: (_, { getState }) => ({ author: selectUser(getState()) }),
  }
);

/**
 * Send a get all request
 *
 * @param {string} articleSlug
 */
export const getCommentsForArticle = createAsyncThunk(
  'comments/getCommentsForArticle',
  async (articleSlug) => {
    const { comments } = await agent.Comments.forArticle(articleSlug);

    return comments;
  },
  {
    condition: (_, { getState }) => !selectIsLoading(getState()),
  }
);

/**
 * Send a remove request
 *
 * @param {object} argument
 * @param {string} argument.articleSlug
 * @param {number} argument.commentId
 */
export const removeComment = createAsyncThunk(
  'comments/removeComment',
  async ({ articleSlug, commentId }) => {
    await agent.Comments.delete(articleSlug, commentId);
  },
  {
    condition: ({ commentId }, { getState }) =>
      selectIsAuthenticated(getState()) &&
      selectCommentsSlice(getState()).ids.includes(commentId) &&
      !selectIsLoading(getState()),
  }
);

/**
 * @type {CommentsState}
 */
const initialState = commentAdapter.getInitialState({
  status: Status.IDLE,
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createComment.pending, (state, action) => {
        state.status = Status.LOADING;

        if (action.meta.arg.comment.body) {
          commentAdapter.addOne(state, {
            ...action.meta.arg.comment,
            author: action.meta.author,
            id: action.meta.requestId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.status = Status.SUCCESS;
        commentAdapter.updateOne(state, {
          id: action.meta.requestId,
          changes: action.payload,
        });
        delete state.errors;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.status = Status.FAILURE;
        state.errors = action.payload?.errors;
        commentAdapter.removeOne(state, action.meta.requestId);
      });

    builder.addCase(getCommentsForArticle.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      commentAdapter.setAll(state, action.payload);
    });

    builder.addCase(removeComment.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      commentAdapter.removeOne(state, action.meta.arg.commentId);
    });

    builder.addMatcher(
      (action) => /comments\/.*\/pending/.test(action.type),
      loadingReducer
    );
  },
});

/**
 * Get comments state
 *
 * @param {object} state
 * @returns {CommentsState}
 */
const selectCommentsSlice = (state) => state.comments;

const commentSelectors = commentAdapter.getSelectors(selectCommentsSlice);

/**
 * Get all comments
 *
 * @param {object} state
 * @returns {import('../../agent').Comment[]}
 */
export const selectAllComments = commentSelectors.selectAll;

/**
 * Get one comment
 *
 * @param {number} commentId
 * @returns {import('@reduxjs/toolkit').Selector<object, import('../../agent').Comment>}
 */
const selectCommentById = (commentId) => (state) =>
  commentSelectors.selectById(state, commentId);

/**
 * Get is the comment's author
 *
 * @param {number} commentId
 * @returns {import('@reduxjs/toolkit').Selector<object, boolean>}
 */
export const selectIsAuthor = (commentId) =>
  createSelector(
    selectCommentById(commentId),
    selectUser,
    (comment, currentUser) => currentUser?.username === comment?.author.username
  );

/**
 * Get is loading
 *
 * @param {object} state
 * @returns {boolean}
 */
export const selectIsLoading = (state) =>
  selectCommentsSlice(state).status === Status.LOADING;

/**
 * Get is errors
 *
 * @param {object} state
 * @returns {Record<string, string[]>}
 */
export const selectErrors = (state) => selectCommentsSlice(state).errors;

export default commentsSlice.reducer;
