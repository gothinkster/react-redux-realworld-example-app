import ArticlePreview from "./ArticlePreview";
import ListPagination from "./ListPagination";
import React from "react";

const ArticleList = props => {
  const { articles, currentPage, pager } = props;
  if (!articles) {
    return <div className="article-preview">Loading...</div>;
  }

  if (!articles.length) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  const pageArticles = articles.slice(currentPage, currentPage + 5);

  return (
    <React.Fragment>
      {pageArticles.map(article => {
        return <ArticlePreview article={article} key={article.slug} />;
      })}

      <ListPagination
        pager={pager}
        articlesCount={articles.length}
        currentPage={currentPage}
      />
    </React.Fragment>
  );
};

export default ArticleList;
