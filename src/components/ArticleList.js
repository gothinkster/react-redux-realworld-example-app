import React from "react";
import ArticlePreview from "./ArticlePreview";
import ListPagination from "./ListPagination";

const ArticleList = props => {
  const { articles, pager, articlesCount, currentPage } = props;
  if (!articles) {
    return <div className="article-preview">Loading...</div>;
  }

  if (!articles.length) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  return (
    <React.Fragment>
      {articles.map(article => {
        return <ArticlePreview article={article} key={article.uuid} />;
      })}

      <ListPagination
        pager={pager}
        articlesCount={articlesCount}
        currentPage={currentPage}
      />
    </React.Fragment>
  );
};

export default ArticleList;
