import {
  ARTICLE_PAGE_LOADED,
  ARTICLE_PAGE_UNLOADED,
  ADD_COMMENT,
  DELETE_COMMENT
} from '../constants/actionTypes';

const defaultState = {
  article: {
    title: '',
    slug: '',
    body: '',
    createdAt: '',
    updatedAt: '',
    tagList: [],
    description: '',
    author: {
      username: '',
      bio: null,
      image: '',
      following: false
    },
    favorited: false,
    favoritesCount: 0
  },
  comments: [
    {
      id: 0,
      createdAt: '',
      updatedAt: '',
      body: '',
      author: {
        username: '',
        bio: null,
        image: '',
        following: false
      }
    }
  ],
  commentErrors: null
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case ARTICLE_PAGE_LOADED:
      return {
        ...state,
        article: action.payload[0].article,
        comments: action.payload[1].comments
      };
    case ARTICLE_PAGE_UNLOADED:
      return {};
    case ADD_COMMENT:
      return {
        ...state,
        commentErrors: action.error ? action.payload.errors : null,
        comments: action.error ?
          null :
          (state.comments || []).concat([action.payload.comment])
      };
    case DELETE_COMMENT:
      const commentId = action.commentId
      return {
        ...state,
        comments: state.comments.filter(comment => comment.id !== commentId)
      };
    default:
      return state;
  }
};
