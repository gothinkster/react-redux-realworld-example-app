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
  favorite: payload =>
    dispatch({
      type: ARTICLE_FAVORITED,
      payload
    }),
  unfavorite: slug =>
    dispatch({
      type: ARTICLE_UNFAVORITED,
      payload: agent.Articles.unfavorite(slug)
    })
});

const ArticlePreview = props => {
  const {
    article: {
      views,
      slug,
      favorited,
      author: { username },
      createdAt,
      title,
      tags,
      favoritesCount,
      type
    },
    favorite,
    unfavorite
  } = props;

  const favoriteButtonClass = favorited ? FAVORITED_CLASS : NOT_FAVORITED_CLASS;

  const handleClick = ev => {
    ev.preventDefault();
    const { article } = props;
    if (favorited) {
      unfavorite(slug);
    } else {
      favorite({ article });
    }
  };

  const onHandleLinkClick = () => {
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
      <span className="viewsCounter">This article has {views || 0} views</span>
      <Link
        to={`/article/${slug}`}
        onClick={onHandleLinkClick}
        className="preview-link"
      >
        <h1>{title}</h1>
        <span className="date">{type}</span>
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
