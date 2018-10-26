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
      //let articles = state.articleList.articles.filter((article) => {
      //let filteredArticles;
      /*

            for (var tag of tagArr) {
                if (tag.selected) {
                    for (var articleTag of article.tags) {
                        if (tag.name === articleTag) {
                            return article;
                        }
                    }
                }
            }
            */
      // return article;
      //return filteredArticles;
      //});

      return {
        ...state,
        articleList: articles,
        tags: tagArr
      };

    default:
      return state;
  }
};
