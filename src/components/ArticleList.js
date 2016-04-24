'use strict';

const ArticlePreview = require('./ArticlePreview');
const React = require('react');
const agent = require('../agent');
const store = require('../store');

const ListPagination = props => {
  if (props.articlesCount < 10) {
    return null;
  }

  const range = [];
  for (let i = 0; i < Math.ceil(props.articlesCount / 10); ++i) {
    range.push(i);
  }

  return (
    <nav>
      <ul className="pagination">

        {
          range.map(v => {
            const isCurrent = v === props.currentPage;
            const setPage = ev => {
              ev.preventDefault();
              store.dispatch({
                type: 'SET_PAGE',
                page: v,
                payload: agent.Articles.all(v)
              });
            };
            return (
              <li
                className={ isCurrent ? 'page-item active' : 'page-item' }
                onClick={setPage}
                key={v.toString()}>

                <a className="page-link" href="">{v + 1}</a>

              </li>
            );
          })
        }

      </ul>
    </nav>
  );
};

const ArticleList = props => {
  if (!props.articles) {
    return (
      <div className="article-preview">Loading...</div>
    );
  }

  if (props.articles.length === 0) {
    return (
      <div className="article-preview">
        No articles are here... yet.
      </div>
    );
  }

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
        articlesCount={props.articlesCount}
        currentPage={props.currentPage} />
    </div>
  );
};

module.exports = ArticleList;
