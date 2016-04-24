'use strict';

const React = require('react');
const Router = require('react-router');
const agent = require('../agent');
const store = require('../store');

const FAVORITED_CLASS = 'btn btn-sm btn-primary';
const NOT_FAVORITED_CLASS = 'btn btn-sm btn-outline-primary';

const ArticlePreview = props => {
  const article = props.article;
  const favoriteButtonClass = article.favorited ?
    FAVORITED_CLASS :
    NOT_FAVORITED_CLASS;

  const handleClick = ev => {
    ev.preventDefault();
    if (article.favorited) {
      store.dispatch({
        type: 'ARTICLE_UNFAVORITED',
        payload: agent.Articles.unfavorite(article.slug)
      });
    } else {
      store.dispatch({
        type: 'ARTICLE_FAVORITED',
        payload: agent.Articles.favorite(article.slug)
      });
    }
  };

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Router.Link to={`@${article.author.username}`}>
          <img src={article.author.image} />
        </Router.Link>

        <div className="info">
          <Router.Link className="author" to={`@${article.author.username}`}>
            {article.author.username}
          </Router.Link>
          <span className="date">
            {new Date(article.createdAt).toDateString()}
          </span>
        </div>

        <div className="pull-xs-right">
          <button className={favoriteButtonClass} onClick={handleClick}>
            <i className="ion-heart"></i> {article.favoritesCount}
          </button>
        </div>
      </div>

      <Router.Link to={`article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {
            article.tagList.map(tag => {
              return (
                <li className="tag-default tag-pill tag-outline" key={tag}>
                  {tag}
                </li>
              )
            })
          }
        </ul>
      </Router.Link>
    </div>
  );
}

module.exports = ArticlePreview;
