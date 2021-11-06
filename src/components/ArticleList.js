import React from "react";
import ArticlePreview from "./ArticlePreview";
import ListPagination from "./ListPagination";

const ArticleList = props => {
  let pageArticles;
  const { articles, pager, currentPage } = props;
  if (!articles) {
    return <div className="article-preview">Loading...</div>;
  }

  if (!articles.length) {
    return <div className="article-preview">No articles are here... yet.</div>;
  } else {
    pageArticles = articles.slice(currentPage, currentPage + 5);
  }

  return (
    <React.Fragment>
      {pageArticles.map(article => {
        return <ArticlePreview article={article} key={article.slug} />;
      })}

      <ListPagination
        pager={pager}
        articles={articles}
        articlesCount={articles.length}
        currentPage={currentPage}
      />
    </React.Fragment>
  );
};

export default ArticleList;
