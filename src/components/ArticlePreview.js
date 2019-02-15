import React from 'react';
import { Link } from 'react-router-dom';
import agent from '../agent';
import { connect } from 'react-redux';
import { ARTICLE_WISHLISTED, ARTICLE_UNWISHLISTED } from '../constants/actionTypes';

const WISHLISTED_CLASS = 'btn btn-sm btn-primary';
const NOT_WISHLISTED_CLASS = 'btn btn-sm btn-outline-primary';

const mapDispatchToProps = dispatch => ({
  wishlist: slug => dispatch({
    type: ARTICLE_WISHLISTED,
    payload: agent.Articles.wishlist(slug)
  }),
  unwishlist: slug => dispatch({
    type: ARTICLE_UNWISHLISTED,
    payload: agent.Articles.unwishlist(slug)
  })
});

const ArticlePreview = props => {
  const article = props.article;
  const wishlistButtonClass = article.whishlisted ?
    WISHLISTED_CLASS :
    NOT_WISHLISTED_CLASS;

  const handleClick = ev => {
    ev.preventDefault();
    if (article.whishlisted) {
      props.unwishlist(article.slug);
    } else {
      props.wishlist(article.slug);
    }
  };

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/@${article.author.username}`}>
          <img src={article.author.image} alt={article.author.username} />
        </Link>

        <div className="info">
          <Link className="author" to={`/@${article.author.username}`}>
            {article.author.username}
          </Link>
          <span className="date">
            {new Date(article.createdAt).toDateString()}
          </span>
        </div>

        <div className="pull-xs-right">
          <button className={wishlistButtonClass} onClick={handleClick}>
            <i className="ion-heart"></i> {article.wishlistsCount}
          </button>
        </div>
      </div>

      <Link to={`/article/${article.slug}`} className="preview-link">
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
      </Link>
    </div>
  );
}

export default connect(() => ({}), mapDispatchToProps)(ArticlePreview);
