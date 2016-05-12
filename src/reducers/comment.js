'use strict';

export default (state, action) => {
  switch (action.type) {
    case 'ADD_COMMENT':
      state = Object.assign({}, state);
      if (action.error) {
        state.commentErrors = action.payload.errors;
      } else {
        state.comments = state.comments || [];
        state.comments.unshift(action.payload.comment);
      }
      break;
    case 'DELETE_COMMENT':
      state = Object.assign({}, state);
      const filter = comment => comment.id !== action.commentId;
      state.comments = _.filter(state.comments, filter);
      break;
  }

  return state;
};
