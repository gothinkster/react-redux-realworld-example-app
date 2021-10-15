import ArticlePreview from './ArticlePreview';
import ListPagination from './ListPagination';
import React from 'react';
import Loader from './HOC/Loader';

const ArticleList = props => {
  return (
    <div>
      {
        props.articles.map(article => {
          return (
            <ArticlePreview article={article} key={article.slug} />
          );
        })
      }

      <ListPagination
        pager={props.pager}
        articlesCount={props.articlesCount}
        currentPage={props.currentPage} />
    </div>
  );
};

export default Loader(ArticleList);
