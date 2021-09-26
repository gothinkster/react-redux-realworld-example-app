import ArticleActions from "./ArticleActions";
import { Link } from "react-router-dom";
import React from "react";

const ArticleMeta = (props) => {
  const article = props.article;
  return (
    <div className="article-meta">
      <Link to={`/@${article.author.username}`}>
        <img
          src={
            article.author.image !== ""
              ? article.author.image
              : "https://icons.iconarchive.com/icons/google/noto-emoji-smileys/512/10001-grinning-face-icon.png"
          }
          alt={article.author.username}
        />
      </Link>

      <div className="info">
        <Link to={`/@${article.author.username}`} className="author">
          {article.author.username}
        </Link>
        <span className="date">
          {new Date(article.createdAt).toDateString()}
        </span>
      </div>

      <ArticleActions canModify={props.canModify} article={article} />
    </div>
  );
};

export default ArticleMeta;
