import { LOAD_TAGS, CHECK_TAG } from "../constants/actionTypes";

export default (state = {}, action) => {
  switch (action.type) {
    case LOAD_TAGS:
      return {
        ...state,
        tags: action.payload
      };

    case CHECK_TAG:
      let tagArr = state.tags;
      let { articles } = state.articleList;
      tagArr[action.payload.index].selected = action.payload.value;

      return {
        ...state,
        articleList: articles,
        tags: tagArr
      };

    default:
      return state;
  }
};
