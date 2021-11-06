import { HOME_PAGE_LOADED, HOME_PAGE_UNLOADED, ARTICLE_BEGIN } from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case HOME_PAGE_LOADED:
      return {
        ...state,
        tags: action.payload[0].tags,
        loading: false
      };
    case HOME_PAGE_UNLOADED:
      return {};
    case ARTICLE_BEGIN:
      return {
        ...state,
        loading: true
      }
    default:
      return state;
  }
};
