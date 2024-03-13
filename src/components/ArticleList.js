import React, { memo } from 'react';
import { useSelector } from 'react-redux';

import ArticlePreview from './ArticlePreview';
import ListPagination from './ListPagination';

/**
 * List all articles and show pagination
 *
 * @example
 * <ArticleList />
 */
function ArticleList() {
  const articles = useSelector((state) => state.articleList.articles);

  if (!articles) {
    return <div className="article-preview">Loading...</div>;
  }

  if (articles.length === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  return (
    <>
      {articles.map((article) => (
        <ArticlePreview article={article} key={article.slug} />
      ))}

      <ListPagination />
    </>
  );
}

export default memo(ArticleList);
