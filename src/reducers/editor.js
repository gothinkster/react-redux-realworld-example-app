'use strict';

export default (state, action) => {
  switch (action.type) {
    case 'EDITOR_PAGE_LOADED':
      return {
        ...state,
        articleSlug: action.payload ? action.payload.article.slug : '',
        title: action.payload ? action.payload.article.title : '',
        description: action.payload ? action.payload.article.description : '',
        body: action.payload ? action.payload.article.body : '',
        tagInput: '',
        tagList: action.payload ? action.payload.article.tagList : ''
      };
    case 'EDITOR_PAGE_UNLOADED':
      return {
        ...state,
        title: null,
        description: null,
        body: null,
        tagInput: null,
        tagList: null,
        errors: null,
        articleSlug: null,
        inProgress: null,
        outstandingActions: null,
        viewChangeCounter: state.viewChangeCounter + 1
      };
    case 'ARTICLE_SUBMITTED':
      const redirectUrl = `article/${action.payload.article.slug}`;
      return {
        ...state,
        inProgress: null,
        errors: action.error ? action.payload.errors : null,
        redirectTo: action.error ? null : redirectUrl
      };
    case 'ASYNC_START':
      if (action.subtype === 'ARTICLE_SUBMITTED') {
        return { ...state, inProgress: true };
      }
      break;
    case 'ADD_TAG':
      return {
        ...state,
        tagList: state.tagList.concat([state.tagInput]),
        tagInput: ''
      };
    case 'REMOVE_TAG':
      return {
        ...state,
        tagList: state.tagList.filter(tag => tag === action.tag)
      };
  }

  return state;
};
