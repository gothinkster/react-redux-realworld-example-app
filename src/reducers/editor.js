'use strict';

export default (state, action) => {
  switch (action.type) {
    case 'EDITOR_PAGE_LOADED':
      if (action.payload) {
        state = Object.assign({}, state, {
          articleSlug: action.payload.article.slug,
          title: action.payload.article.title,
          description: action.payload.article.description,
          body: action.payload.article.body,
          tagInput: '',
          tagList: action.payload.article.tagList
        });
      } else {
        state = Object.assign({}, state, {
          title: '',
          description: '',
          body: '',
          tagInput: '',
          tagList: ''
        });
      }
      break;
    case 'EDITOR_PAGE_UNLOADED':
      if (state.outstandingActions) {
        state.outstandingActions.forEach(promise => promise.cancel());
      }
      return Object.assign({}, state, {
        title: null,
        description: null,
        body: null,
        tagInput: null,
        tagList: null,
        errors: null,
        articleSlug: null,
        inProgress: null,
        outstandingActions: null
      });
    case 'ARTICLE_SUBMITTED':
      state = Object.assign({}, state);
      state.inProgress = null;
      if (action.error) {
        state.errors = action.payload.errors;
      } else {
        state.redirectTo = `article/${action.payload.article.slug}`;
      }
      break;
    case 'ASYNC_START':
      if (action.subtype === 'ARTICLE_SUBMITTED') {
        state = Object.assign({}, state, { inProgress: true });
      }
      break;
  }

  return state;
};
