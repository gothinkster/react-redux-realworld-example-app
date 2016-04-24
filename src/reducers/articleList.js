'use strict';

module.exports = (state, action) => {
  switch (action.type) {
    case 'ARTICLE_FAVORITED':
    case 'ARTICLE_UNFAVORITED':
      state = Object.assign({}, state);
      state.articles.forEach(article => {
        if (article.slug === action.payload.article.slug) {
          article.favorited = action.payload.article.favorited;
          article.favoritesCount = action.payload.article.favoritesCount;
        }
      });
      break;
    case 'SET_PAGE':
      state = Object.assign({}, state, {
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        currentPage: action.page
      });
      break;
  }

  return state;
};
