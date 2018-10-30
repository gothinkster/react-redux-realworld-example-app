import React from "react";
import { Link } from "react-router-dom";
import agent from "../agent";
import { connect } from "react-redux";
import {
  ARTICLE_FAVORITED,
  ARTICLE_UNFAVORITED
} from "../constants/actionTypes";
import { addView } from "../services/article";

const FAVORITED_CLASS = "btn btn-sm btn-primary";
const NOT_FAVORITED_CLASS = "btn btn-sm btn-outline-primary";

const mapDispatchToProps = dispatch => ({
  favorite: slug =>
    dispatch({
      type: ARTICLE_FAVORITED,
      payload: agent.Articles.favorite(slug)
    }),
  unfavorite: slug =>
    dispatch({
      type: ARTICLE_UNFAVORITED,
      payload: agent.Articles.unfavorite(slug)
    })
});

const ArticlePreview = props => {
  const {
    views,
    favorited,
    slug,
    author: { username },
    createdAt,
    title,
    tags,
    favoritesCount
  } = props.article;

  const favoriteButtonClass = favorited ? FAVORITED_CLASS : NOT_FAVORITED_CLASS;

  const handleClick = ev => {
    ev.preventDefault();
    if (favorited) {
      props.unfavorite(slug);
    } else {
      props.favorite(slug);
    }
  };

  const onHandleLinkClick = (event, slug) => {
    event.persist();
    console.log(slug);
    addView(slug);
  };

  return (
    <div className="article-preview">
      <div className="article-meta">
        <div className="info">
          <Link className="author" to={`/@${username}`}>
            {username}
          </Link>
          <span className="date">{new Date(createdAt).toDateString()}</span>
        </div>

        <div className="pull-xs-right">
          <button
            className={favoriteButtonClass}
            onClick={event => handleClick(event)}
          >
            <i className="ion-heart" /> {favoritesCount}
          </button>
        </div>
      </div>
      <span className="viewsCounter">This article has {views} views</span>
      <Link
        to={`/article/${slug}`}
        onClick={event => onHandleLinkClick(event, slug)}
        className="preview-link"
      >
        <h1>{title}</h1>
        <ul className="tag-list">
          {tags.map(tag => {
            return (
              <li className="tag-default tag-pill tag-outline" key={`${tag}`}>
                {tag}
              </li>
            );
          })}
        </ul>
      </Link>
    </div>
  );
};

export default connect(
  () => ({}),
  mapDispatchToProps
)(ArticlePreview);
